"use client";

import { useState } from "react";
import Widget from "./Widget";

interface Assignment {
  id: string;
  title: string;
  subject: string;
  due: string;
  done: boolean;
  urgent: boolean;
}

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - new Date().setHours(0,0,0,0);
  return Math.ceil(diff / 86400000);
}

function dueLabel(days: number) {
  if (days < 0) return { text: "overdue", color: "#ef4444" };
  if (days === 0) return { text: "today", color: "#ef4444" };
  if (days === 1) return { text: "tomorrow", color: "#eab308" };
  return { text: `in ${days}d`, color: days <= 3 ? "#eab308" : "#555" };
}

const SAMPLE: Assignment[] = [
  { id: "1", title: "Physics Problem Set 4", subject: "Physics", due: "2026-06-30", done: false, urgent: true },
  { id: "2", title: "Essay Draft", subject: "English", due: "2026-07-05", done: false, urgent: false },
];

export default function Assignments() {
  const [items, setItems] = useState<Assignment[]>(SAMPLE);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", subject: "", due: "" });

  const add = () => {
    if (!form.title || !form.due) return;
    setItems(i => [...i, { id: Date.now().toString(), title: form.title, subject: form.subject, due: form.due, done: false, urgent: false }]);
    setForm({ title: "", subject: "", due: "" });
    setAdding(false);
  };

  const toggle = (id: string) => setItems(i => i.map(a => a.id === id ? { ...a, done: !a.done } : a));

  const sorted = [...items].sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());
  const open = sorted.filter(a => !a.done);
  const done = sorted.filter(a => a.done);

  return (
    <Widget title="Assignments" badge={open.length} badgeColor="#ef4444" action={{ label: "+ add", onClick: () => setAdding(true) }}>
      <div className="flex flex-col gap-1">
        {open.map(a => {
          const days = daysUntil(a.due);
          const due = dueLabel(days);
          return (
            <div key={a.id} className="flex items-center gap-3 py-2 group" style={{ borderBottom: "1px solid #161616" }}>
              <button onClick={() => toggle(a.id)} className="shrink-0 w-4 h-4 rounded border" style={{ borderColor: "#2a2a2a" }} />
              <div className="flex-1 min-w-0">
                <span className="text-sm" style={{ color: "#ddd" }}>{a.title}</span>
                {a.subject && <span className="text-xs ml-2" style={{ color: "#444", fontFamily: "monospace" }}>{a.subject}</span>}
              </div>
              <span className="text-xs shrink-0 font-medium" style={{ color: due.color, fontFamily: "monospace" }}>{due.text}</span>
            </div>
          );
        })}

        {done.length > 0 && done.map(a => (
          <div key={a.id} className="flex items-center gap-3 py-1.5">
            <button onClick={() => toggle(a.id)} className="shrink-0 w-4 h-4 rounded border flex items-center justify-center" style={{ borderColor: "#222", background: "#1a1a1a" }}>
              <span style={{ color: "#444", fontSize: 9 }}>✓</span>
            </button>
            <span className="text-sm flex-1 line-through" style={{ color: "#333" }}>{a.title}</span>
          </div>
        ))}

        {adding && (
          <div className="flex flex-col gap-2 mt-2 p-3 rounded-md" style={{ background: "#0d0d0d", border: "1px solid #2a2a2a" }}>
            <input autoFocus placeholder="Assignment title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full text-sm bg-transparent outline-none" style={{ color: "#e0e0e0", borderBottom: "1px solid #222", paddingBottom: 4 }} />
            <input placeholder="Subject" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              className="w-full text-xs bg-transparent outline-none" style={{ color: "#888" }} />
            <input type="date" value={form.due} onChange={e => setForm(f => ({ ...f, due: e.target.value }))}
              className="w-full text-xs bg-transparent outline-none" style={{ color: "#888", colorScheme: "dark" }} />
            <div className="flex gap-2 mt-1">
              <button onClick={add} className="text-xs px-3 py-1 rounded" style={{ background: "#1d3a5f", color: "#3b82f6" }}>Add</button>
              <button onClick={() => setAdding(false)} className="text-xs px-3 py-1 rounded" style={{ background: "#1a1a1a", color: "#555" }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </Widget>
  );
}
