import { NextResponse } from "next/server";

const CLIENT_ID     = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

async function getAccessToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: REFRESH_TOKEN! }),
    cache: "no-store",
  });
  const d = await res.json();
  return d.access_token as string;
}

export async function GET() {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return NextResponse.json({ error: "Spotify not configured" }, { status: 503 });
  }

  try {
    const token = await getAccessToken();
    const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (res.status === 204) return NextResponse.json({ playing: false });

    const d = await res.json();
    return NextResponse.json({
      playing: d.is_playing,
      track: d.item?.name,
      artist: d.item?.artists?.map((a: any) => a.name).join(", "),
      album: d.item?.album?.name,
      albumArt: d.item?.album?.images?.[2]?.url,
      progress: d.progress_ms,
      duration: d.item?.duration_ms,
      url: d.item?.external_urls?.spotify,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
