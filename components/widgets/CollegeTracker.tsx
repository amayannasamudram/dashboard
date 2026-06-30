"use client";

import React, { useState, useEffect } from "react";
import Widget from "./Widget";

type AppStatus = "researching" | "in-progress" | "submitted" | "accepted" | "rejected" | "deferred" | "waitlisted";
type AppType = "ED" | "EA" | "RD" | "REA";
type Tier = "reach" | "target" | "safety";

interface Requirement { label: string; done: boolean; }

interface College {
  id: string;
  name: string;
  type: AppType;
  tier: Tier;
  status: AppStatus;
  deadline: string;
  supplementalUrl: string;
  notes: string;
  essaysTotal: number;
  essaysDone: number;
  requirements: Requirement[];
}

const STATUS_STYLE: Record<AppStatus, { color: string; bg: string }> = {
  researching:   { color: "var(--ink-3)",   bg: "var(--surface-raised)" },
  "in-progress": { color: "var(--primary)", bg: "var(--primary-bg)"     },
  submitted:     { color: "var(--yellow)",  bg: "var(--yellow-bg)"      },
  accepted:      { color: "var(--green)",   bg: "var(--green-bg)"       },
  rejected:      { color: "var(--red)",     bg: "var(--red-bg)"         },
  deferred:      { color: "var(--purple)",  bg: "var(--purple-bg)"      },
  waitlisted:    { color: "var(--yellow)",  bg: "var(--yellow-bg)"      },
};

const STATUS_ORDER: AppStatus[] = ["researching", "in-progress", "submitted", "accepted", "rejected", "deferred", "waitlisted"];
const TIER_COLOR: Record<Tier, string> = { reach: "var(--red)", target: "var(--yellow)", safety: "var(--green)" };
const DEFAULT_REQS: Requirement[] = [
  { label: "LOR 1", done: false },
  { label: "LOR 2", done: false },
  { label: "Transcript", done: false },
  { label: "Test Scores", done: false },
];

const COMMON_APP_URL = "https://www.commonapp.org/apply/dashboard";
const STORAGE_KEY = "pios-college-tracker";
const ESSAY_KEY = "pios-personal-essay-url";
const MAC_RELAY = "http://192.168.0.138:9876/open";

async function openOnMac(url: string) {
  try { await fetch(MAC_RELAY, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) }); }
  catch { window.open(url, "_blank"); }
}

function daysUntil(deadline: string): number | null {
  if (!deadline) return null;
  return Math.ceil((new Date(deadline).getTime() - new Date().setHours(0,0,0,0)) / 86400000);
}

function DeadlineBadge({ deadline }: { deadline: string }) {
  const days = daysUntil(deadline);
  if (days === null) return null;
  const color = days < 0 ? "var(--ink-3)" : days < 14 ? "var(--red)" : days < 30 ? "var(--yellow)" : "var(--ink-3)";
  return <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color, flexShrink: 0 }}>{days < 0 ? "passed" : days === 0 ? "today" : `${days}d`}</span>;
}

function OpenBtn({ label, url, dim }: { label: string; url: string; dim?: boolean }) {
  return (
    <button onClick={() => openOnMac(url)}
      style={{ fontSize: 11, padding: "3px 9px", borderRadius: "var(--radius)", background: dim ? "transparent" : "var(--primary-bg)", color: dim ? "var(--ink-3)" : "var(--primary)", border: `1px solid ${dim ? "var(--border)" : "var(--primary)"}`, cursor: "pointer", whiteSpace: "nowrap" }}>
      {label}
    </button>
  );
}

const BLANK = { name: "", type: "RD" as AppType, tier: "reach" as Tier, deadline: "", supplementalUrl: "", essaysTotal: 1 };

