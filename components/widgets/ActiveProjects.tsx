"use client";

import React, { useState } from "react";
import Widget from "./Widget";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "done";
  stack: string[];
}

const STATUS: Record<string, { dot: string; label: string; glow: boolean }> = {
  active: { dot: "var(--green)",   label: "active",  glow: true  },
  paused: { dot: "var(--yellow)",  label: "paused",  glow: false },
  done:   { dot: "var(--ink-3)",   label: "done",    glow: false },
};

const CYCLE: Record<string, string> = { active: "paused", paused: "done", done: "active" };

const INIT: Project[] = [
  { id: "1", name: "PiOS", description: "Personal command center on Raspberry Pi", status: "active", stack: ["Next.js", "Pi"] },
];

export default function ActiveProjects({ style }: { style?: React.CSSProperties }) {
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
    }]);
    setForm({ name: "", description: "", stack: "" });
    setAdding(false);
  };

  const cycle = (id: string) =>
    setProjects(p => p.map(proj => proj.id === id ? { ...proj, status: CYCLE[proj.status] as Project["status"] } : proj));

  const remove = (id: string) => setProjects(p => p.filter(p => p.id !== id));

  const activeCount = projects.filter(p => p.status === "active").length;

  return (
    <Widget title="Projects" badge={activeCount} badgeColor="green" action={{ label: "+ new", onClick: () => setAdding(true) }} style={style}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>

        {projects.map(p => {
          const s = STATUS[p.status];
          return (
            <div
              key={p.id}
              className="interactive"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "8px 8px",
                borderRadius: "var(--radius)",
                cursor: "default",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-raised)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {/* Status toggle */}
              <button
                onClick={() => cycle(p.id)}
                title={`Click to cycle: ${p.status}`}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, paddingTop: 4, flexShrink: 0 }}
              >
                <div style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: s.dot,
                  boxShadow: s.glow ? `0 0 5px ${s.dot}` : "none",
                }} />
              </button>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {p.name}
                  </span>
                  {p.status !== "active" && (
                    <span style={{ fontSize: 10, color: s.dot, fontFamily: "var(--font-mono)", flexShrink: 0 }}>
                      {s.label}
                    </span>
                  )}
                </div>
                {p.description && (
                  <p style={{ fontSize: 11, color: "var(--ink-2)", marginTop: 2, lineHeight: 1.4 }}>
                    {p.description}
                  </p>
                )}
                {p.stack.length > 0 && (
                  <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                    {p.stack.map(s => (
                      <span key={s} style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        padding: "1px 5px",
                        background: "var(--surface-raised)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-sm)",
                        color: "var(--ink-2)",
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Remove */}
              <button
                onClick={() => remove(p.id)}
                className="interactive"
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", fontSize: 12, opacity: 0, flexShrink: 0 }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
              >
                ✕
              </button>
            </div>
          );
        })}

        {/* Add form */}
        {adding && (
          <div style={{
            marginTop: 6,
            padding: "10px",
            background: "var(--surface-raised)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}>
            <input
              autoFocus
              placeholder="Project name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && add()}
              style={{ background: "none", border: "none", outline: "none", color: "var(--ink)", fontSize: 13, borderBottom: "1px solid var(--border)", paddingBottom: 4 }}
            />
            <input
              placeholder="Description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              style={{ background: "none", border: "none", outline: "none", color: "var(--ink-2)", fontSize: 12 }}
            />
            <input
              placeholder="Stack (comma separated)"
              value={form.stack}
              onChange={e => setForm(f => ({ ...f, stack: e.target.value }))}
              style={{ background: "none", border: "none", outline: "none", color: "var(--ink-2)", fontSize: 12 }}
            />
            <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
              <button onClick={add} className="interactive" style={{ fontSize: 11, padding: "3px 10px", borderRadius: "var(--radius)", background: "var(--primary-bg)", color: "var(--primary)", border: "1px solid var(--primary)", cursor: "pointer" }}>
                Add
              </button>
              <button onClick={() => setAdding(false)} className="interactive" style={{ fontSize: 11, padding: "3px 10px", borderRadius: "var(--radius)", background: "transparent", color: "var(--ink-2)", border: "1px solid var(--border)", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {projects.length === 0 && !adding && (
          <p style={{ fontSize: 12, color: "var(--ink-3)", textAlign: "center", paddingTop: 24 }}>
            No projects yet. Add one above.
          </p>
        )}
      </div>
    </Widget>
  );
}
