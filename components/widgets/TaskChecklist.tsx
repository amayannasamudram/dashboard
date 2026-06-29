"use client";

import React, { useState, useRef } from "react";
import Widget from "./Widget";

type Priority = "high" | "mid" | "low";

interface Task {
  id: string;
  text: string;
  done: boolean;
  priority: Priority;
}

const PRIORITY: Record<Priority, string> = {
  high: "var(--red)",
  mid:  "var(--yellow)",
  low:  "var(--ink-3)",
};

const INIT: Task[] = [
  { id: "1", text: "Finish PiOS setup", done: false, priority: "high" },
  { id: "2", text: "Push first commit", done: false, priority: "high" },
];

export default function TaskChecklist({ style }: { style?: React.CSSProperties }) {
  const [tasks, setTasks] = useState<Task[]>(INIT);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<Priority>("mid");
  const inputRef = useRef<HTMLInputElement>(null);

  const add = () => {
    if (!input.trim()) return;
    setTasks(t => [{ id: Date.now().toString(), text: input, done: false, priority }, ...t]);
    setInput("");
    inputRef.current?.focus();
  };

  const toggle = (id: string) => setTasks(t => t.map(task => task.id === id ? { ...task, done: !task.done } : task));
  const remove  = (id: string) => setTasks(t => t.filter(task => task.id !== id));

  const open = tasks.filter(t => !t.done);
  const done = tasks.filter(t => t.done);

  return (
    <Widget title="Tasks" badge={open.length} badgeColor="red" style={style}>
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>

        {open.map(t => (
          <div
            key={t.id}
            className="interactive"
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 4px", borderRadius: "var(--radius-sm)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-raised)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <button onClick={() => toggle(t.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}>
              <div style={{
                width: 14,
                height: 14,
                borderRadius: "var(--radius-sm)",
                border: `1px solid ${PRIORITY[t.priority]}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }} />
            </button>
            <span style={{ flex: 1, fontSize: 12, color: "var(--ink)", lineHeight: 1.4 }}>{t.text}</span>
            <button
              onClick={() => remove(t.id)}
              className="interactive"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", fontSize: 11, opacity: 0, flexShrink: 0 }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
            >✕</button>
          </div>
        ))}

        {done.length > 0 && (
          <>
            <div style={{ borderTop: "1px solid var(--border-subtle)", margin: "6px 0" }} />
            {done.map(t => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 4px" }}>
                <button onClick={() => toggle(t.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}>
                  <div style={{
                    width: 14,
                    height: 14,
                    borderRadius: "var(--radius-sm)",
                    background: "var(--surface-raised)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 8, color: "var(--ink-3)" }}>✓</span>
                  </div>
                </button>
                <span style={{ flex: 1, fontSize: 12, color: "var(--ink-3)", textDecoration: "line-through" }}>{t.text}</span>
              </div>
            ))}
          </>
        )}

        {/* Input row */}
        <div style={{ borderTop: "1px solid var(--border-subtle)", marginTop: 8, paddingTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0 }}>
            {(["high", "mid", "low"] as Priority[]).map(p => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className="interactive"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  background: PRIORITY[p],
                  opacity: priority === p ? 1 : 0.25,
                }}
              />
            ))}
          </div>
          <input
            ref={inputRef}
            placeholder="Add task…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && add()}
            style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 12, color: "var(--ink-2)" }}
          />
        </div>
      </div>
    </Widget>
  );
}
