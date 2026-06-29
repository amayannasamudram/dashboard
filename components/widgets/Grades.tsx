"use client";

import React, { useEffect, useState } from "react";
import Widget from "./Widget";

interface Grade {
  course: string;
  teacher: string | null;
  grade: string;
  percent: string | null;
}

function gradeColor(g: string): string {
  const letter = g.trim()[0];
  if (letter === "A") return "var(--green)";
  if (letter === "B") return "var(--primary)";
  if (letter === "C") return "var(--yellow)";
  return "var(--red)";
}

export default function Grades({ style }: { style?: React.CSSProperties }) {
  const [grades, setGrades]   = useState<Grade[]>([]);
  const [updated, setUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const load = async () => {
    try {
      const res = await fetch("/api/grades");
      const d   = await res.json();
      if (d.error) { setError(d.error); return; }
      setGrades(d.grades ?? []);
      setUpdated(d.updated);
    } catch { setError("fetch failed"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const updatedStr = updated
    ? new Date(updated).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <Widget title="Grades" badge={grades.length > 0 ? `${grades.length} classes` : undefined} badgeColor="primary" style={style}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {error && <p style={{ fontSize: 11, color: "var(--red)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>{error}</p>}
        {loading && <p style={{ fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>loading…</p>}

        {grades.map((g, i) => (
          <div key={i} className="interactive"
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 6px", borderRadius: "var(--radius-sm)", borderBottom: "1px solid var(--border-subtle)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-raised)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 12, color: "var(--ink)", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {g.course}
              </span>
              {g.teacher && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)" }}>{g.teacher}</span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              {g.percent && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-2)" }}>{g.percent}</span>
              )}
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                fontWeight: 600,
                color: gradeColor(g.grade),
                minWidth: 24,
                textAlign: "right",
              }}>
                {g.grade}
              </span>
            </div>
          </div>
        ))}

        {!loading && grades.length === 0 && !error && (
          <p style={{ fontSize: 12, color: "var(--ink-3)", textAlign: "center", padding: "20px 0" }}>
            No grades yet — run scraper on Pi first.
          </p>
        )}

        {updatedStr && (
          <p style={{ fontSize: 10, color: "var(--ink-3)", fontFamily: "var(--font-mono)", marginTop: 8, textAlign: "right" }}>
            synced {updatedStr}
          </p>
        )}
      </div>
    </Widget>
  );
}
