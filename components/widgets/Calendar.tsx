"use client";

import React, { useState, useEffect } from "react";
import Widget from "./Widget";

interface CalEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  color: "primary" | "green" | "yellow" | "red" | "purple";
}

const COLOR_VAR: Record<CalEvent["color"], string> = {
  primary: "var(--primary)",
  green:   "var(--green)",
  yellow:  "var(--yellow)",
  red:     "var(--red)",
  purple:  "var(--purple)",
};

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const STORAGE_KEY = "pios-calendar";

function toKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

export default function Calendar({ style }: { style?: React.CSSProperties }) {
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", color: "primary" as CalEvent["color"] });

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) setEvents(JSON.parse(raw)); } catch {}
  }, []);

  const persist = (next: CalEvent[]) => { setEvents(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };

  const addEvent = () => {
    if (!form.title.trim() || !selected) return;
    persist([...events, { id: Date.now().toString(), date: selected, title: form.title.trim(), color: form.color }]);
    setForm({ title: "", color: "primary" });
  };

  const removeEvent = (id: string) => persist(events.filter(e => e.id !== id));

  const prevMonth = () => setView(v => v.month === 0 ? { year: v.year-1, month: 11 } : { ...v, month: v.month-1 });
  const nextMonth = () => setView(v => v.month === 11 ? { year: v.year+1, month: 0 } : { ...v, month: v.month+1 });

  const firstDay = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month+1, 0).getDate();
  const todayKey = toKey(today);

  const eventsByDate: Record<string, CalEvent[]> = {};
  events.forEach(e => { if (!eventsByDate[e.date]) eventsByDate[e.date] = []; eventsByDate[e.date].push(e); });

  const selectedEvents = selected ? (eventsByDate[selected] ?? []) : [];

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({length: daysInMonth}, (_,i) => i+1)];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <Widget title="Calendar" style={style}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

        {/* Month nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={prevMonth} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", fontSize: 14, padding: "0 4px" }}>‹</button>
          <span style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)" }}>{MONTHS[view.month]} {view.year}</span>
          <button onClick={nextMonth} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", fontSize: 14, padding: "0 4px" }}>›</button>
        </div>

        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
          {DAYS.map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--ink-3)", padding: "2px 0" }}>{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
          {cells.map((day, i) => {
            if (!day) return <div key={`e${i}`} />;
            const key = `${view.year}-${String(view.month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
            const isToday = key === todayKey;
            const isSelected = key === selected;
            const dayEvents = eventsByDate[key] ?? [];

            return (
              <button
                key={key}
                onClick={() => setSelected(isSelected ? null : key)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  padding: "3px 1px",
                  borderRadius: "var(--radius-sm)",
                  border: isSelected ? "1px solid var(--primary)" : "1px solid transparent",
                  background: isToday ? "var(--primary-bg)" : isSelected ? "var(--surface-raised)" : "transparent",
                  cursor: "pointer",
                }}
              >
                <span style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  color: isToday ? "var(--primary)" : "var(--ink-2)",
                  fontWeight: isToday ? 600 : 400,
                }}>
                  {day}
                </span>
                {dayEvents.length > 0 && (
                  <div style={{ display: "flex", gap: 2 }}>
                    {dayEvents.slice(0, 3).map(e => (
                      <div key={e.id} style={{ width: 4, height: 4, borderRadius: "50%", background: COLOR_VAR[e.color] }} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected day panel */}
        {selected && (
          <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}>
              {new Date(selected + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </span>

            {selectedEvents.map(e => (
              <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLOR_VAR[e.color], flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 12, color: "var(--ink)" }}>{e.title}</span>
                <button onClick={() => removeEvent(e.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", fontSize: 11 }}>✕</button>
              </div>
            ))}

            {/* Add event */}
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input
                autoFocus
                placeholder="Add event…"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && addEvent()}
                style={{ flex: 1, background: "none", border: "none", borderBottom: "1px solid var(--border-subtle)", outline: "none", fontSize: 12, color: "var(--ink)", paddingBottom: 2 }}
              />
              {(["primary","green","yellow","red","purple"] as CalEvent["color"][]).map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                  style={{ width: 10, height: 10, borderRadius: "50%", background: COLOR_VAR[c], border: form.color === c ? "2px solid var(--ink)" : "2px solid transparent", cursor: "pointer", padding: 0 }} />
              ))}
              <button onClick={addEvent} style={{ fontSize: 11, padding: "2px 8px", borderRadius: "var(--radius-sm)", background: "var(--primary-bg)", color: "var(--primary)", border: "1px solid var(--primary)", cursor: "pointer" }}>+</button>
            </div>
          </div>
        )}
      </div>
    </Widget>
  );
}
