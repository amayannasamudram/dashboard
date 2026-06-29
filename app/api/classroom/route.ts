import { NextResponse } from "next/server";

const CSV_URL = process.env.CLASSROOM_CSV_URL!;

function daysUntil(iso: string) {
  return Math.ceil((new Date(iso).getTime() - new Date().setHours(0,0,0,0)) / 86400000);
}

export async function GET() {
  if (!CSV_URL) return NextResponse.json({ error: "CLASSROOM_CSV_URL not set" }, { status: 503 });

  try {
    const res = await fetch(CSV_URL, { next: { revalidate: 3600 } });
    const text = await res.text();

    const lines = text.trim().split("\n").slice(1); // skip header
    const assignments = lines
      .filter(l => l.trim())
      .map(line => {
        const cols = line.split(",");
        return {
          id:        cols[0]?.trim(),
          title:     cols[1]?.trim(),
          course:    cols[2]?.trim(),
          due:       cols[3]?.trim(),
          submitted: cols[4]?.trim().toLowerCase() === "true",
          link:      cols[5]?.trim(),
        };
      })
      .filter(a => a.title && a.due)
      .filter(a => daysUntil(a.due) >= 0) // only future
      .slice(0, 20);

    return NextResponse.json({ assignments });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
