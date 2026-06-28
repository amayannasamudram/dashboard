"use client";

import { useState } from "react";
import Widget from "./Widget";

type AppStatus = "researching" | "in-progress" | "submitted" | "accepted" | "rejected" | "deferred";

interface College {
  id: string;
  name: string;
  type: "ED" | "EA" | "RD" | "REA";
  status: AppStatus;
  deadline: string;
  notes: string;
}

const STATUS_COLOR: Record<AppStatus, string> = {
  researching: "#555",
  "in-progress": "#3b82f6",
  submitted: "#eab308",
  accepted: "#22c55e",
  rejected: "#ef4444",
  deferred: "#a855f7",
};

const SAMPLE: College[] = [
  { id: "1", name: "MIT", type: "EA", status: "researching", deadline: "2026-11-01", notes: "" },
  { id: "2", name: "Stanford", type: "RD", status: "researching", deadline: "2027-01-02", notes: "" },
];

export default function CollegeTracker() {
  const [colleges, setColleges] = useState<College[]>(SAMPLE);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", type: "RD" as College["type"], deadline: "" });

  const add = () => {
    if (!form.name) return;
    setColleges(c => [...c, { id: Date.now().toString(), name: form.name, type: form.type, status: "researching", deadline: form.deadline, notes: "" }]);
    setForm({ name: "", type: "RD", deadline: "" });
    setAdding(false);
  };

  const cycleStatus = (id: string) => {
    const order: AppStatus[] = ["researching", "in-progress", "submitted", "accepted", "rejected", "deferred"];
    setColleges(c => c.map(col => {
      if (col.id !== id) return col;
      const idx = order.indexOf(col.status);
      return { ...col, status: order[(idx + 1) % order.length] };
    }));
  };

  const submitted = colleges.filter(c => ["submitted", "accepted", "rejected", "deferred"].includes(c.status)).length;

  return (
    <Widget title="College Apps" badge={`${submitted}/${colleges.length}`} badgeColor="#a855f7" action={{ label: "+ add", onClick: () => setAdding(true) }}>
      <div className="flex flex-col gap-1">
        {colleges.map(c => (
          <div key={c.id} className="flex items-center gap-3 py-2 group" style={{ borderBottom: "1px solid #161616" }}>
            <button
              onClick={() => cycleStatus(c.id)}
              className="shrink-0 text-xs px-2 py-0.5 rounded transition-all"
              style={{ background: `${STATUS_COLOR[c.status]}18`, color: STATUS_COLOR[c.status], fontFamily: "monospace", minWidth: 80, textAlign: "center" }}
            >
              {c.status}
            </button>
            <span className="text-sm flex-1 font-medium" style={{ color: "#ddd" }}>{c.name}</span>
            <span className="text-xs shrink-0" style={{ color: "#444", fontFamily: "monospace" }}>{c.type}</span>
            {c.deadline && (
              <span className="text-xs shrink-0" style={{ color: "#333", fontFamily: "monospace" }}>
                {new Date(c.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
          </div>
        ))}

        {adding && (
          <div className="flex flex-col gap-2 mt-2 p-3 rounded-md" style={{ background: "#0d0d0d", border: "1px solid #2a2a2a" }}>
            <input autoFocus placeholder="College name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full text-sm bg-transparent outline-none" style={{ color: "#e0e0e0", borderBottom: "1px solid #222", paddingBottom: 4 }} />
            <div className="flex gap-2">
              {(["ED", "EA", "RD", "REA"] as College["type"][]).map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                  className="text-xs px-2 py-1 rounded" style={{ background: form.type === t ? "#1d3a5f" : "#1a1a1a", color: form.type === t ? "#3b82f6" : "#555" }}>
                  {t}
                </button>
              ))}
            </div>
            <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
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
