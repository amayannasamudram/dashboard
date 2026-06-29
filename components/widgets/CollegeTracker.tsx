"use client";

import React, { useState } from "react";
import Widget from "./Widget";

type AppStatus = "researching" | "in-progress" | "submitted" | "accepted" | "rejected" | "deferred";

interface College {
  id: string;
  name: string;
  type: "ED" | "EA" | "RD" | "REA";
  status: AppStatus;
  deadline: string;
}

const STATUS_STYLE: Record<AppStatus, { color: string; bg: string }> = {
  researching:   { color: "var(--ink-2)",   bg: "var(--surface-raised)" },
  "in-progress": { color: "var(--primary)", bg: "var(--primary-bg)"     },
  submitted:     { color: "var(--yellow)",  bg: "var(--yellow-bg)"      },
  accepted:      { color: "var(--green)",   bg: "var(--green-bg)"       },
  rejected:      { color: "var(--red)",     bg: "var(--red-bg)"         },
  deferred:      { color: "var(--purple)",  bg: "var(--purple-bg)"      },
};

const STATUS_ORDER: AppStatus[] = ["researching", "in-progress", "submitted", "accepted", "rejected", "deferred"];

const SAMPLE: College[] = [
  { id: "1", name: "MIT",      type: "EA", status: "researching",  deadline: "2026-11-01" },
  { id: "2", name: "Stanford", type: "RD", status: "researching",  deadline: "2027-01-02" },
  { id: "3", name: "Cornell",  type: "ED", status: "in-progress",  deadline: "2026-11-15" },
];

export default function CollegeTracker({ style }: { style?: React.CSSProperties }) {
  const [colleges, setColleges] = useState<College[]>(SAMPLE);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", type: "RD" as College["type"], deadline: "" });

  const add = () => {
    if (!form.name) return;
    setColleges(c => [...c, { id: Date.now().toString(), name: form.name, type: form.type, status: "researching", deadline: form.deadline }]);
    setForm({ name: "", type: "RD", deadline: "" });
    setAdding(false);
  };

  const cycleStatus = (id: string) =>
    setColleges(c => c.map(col => {
      if (col.id !== id) return col;
      const idx = STATUS_ORDER.indexOf(col.status);
      return { ...col, status: STATUS_ORDER[(idx + 1) % STATUS_ORDER.length] };
    }));

  const submitted = colleges.filter(c => ["submitted", "accepted", "rejected", "deferred"].includes(c.status)).length;

  return (
    <Widget title="College Apps" badge={`${submitted}/${colleges.length}`} badgeColor="purple" action={{ label: "+ add", onClick: () => setAdding(true) }} style={style}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {colleges.map(c => {
          const st = STATUS_STYLE[c.status];
          return (
            <div
              key={c.id}
              className="interactive"
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 6px", borderRadius: "var(--radius-sm)", borderBottom: "1px solid var(--border-subtle)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-raised)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <button
                onClick={() => cycleStatus(c.id)}
                className="interactive"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  padding: "2px 7px",
                  borderRadius: "var(--radius-sm)",
                  color: st.color,
                  background: st.bg,
                  border: "none",
                  cursor: "pointer",
                  minWidth: 82,
                  textAlign: "center",
                  fontWeight: 500,
                }}
              >
                {c.status}
              </button>
              <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: "var(--ink)" }}>{c.name}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", flexShrink: 0 }}>{c.type}</span>
              {c.deadline && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", flexShrink: 0 }}>
                  {new Date(c.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              )}
            </div>
          );
        })}

        {adding && (
          <div style={{ marginTop: 8, padding: 10, background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: "var(--radius)", display: "flex", flexDirection: "column", gap: 8 }}>
            <input autoFocus placeholder="College name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={{ background: "none", border: "none", outline: "none", fontSize: 12, color: "var(--ink)", borderBottom: "1px solid var(--border)", paddingBottom: 4 }} />
            <div style={{ display: "flex", gap: 6 }}>
              {(["ED", "EA", "RD", "REA"] as College["type"][]).map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))} className="interactive"
                  style={{ fontSize: 11, padding: "2px 8px", borderRadius: "var(--radius-sm)", background: form.type === t ? "var(--primary-bg)" : "var(--surface-raised)", color: form.type === t ? "var(--primary)" : "var(--ink-2)", border: `1px solid ${form.type === t ? "var(--primary)" : "var(--border)"}`, cursor: "pointer" }}>
                  {t}
                </button>
              ))}
            </div>
            <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
              style={{ background: "none", border: "none", outline: "none", fontSize: 11, color: "var(--ink-2)", colorScheme: "dark" }} />
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={add} className="interactive" style={{ fontSize: 11, padding: "3px 10px", borderRadius: "var(--radius)", background: "var(--primary-bg)", color: "var(--primary)", border: "1px solid var(--primary)", cursor: "pointer" }}>Add</button>
              <button onClick={() => setAdding(false)} className="interactive" style={{ fontSize: 11, padding: "3px 10px", borderRadius: "var(--radius)", background: "transparent", color: "var(--ink-2)", border: "1px solid var(--border)", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </Widget>
  );
}
