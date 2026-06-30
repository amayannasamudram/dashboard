import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const drive = google.drive({ version: "v3", auth: oauth2Client });

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  if (!query) return NextResponse.json({ files: [] });

  try {
    const res = await drive.files.list({
      q: `name contains '${query.replace(/'/g, "\\'")}' and trashed = false`,
      fields: "files(id, name, mimeType, webViewLink, modifiedTime)",
      orderBy: "modifiedTime desc",
      pageSize: 8,
    });

    const files = (res.data.files ?? []).map(f => ({
      id: f.id,
      name: f.name,
      url: f.webViewLink,
      mimeType: f.mimeType,
      modifiedTime: f.modifiedTime,
    }));

    return NextResponse.json({ files });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Drive API error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
