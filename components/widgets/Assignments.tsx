"use client";

import React, { useState } from "react";
import Widget from "./Widget";

interface Assignment {
  id: string;
  title: string;
  subject: string;
  due: string;
  done: boolean;
}

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - new Date().setHours(0, 0, 0, 0);
  return Math.ceil(diff / 86400000);
}

function dueStyle(days: number): { text: string; color: string } {
  if (days < 0)  return { text: `${Math.abs(days)}d overdue`, color: "var(--red)" };
  if (days === 0) return { text: "today",                      color: "var(--red)" };
  if (days === 1) return { text: "tomorrow",                   color: "var(--yellow)" };
  if (days <= 3)  return { text: `${days}d`,                   color: "var(--yellow)" };
  return { text: `${days}d`, color: "var(--ink-3)" };
}

const SAMPLE: Assignment[] = [
  { id: "1", title: "Physics Problem Set 4", subject: "Physics", due: "2026-06-30", done: false },
  { id: "2", title: "Essay Draft",           subject: "English", due: "2026-07-05", done: false },
];

export default function Assignments({ style }: { style?: React.CSSProperties }) {
  const [items, setItems] = useState<Assignment[]>(SAMPLE);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", subject: "", due: "" });

  const add = () => {
    if (!form.title || !form.due) return;
    setItems(i => [...i, { id: Date.now().toString(), ...form, done: false }]);
    setForm({ title: "", subject: "", due: "" });
    setAdding(false);
  };

  const toggle = (id: string) => setItems(i => i.map(a => a.id === id ? { ...a, done: !a.done } : a));
  const remove  = (id: string) => setItems(i => i.filter(a => a.id !== id));

  const sorted = [...items].sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());
  const open = sorted.filter(a => !a.done);
  const done = sorted.filter(a => a.done);

  return (
    <Widget title="Assignments" badge={open.length} badgeColor="red" action={{ label: "+ add", onClick: () => setAdding(true) }} style={style}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {open.map(a => {
          const due = dueStyle(daysUntil(a.due));
          return (
            <div
              key={a.id}
              className="interactive"
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 6px", borderRadius: "var(--radius-sm)", borderBottom: "1px solid var(--border-subtle)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-raised)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <button onClick={() => toggle(a.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}>
                <div style={{ width: 14, height: 14, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "transparent" }} />
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 12, color: "var(--ink)", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {a.title}
                </span>
                {a.subject && (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)" }}>{a.subject}</span>
                )}
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: due.color, flexShrink: 0, fontWeight: 500 }}>
                {due.text}
              </span>
              <button onClick={() => remove(a.id)} className="interactive" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", fontSize: 11, opacity: 0 }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "1")} onMouseLeave={e => (e.currentTarget.style.opacity = "0")}>✕</button>
            </div>
          );
        })}

        {done.map(a => (
          <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 6px" }}>
            <button onClick={() => toggle(a.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}>
              <div style={{ width: 14, height: 14, borderRadius: "var(--radius-sm)", background: "var(--surface-raised)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 8, color: "var(--ink-3)" }}>✓</span>
              </div>
            </button>
            <span style={{ fontSize: 12, color: "var(--ink-3)", textDecoration: "line-through", flex: 1 }}>{a.title}</span>
          </div>
        ))}

        {adding && (
          <div style={{ marginTop: 8, padding: 10, background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: "var(--radius)", display: "flex", flexDirection: "column", gap: 8 }}>
            <input autoFocus placeholder="Assignment title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              style={{ background: "none", border: "none", outline: "none", fontSize: 12, color: "var(--ink)", borderBottom: "1px solid var(--border)", paddingBottom: 4 }} />
            <input placeholder="Subject" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              style={{ background: "none", border: "none", outline: "none", fontSize: 11, color: "var(--ink-2)" }} />
            <input type="date" value={form.due} onChange={e => setForm(f => ({ ...f, due: e.target.value }))}
              style={{ background: "none", border: "none", outline: "none", fontSize: 11, color: "var(--ink-2)", colorScheme: "dark" }} />
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={add} className="interactive" style={{ fontSize: 11, padding: "3px 10px", borderRadius: "var(--radius)", background: "var(--primary-bg)", color: "var(--primary)", border: "1px solid var(--primary)", cursor: "pointer" }}>Add</button>
              <button onClick={() => setAdding(false)} className="interactive" style={{ fontSize: 11, padding: "3px 10px", borderRadius: "var(--radius)", background: "transparent", color: "var(--ink-2)", border: "1px solid var(--border)", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}

        {open.length === 0 && !adding && (
          <p style={{ fontSize: 12, color: "var(--ink-3)", textAlign: "center", padding: "20px 0" }}>All clear.</p>
        )}
      </div>
    </Widget>
  );
}
