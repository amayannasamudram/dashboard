"use client";

import React, { useEffect, useState } from "react";
import Widget from "./Widget";

interface Assignment {
  id: string;
  title: string;
  course: string;
  due: string;
  submitted: boolean;
  link: string;
}

function daysUntil(iso: string) {
  return Math.ceil((new Date(iso).getTime() - new Date().setHours(0,0,0,0)) / 86400000);
}

function dueStyle(days: number): { text: string; color: string } {
  if (days < 0)  return { text: `${Math.abs(days)}d overdue`, color: "var(--red)"    };
  if (days === 0) return { text: "today",                      color: "var(--red)"    };
  if (days === 1) return { text: "tomorrow",                   color: "var(--yellow)" };
  if (days <= 3)  return { text: `${days}d`,                   color: "var(--yellow)" };
  return           { text: `${days}d`,                         color: "var(--ink-3)"  };
}

export default function Assignments({ style }: { style?: React.CSSProperties }) {
  const [items, setItems] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await fetch("/api/classroom");
      const d = await res.json();
      if (d.error) { setError(d.error); return; }
      setItems(d.assignments ?? []);
    } catch { setError("fetch failed"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); const t = setInterval(load, 3600000); return () => clearInterval(t); }, []);

  const open = items.filter(a => !a.submitted);
  const done = items.filter(a => a.submitted);

  return (
    <Widget title="Assignments" badge={open.length} badgeColor="red" style={style}
      action={{ label: "↻", onClick: load }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {error && <p style={{ fontSize: 11, color: "var(--red)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>{error}</p>}
        {loading && <p style={{ fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>loading…</p>}

        {open.map(a => {
          const days = daysUntil(a.due);
          const due = dueStyle(days);
          return (
            <a key={a.id} href={a.link || "#"} target="_blank" rel="noopener noreferrer"
              className="interactive"
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 6px", borderRadius: "var(--radius-sm)", borderBottom: "1px solid var(--border-subtle)", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-raised)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 12, color: "var(--ink)", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {a.title}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)" }}>
                  {a.course}
                </span>
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: due.color, flexShrink: 0, fontWeight: 500 }}>
                {due.text}
              </span>
            </a>
          );
        })}

        {done.length > 0 && (
          <>
            <div style={{ borderTop: "1px solid var(--border-subtle)", margin: "6px 0" }} />
            {done.map(a => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 6px" }}>
                <span style={{ fontSize: 12, color: "var(--ink-3)", textDecoration: "line-through", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {a.title}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--green)" }}>done</span>
              </div>
            ))}
          </>
        )}

        {!loading && items.length === 0 && !error && (
          <p style={{ fontSize: 12, color: "var(--ink-3)", textAlign: "center", padding: "20px 0" }}>
            All clear — no upcoming assignments.
          </p>
        )}
      </div>
    </Widget>
  );
}
