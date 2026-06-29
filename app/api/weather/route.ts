import { NextResponse } from "next/server";

const KEY  = process.env.OPENWEATHER_API_KEY;
const CITY = process.env.OPENWEATHER_CITY || "New York";

export async function GET() {
  if (!KEY) return NextResponse.json({ error: "OPENWEATHER_API_KEY not set" }, { status: 503 });

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(CITY)}&units=imperial&appid=${KEY}`,
      { next: { revalidate: 900 } }
    );
    const d = await res.json();
    return NextResponse.json({
      city: d.name,
      temp: Math.round(d.main?.temp),
      feels: Math.round(d.main?.feels_like),
      desc: d.weather?.[0]?.description,
      icon: d.weather?.[0]?.icon,
      humidity: d.main?.humidity,
      wind: Math.round(d.wind?.speed),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
