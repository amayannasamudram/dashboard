"use client";

import { useState } from "react";
import Widget from "./Widget";

interface Task {
  id: string;
  text: string;
  done: boolean;
  priority: "high" | "mid" | "low";
}

const INIT: Task[] = [
  { id: "1", text: "Finish PiOS setup", done: false, priority: "high" },
  { id: "2", text: "Push first commit", done: false, priority: "high" },
];

const P_COLOR = { high: "#ef4444", mid: "#eab308", low: "#555" };

export default function TaskChecklist() {
  const [tasks, setTasks] = useState<Task[]>(INIT);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("mid");

  const add = () => {
    if (!input.trim()) return;
    setTasks(t => [...t, { id: Date.now().toString(), text: input, done: false, priority }]);
    setInput("");
  };

  const toggle = (id: string) => setTasks(t => t.map(task => task.id === id ? { ...task, done: !task.done } : task));
  const remove = (id: string) => setTasks(t => t.filter(task => task.id !== id));

  const open = tasks.filter(t => !t.done);
  const done = tasks.filter(t => t.done);

  return (
    <Widget title="Tasks" badge={open.length} badgeColor="#ef4444">
      <div className="flex flex-col gap-1">
        {open.map(t => (
          <div key={t.id} className="flex items-center gap-2 py-1.5 group">
            <button onClick={() => toggle(t.id)} className="shrink-0 w-4 h-4 rounded border flex items-center justify-center" style={{ borderColor: "#2a2a2a", background: "transparent" }}>
              <div className="w-2 h-2 rounded-sm" style={{ background: P_COLOR[t.priority] }} />
            </button>
            <span className="text-sm flex-1" style={{ color: "#ccc" }}>{t.text}</span>
            <button onClick={() => remove(t.id)} className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#444" }}>✕</button>
          </div>
        ))}

        {done.length > 0 && (
          <>
            <div className="my-2" style={{ borderTop: "1px solid #1a1a1a" }} />
            {done.map(t => (
              <div key={t.id} className="flex items-center gap-2 py-1 group">
                <button onClick={() => toggle(t.id)} className="shrink-0 w-4 h-4 rounded border flex items-center justify-center" style={{ borderColor: "#222", background: "#1a1a1a" }}>
                  <span style={{ color: "#444", fontSize: 10 }}>✓</span>
                </button>
                <span className="text-sm flex-1 line-through" style={{ color: "#333" }}>{t.text}</span>
                <button onClick={() => remove(t.id)} className="text-xs opacity-0 group-hover:opacity-100" style={{ color: "#333" }}>✕</button>
              </div>
            ))}
          </>
        )}

        {/* Input */}
        <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: "1px solid #1a1a1a" }}>
          <div className="flex gap-1">
            {(["high", "mid", "low"] as Task["priority"][]).map(p => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className="w-3 h-3 rounded-full transition-all"
                style={{ background: P_COLOR[p], opacity: priority === p ? 1 : 0.25 }}
              />
            ))}
          </div>
          <input
            placeholder="Add task..."
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
