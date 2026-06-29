"use client";

import React, { useState, useRef } from "react";
import Widget from "./Widget";

interface Item {
  id: string;
  text: string;
  done: boolean;
}

const DEFAULT: Item[] = [
  { id: "1", text: "Review PiOS deploy flow", done: false },
];

export default function ActionInbox({ label = "Capture", style }: { label?: string; style?: React.CSSProperties }) {
  const [items, setItems] = useState<Item[]>(DEFAULT);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const add = () => {
    if (!input.trim()) return;
    setItems(i => [...i, { id: Date.now().toString(), text: input, done: false }]);
    setInput("");
    inputRef.current?.focus();
  };

  const toggle = (id: string) => setItems(i => i.map(item => item.id === id ? { ...item, done: !item.done } : item));
  const remove  = (id: string) => setItems(i => i.filter(item => item.id !== id));

  const openCount = items.filter(i => !i.done).length;

  return (
    <Widget title={label} badge={openCount} badgeColor="purple" style={style}>
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {items.map(item => (
          <div
            key={item.id}
            className="interactive"
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 4px", borderRadius: "var(--radius-sm)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-raised)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <button onClick={() => toggle(item.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}>
              <div style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: `1px solid ${item.done ? "var(--border)" : "var(--purple)"}`,
                background: item.done ? "var(--surface-raised)" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {item.done && <span style={{ fontSize: 8, color: "var(--ink-3)" }}>✓</span>}
              </div>
            </button>
            <span style={{
              flex: 1,
              fontSize: 12,
              color: item.done ? "var(--ink-3)" : "var(--ink)",
              textDecoration: item.done ? "line-through" : "none",
            }}>
              {item.text}
            </span>
            <button
              onClick={() => remove(item.id)}
              className="interactive"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", fontSize: 11, opacity: 0 }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
            >✕</button>
          </div>
        ))}

        <div style={{ borderTop: "1px solid var(--border-subtle)", marginTop: 8, paddingTop: 8 }}>
          <input
            ref={inputRef}
            placeholder="Capture a thought…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && add()}
            style={{ width: "100%", background: "none", border: "none", outline: "none", fontSize: 12, color: "var(--ink-2)" }}
          />
        </div>
      </div>
    </Widget>
  );
}
