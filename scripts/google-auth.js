#!/usr/bin/env node
/**
 * One-time script to get a Google OAuth refresh token for Drive API access.
 * Run: node scripts/google-auth.js
 * Paste the CLIENT_ID and CLIENT_SECRET from your Google Cloud OAuth credentials.
 */

const { google } = require("googleapis");
const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(`
Missing credentials. Set them first:

  export GOOGLE_CLIENT_ID=your_client_id
  export GOOGLE_CLIENT_SECRET=your_client_secret

Then re-run: node scripts/google-auth.js
  `);
  process.exit(1);
}

const REDIRECT_URI = "http://localhost:3333/oauth2callback";
const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
  prompt: "consent",
});

console.log("\n1. Open this URL in your browser:\n");
console.log("   " + authUrl);
console.log("\n2. Log in with your Google account and allow access.");
console.log("3. You'll be redirected to localhost — this script will capture the code.\n");

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  if (parsed.pathname !== "/oauth2callback") return;

  const code = parsed.query.code;
  if (!code) {
    res.end("No code received.");
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    const refresh_token = tokens.refresh_token;

    res.end("<h2>Success! You can close this tab.</h2>");
    server.close();

    const envPath = path.join(__dirname, "../.env.local");
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";

    const lines = envContent.split("\n").filter(l =>
      !l.startsWith("GOOGLE_CLIENT_ID=") &&
      !l.startsWith("GOOGLE_CLIENT_SECRET=") &&
      !l.startsWith("GOOGLE_REFRESH_TOKEN=")
    );

    lines.push(`GOOGLE_CLIENT_ID=${CLIENT_ID}`);
    lines.push(`GOOGLE_CLIENT_SECRET=${CLIENT_SECRET}`);
    lines.push(`GOOGLE_REFRESH_TOKEN=${refresh_token}`);

    fs.writeFileSync(envPath, lines.filter(Boolean).join("\n") + "\n");

    console.log("✓ Credentials written to .env.local:");
    console.log("  GOOGLE_CLIENT_ID");
    console.log("  GOOGLE_CLIENT_SECRET");
    console.log("  GOOGLE_REFRESH_TOKEN");
    console.log("\nRestart your dev server and you're good to go.\n");
  } catch (err) {
    res.end("Error: " + err.message);
    console.error("Token exchange failed:", err.message);
    server.close();
  }
});

server.listen(3333, () => {
  console.log("Waiting for OAuth callback on http://localhost:3333 ...\n");
});
