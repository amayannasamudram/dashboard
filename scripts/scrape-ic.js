#!/usr/bin/env node

// Infinite Campus grade scraper
// Uses system Chromium already installed on Pi — no extra download needed
// Run: node scripts/scrape-ic.js
// Reads IC_USERNAME + IC_PASSWORD from environment (set in .env.local on Pi)

const fs   = require("fs");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../.env.local") });

const IC_URL  = process.env.IC_URL      || "https://chandleraz.infinitecampus.org";
const USER    = process.env.IC_USERNAME;
const PASS    = process.env.IC_PASSWORD;
const OUT     = path.join(__dirname, "../data/grades.json");

if (!USER || !PASS) {
  console.error("Set IC_USERNAME and IC_PASSWORD in .env.local on Pi");
  process.exit(1);
}

async function scrape() {
  const puppeteer = require("puppeteer-core");

  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium",
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    console.log("Navigating to IC...");
    await page.goto(`${IC_URL}/campus/portal/chandler.jsp`, { waitUntil: "networkidle2", timeout: 30000 });

    // Login
    console.log("Logging in...");
    await page.waitForSelector("input[name='username'], #username", { timeout: 10000 });
    await page.type("input[name='username'], #username", USER);
    await page.type("input[name='password'], #password", PASS);
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 }),
      page.click("input[type='submit'], button[type='submit'], .btn-login"),
    ]);

    console.log("Navigating to grades...");
    await page.goto(`${IC_URL}/campus/portal/grades.xsl`, { waitUntil: "networkidle2", timeout: 30000 });

    // Try to extract grades from multiple possible layouts
    const grades = await page.evaluate(() => {
      const results = [];

      // Layout 1: .gradeTable rows
      const rows = document.querySelectorAll(".gradeTable tr, table.gradeTable tr");
      if (rows.length > 0) {
        rows.forEach(row => {
          const cells = row.querySelectorAll("td");
          if (cells.length >= 3) {
            results.push({
              course:  cells[0]?.innerText?.trim(),
              teacher: cells[1]?.innerText?.trim(),
              grade:   cells[2]?.innerText?.trim(),
              percent: cells[3]?.innerText?.trim() || null,
            });
          }
        });
        return results;
      }

      // Layout 2: .class-grade elements
      document.querySelectorAll(".classGrade, [class*='grade-row'], [class*='gradeRow']").forEach(el => {
        const name    = el.querySelector("[class*='name'], [class*='course']")?.innerText?.trim();
        const grade   = el.querySelector("[class*='grade'], [class*='score']")?.innerText?.trim();
        const teacher = el.querySelector("[class*='teacher']")?.innerText?.trim();
        if (name && grade) results.push({ course: name, teacher, grade, percent: null });
      });

      // Layout 3: generic table scan
      if (results.length === 0) {
        document.querySelectorAll("table tr").forEach(row => {
          const cells = row.querySelectorAll("td");
          if (cells.length >= 2) {
            const text = cells[0]?.innerText?.trim();
            const grade = cells[cells.length - 1]?.innerText?.trim();
            if (text && grade && /[A-F][+-]?|\d{2,3}%/.test(grade)) {
              results.push({ course: text, teacher: null, grade, percent: null });
            }
          }
        });
      }

      return results;
    });

    if (grades.length === 0) {
      console.warn("No grades found — IC layout may have changed. Saving empty array.");
    } else {
      console.log(`Found ${grades.length} grades.`);
    }

    const out = { grades, updated: new Date().toISOString() };
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
    console.log(`Saved to ${OUT}`);

  } finally {
    await browser.close();
  }
}

scrape().catch(err => {
  console.error("Scrape failed:", err.message);
  process.exit(1);
});
