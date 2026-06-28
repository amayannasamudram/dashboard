"use client";

import { useState } from "react";
import Widget from "./Widget";

interface Item {
  id: string;
  text: string;
  source: string;
  done: boolean;
}

export default function ActionInbox({ label = "Action Inbox" }: { label?: string }) {
  const [items, setItems] = useState<Item[]>([
    { id: "1", text: "Review PiOS deploy flow", source: "self", done: false },
  ]);
  const [input, setInput] = useState("");

  const add = () => {
    if (!input.trim()) return;
    setItems(i => [...i, { id: Date.now().toString(), text: input, source: "self", done: false }]);
    setInput("");
  };

  const toggle = (id: string) => setItems(i => i.map(item => item.id === id ? { ...item, done: !item.done } : item));
  const remove = (id: string) => setItems(i => i.filter(item => item.id !== id));

  const open = items.filter(i => !i.done);

  return (
    <Widget title={label} badge={open.length} badgeColor="#a855f7">
      <div className="flex flex-col gap-1">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-2 py-1.5 group">
            <button
              onClick={() => toggle(item.id)}
              className="shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all"
              style={{ borderColor: item.done ? "#2a2a2a" : "#333", background: item.done ? "#1a1a1a" : "transparent" }}
            >
              {item.done && <span style={{ color: "#444", fontSize: 9 }}>✓</span>}
            </button>
            <span className="text-sm flex-1" style={{ color: item.done ? "#333" : "#ccc", textDecoration: item.done ? "line-through" : "none" }}>
              {item.text}
            </span>
            <span className="text-xs" style={{ color: "#333", fontFamily: "monospace" }}>{item.source}</span>
            <button onClick={() => remove(item.id)} className="text-xs opacity-0 group-hover:opacity-100" style={{ color: "#444" }}>✕</button>
          </div>
        ))}
        <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: "1px solid #1a1a1a" }}>
          <input
            placeholder="Capture..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && add()}
            className="flex-1 text-sm bg-transparent outline-none"
            style={{ color: "#aaa" }}
          />
        </div>
      </div>
    </Widget>
  );
}
