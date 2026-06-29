import { NextResponse } from "next/server";

const CITY = process.env.OPENWEATHER_CITY || "New York";

export async function GET() {
  try {
    const res = await fetch(
      `https://wttr.in/${encodeURIComponent(CITY)}?format=j1`,
      { next: { revalidate: 900 }, headers: { "User-Agent": "PiOS/1.0" } }
    );
    const d = await res.json();
    const cur = d.current_condition?.[0];
    const area = d.nearest_area?.[0];

    return NextResponse.json({
      city: area?.areaName?.[0]?.value ?? CITY,
      temp: Math.round(Number(cur?.temp_F ?? 0)),
      feels: Math.round(Number(cur?.FeelsLikeF ?? 0)),
      desc: cur?.weatherDesc?.[0]?.value ?? "",
      humidity: Number(cur?.humidity ?? 0),
      wind: Math.round(Number(cur?.windspeedMiles ?? 0)),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