export default function CollegeTracker({ style }: { style?: React.CSSProperties }) {
  const [colleges, setColleges] = useState<College[]>([]);
  const [personalEssayUrl, setPersonalEssayUrl] = useState("");
  const [editingEssayUrl, setEditingEssayUrl] = useState(false);
  const [essayInput, setEssayInput] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(BLANK);

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) setColleges(JSON.parse(raw)); } catch {}
    try { const url = localStorage.getItem(ESSAY_KEY); if (url) setPersonalEssayUrl(url); } catch {}
  }, []);

  const persist = (next: College[]) => { setColleges(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };
  const update = (id: string, patch: Partial<College>) => persist(colleges.map(c => c.id === id ? { ...c, ...patch } : c));

  const cycleStatus = (id: string) => {
    const c = colleges.find(x => x.id === id)!;
    update(id, { status: STATUS_ORDER[(STATUS_ORDER.indexOf(c.status) + 1) % STATUS_ORDER.length] });
  };
  const toggleReq = (id: string, idx: number) => {
    const c = colleges.find(x => x.id === id)!;
    update(id, { requirements: c.requirements.map((r, i) => i === idx ? { ...r, done: !r.done } : r) });
  };
  const add = () => {
    if (!form.name.trim()) return;
    persist([...colleges, { id: Date.now().toString(), name: form.name.trim(), type: form.type, tier: form.tier, status: "researching", deadline: form.deadline, supplementalUrl: form.supplementalUrl.trim(), notes: "", essaysTotal: form.essaysTotal, essaysDone: 0, requirements: DEFAULT_REQS.map(r => ({ ...r })) }]);
    setForm(BLANK); setAdding(false);
  };
  const remove = (id: string) => { persist(colleges.filter(c => c.id !== id)); if (expanded === id) setExpanded(null); };

  const saveEssayUrl = () => {
    setPersonalEssayUrl(essayInput.trim());
    localStorage.setItem(ESSAY_KEY, essayInput.trim());
    setEditingEssayUrl(false);
  };

  const submitted = colleges.filter(c => ["submitted","accepted","rejected","deferred","waitlisted"].includes(c.status)).length;

  return (
    <Widget title="College Apps" badge={`${submitted}/${colleges.length}`} badgeColor="purple" action={{ label: "+ add", onClick: () => setAdding(v => !v) }} style={style}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>

        {/* Personal essay URL setup */}
        {!personalEssayUrl || editingEssayUrl ? (
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4, padding: "6px 8px", background: "var(--surface-raised)", borderRadius: "var(--radius)", border: "1px solid var(--border-subtle)" }}>
            <span style={{ fontSize: 10, color: "var(--ink-3)", whiteSpace: "nowrap" }}>Personal essay:</span>
            <input
              autoFocus={editingEssayUrl}
              placeholder="Drive URL…"
              defaultValue={personalEssayUrl}
              onChange={e => setEssayInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && saveEssayUrl()}
              style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 11, color: "var(--ink-2)" }}
            />
            <button onClick={saveEssayUrl} style={{ fontSize: 10, padding: "2px 7px", borderRadius: "var(--radius-sm)", background: "var(--primary-bg)", color: "var(--primary)", border: "1px solid var(--primary)", cursor: "pointer" }}>Save</button>
          </div>
        ) : null}

        {/* Add form */}
        {adding && (
          <div style={{ marginBottom: 6, padding: 10, background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: "var(--radius)", display: "flex", flexDirection: "column", gap: 8 }}>
            <input autoFocus placeholder="College name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onKeyDown={e => e.key === "Enter" && add()}
              style={{ background: "none", border: "none", outline: "none", fontSize: 13, color: "var(--ink)", borderBottom: "1px solid var(--border)", paddingBottom: 4 }} />
            <div style={{ display: "flex", gap: 4 }}>
              {(["ED","EA","RD","REA"] as AppType[]).map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                  style={{ fontSize: 10, padding: "2px 7px", borderRadius: "var(--radius-sm)", border: `1px solid ${form.type===t?"var(--primary)":"var(--border)"}`, background: form.type===t?"var(--primary-bg)":"transparent", color: form.type===t?"var(--primary)":"var(--ink-2)", cursor: "pointer" }}>
                  {t}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {(["reach","target","safety"] as Tier[]).map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, tier: t }))}
                  style={{ fontSize: 10, padding: "2px 7px", borderRadius: "var(--radius-sm)", border: `1px solid ${form.tier===t?TIER_COLOR[t]:"var(--border)"}`, background: form.tier===t?`color-mix(in oklch, ${TIER_COLOR[t]} 15%, transparent)`:"transparent", color: form.tier===t?TIER_COLOR[t]:"var(--ink-2)", cursor: "pointer", textTransform: "capitalize" }}>
                  {t}
                </button>
              ))}
            </div>
            <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
              style={{ background: "none", border: "none", outline: "none", fontSize: 11, color: "var(--ink-2)", colorScheme: "dark" }} />
            <input placeholder="Supplemental essays URL (optional)" value={form.supplementalUrl} onChange={e => setForm(f => ({ ...f, supplementalUrl: e.target.value }))}
              style={{ background: "none", border: "none", outline: "none", fontSize: 11, color: "var(--ink-2)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "var(--ink-3)" }}>Essays:</span>
              <input type="number" min={0} max={20} value={form.essaysTotal} onChange={e => setForm(f => ({ ...f, essaysTotal: +e.target.value }))}
                style={{ background: "none", border: "none", outline: "none", fontSize: 11, color: "var(--ink-2)", width: 30 }} />
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={add} style={{ fontSize: 11, padding: "3px 10px", borderRadius: "var(--radius)", background: "var(--primary-bg)", color: "var(--primary)", border: "1px solid var(--primary)", cursor: "pointer" }}>Add</button>
              <button onClick={() => { setAdding(false); setForm(BLANK); }} style={{ fontSize: 11, padding: "3px 10px", borderRadius: "var(--radius)", background: "transparent", color: "var(--ink-2)", border: "1px solid var(--border)", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}

        {/* College rows */}
        {colleges.map(c => {
          const st = STATUS_STYLE[c.status];
          const isOpen = expanded === c.id;
          const reqsDone = c.requirements.filter(r => r.done).length;
          return (
            <div key={c.id} style={{ borderRadius: "var(--radius)", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 6px", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-raised)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                onClick={() => setExpanded(isOpen ? null : c.id)}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: TIER_COLOR[c.tier], flexShrink: 0 }} />
                <button onClick={e => { e.stopPropagation(); cycleStatus(c.id); }}
                  style={{ fontFamily: "var(--font-mono)", fontSize: 10, padding: "2px 6px", borderRadius: "var(--radius-sm)", color: st.color, background: st.bg, border: "none", cursor: "pointer", minWidth: 76, textAlign: "center", fontWeight: 500 }}>
                  {c.status}
                </button>
                <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", flexShrink: 0 }}>{c.type}</span>
                <DeadlineBadge deadline={c.deadline} />
                <span style={{ fontSize: 10, color: "var(--ink-3)", flexShrink: 0 }}>{isOpen ? "▲" : "▼"}</span>
              </div>

              {isOpen && (
                <div style={{ padding: "8px 10px 10px", background: "var(--surface-raised)", borderTop: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: 10 }}>

                  {/* Progress bars */}
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontSize: 10, color: "var(--ink-3)" }}>Essays</span>
                        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                          <button onClick={() => update(c.id, { essaysDone: Math.max(0, c.essaysDone-1) })} style={{ fontSize: 11, background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", padding: 0 }}>−</button>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-2)" }}>{c.essaysDone}/{c.essaysTotal}</span>
                          <button onClick={() => update(c.id, { essaysDone: Math.min(c.essaysTotal, c.essaysDone+1) })} style={{ fontSize: 11, background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", padding: 0 }}>+</button>
                        </div>
                      </div>
                      <div style={{ height: 3, background: "var(--border)", borderRadius: 2 }}>
                        <div style={{ height: "100%", width: `${c.essaysTotal?(c.essaysDone/c.essaysTotal)*100:0}%`, background: "var(--primary)", borderRadius: 2, transition: "width 0.2s" }} />
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontSize: 10, color: "var(--ink-3)" }}>Requirements</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-2)" }}>{reqsDone}/{c.requirements.length}</span>
                      </div>
                      <div style={{ height: 3, background: "var(--border)", borderRadius: 2 }}>
                        <div style={{ height: "100%", width: `${(reqsDone/c.requirements.length)*100}%`, background: "var(--green)", borderRadius: 2, transition: "width 0.2s" }} />
                      </div>
                    </div>
                  </div>

                  {/* Requirements chips */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {c.requirements.map((r, i) => (
                      <button key={i} onClick={() => toggleReq(c.id, i)}
                        style={{ fontSize: 10, padding: "2px 7px", borderRadius: "var(--radius-sm)", border: `1px solid ${r.done?"var(--green)":"var(--border)"}`, background: r.done?"var(--green-bg)":"transparent", color: r.done?"var(--green)":"var(--ink-3)", cursor: "pointer", textDecoration: r.done?"line-through":"none" }}>
                        {r.label}
                      </button>
                    ))}
                  </div>

                  {/* Notes */}
                  <textarea placeholder="Notes…" value={c.notes} onChange={e => update(c.id, { notes: e.target.value })}
                    style={{ background: "var(--surface)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", color: "var(--ink-2)", fontSize: 11, padding: "6px 8px", resize: "none", height: 52, outline: "none", fontFamily: "inherit", lineHeight: 1.5 }} />

                  {/* Open buttons */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                    <OpenBtn label="Common App" url={COMMON_APP_URL} />
                    {personalEssayUrl
                      ? <OpenBtn label="Personal Essay" url={personalEssayUrl} />
                      : <button onClick={() => setEditingEssayUrl(true)} style={{ fontSize: 11, padding: "3px 9px", borderRadius: "var(--radius)", background: "transparent", color: "var(--ink-3)", border: "1px solid var(--border)", cursor: "pointer" }}>Set Essay URL</button>
                    }
                    {c.supplementalUrl
                      ? <OpenBtn label="Supplemental" url={c.supplementalUrl} dim />
                      : <input placeholder="Supplemental URL" onBlur={e => update(c.id, { supplementalUrl: e.target.value.trim() })}
                          style={{ background: "none", border: "none", borderBottom: "1px solid var(--border-subtle)", outline: "none", fontSize: 11, color: "var(--ink-3)", width: 130, paddingBottom: 2 }} />
                    }
                    <button onClick={() => remove(c.id)} style={{ marginLeft: "auto", fontSize: 11, color: "var(--red)", background: "none", border: "none", cursor: "pointer", opacity: 0.5 }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = "1")} onMouseLeave={e => (e.currentTarget.style.opacity = "0.5")}>
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {colleges.length === 0 && !adding && (
          <p style={{ fontSize: 12, color: "var(--ink-3)", textAlign: "center", paddingTop: 20 }}>No colleges yet.</p>
        )}
      </div>
    </Widget>
  );
}
