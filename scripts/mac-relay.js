#!/usr/bin/env node
/**
 * Mac relay server — runs on your Mac, receives open-URL commands from Pi.
 * Start: node scripts/mac-relay.js
 * Auto-start: see instructions below to add as a Login Item or launchd agent.
 */

const http = require("http");
const { exec } = require("child_process");

const PORT = 9876;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== "POST" || req.url !== "/open") {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  let body = "";
  req.on("data", chunk => (body += chunk));
  req.on("end", () => {
    let url;
    try {
      ({ url } = JSON.parse(body));
    } catch {
      res.writeHead(400);
      res.end("Bad JSON");
      return;
    }

    if (!url || !url.startsWith("https://")) {
      res.writeHead(400);
      res.end("Invalid URL — must start with https://");
      return;
    }

    exec(`open "${url.replace(/"/g, "")}"`, err => {
      if (err) {
        res.writeHead(500);
        res.end("Failed to open");
        return;
      }
      res.writeHead(200);
      res.end("ok");
    });
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Mac relay listening on http://0.0.0.0:${PORT}`);
  console.log("Waiting for open commands from Pi...");
});
