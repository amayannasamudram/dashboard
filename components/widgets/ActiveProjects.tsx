"use client";

import { useState } from "react";
import Widget from "./Widget";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "done";
  stack: string[];
  url?: string;
  lastUpdated: string;
}

const INIT: Project[] = [
  { id: "1", name: "PiOS", description: "Personal operations system on Raspberry Pi", status: "active", stack: ["Next.js", "Pi"], lastUpdated: "today" },
];

const STATUS_COLOR = { active: "#22c55e", paused: "#eab308", done: "#555" };
const STATUS_DOT = { active: "#22c55e", paused: "#eab308", done: "#333" };

export default function ActiveProjects() {
  const [projects, setProjects] = useState<Project[]>(INIT);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", stack: "" });

  const add = () => {
    if (!form.name.trim()) return;
    setProjects(p => [...p, {
      id: Date.now().toString(),
      name: form.name,
      description: form.description,
      status: "active",
      stack: form.stack.split(",").map(s => s.trim()).filter(Boolean),
      lastUpdated: "just now",
    }]);
    setForm({ name: "", description: "", stack: "" });
    setAdding(false);
  };

  const cycle = (id: string) => {
    setProjects(p => p.map(proj => {
      if (proj.id !== id) return proj;
      const next = { active: "paused", paused: "done", done: "active" } as const;
      return { ...proj, status: next[proj.status] };
    }));
  };

  return (
    <Widget title="Active Projects" badge={projects.filter(p => p.status === "active").length} action={{ label: "+ add", onClick: () => setAdding(true) }}>
      <div className="flex flex-col gap-2">
        {projects.map(p => (
          <div
            key={p.id}
            className="flex items-start gap-3 p-3 rounded-md cursor-pointer transition-all"
            style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}
            onMouseOver={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
            onMouseOut={e => (e.currentTarget.style.borderColor = "#1a1a1a")}
          >
            <button onClick={() => cycle(p.id)} className="mt-1 shrink-0">
              <div className="w-2 h-2 rounded-full" style={{ background: STATUS_DOT[p.status], boxShadow: p.status === "active" ? `0 0 6px ${STATUS_COLOR[p.status]}` : "none" }} />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium" style={{ color: "#e0e0e0" }}>{p.name}</span>
                <span className="text-xs" style={{ color: STATUS_COLOR[p.status] }}>{p.status}</span>
              </div>
              {p.description && <p className="text-xs mt-0.5" style={{ color: "#555" }}>{p.description}</p>}
              {p.stack.length > 0 && (
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {p.stack.map(s => (
                    <span key={s} className="text-xs px-1.5 py-0.5 rounded" style={{ background: "#1a1a1a", color: "#555", fontFamily: "monospace", fontSize: 10 }}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {adding && (
          <div className="flex flex-col gap-2 p-3 rounded-md" style={{ background: "#0d0d0d", border: "1px solid #2a2a2a" }}>
            <input
              autoFocus
              placeholder="Project name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full text-sm bg-transparent outline-none"
              style={{ color: "#e0e0e0", borderBottom: "1px solid #222", paddingBottom: 4 }}
              onKeyDown={e => e.key === "Enter" && add()}
            />
            <input
              placeholder="Description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full text-xs bg-transparent outline-none"
              style={{ color: "#888" }}
            />
            <input
              placeholder="Stack (comma separated)"
              value={form.stack}
              onChange={e => setForm(f => ({ ...f, stack: e.target.value }))}
              className="w-full text-xs bg-transparent outline-none"
              style={{ color: "#888" }}
            />
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
