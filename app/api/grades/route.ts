import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const file = join(process.cwd(), "data/grades.json");
    const raw  = JSON.parse(readFileSync(file, "utf-8"));
    return NextResponse.json(raw);
  } catch {
    return NextResponse.json({ grades: [], updated: null });
  }
}
