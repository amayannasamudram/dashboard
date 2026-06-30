"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Widget from "./Widget";

interface Doc {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  project: string;
}

interface DriveResult {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  modifiedTime: string;
}

function docIcon(mimeType: string): string {
  if (mimeType?.includes("document")) return "📄";
  if (mimeType?.includes("spreadsheet")) return "📊";
  if (mimeType?.includes("presentation")) return "📑";
  if (mimeType?.includes("form")) return "📋";
  if (mimeType?.includes("folder")) return "📂";
  return "📁";
}

function docTypeLabel(mimeType: string): string {
  if (mimeType?.includes("document")) return "Doc";
  if (mimeType?.includes("spreadsheet")) return "Sheet";
  if (mimeType?.includes("presentation")) return "Slides";
  if (mimeType?.includes("form")) return "Form";
  if (mimeType?.includes("folder")) return "Folder";
  return "Drive";
}

const STORAGE_KEY = "pios-project-docs";

export default function ProjectDocs({ style }: { style?: React.CSSProperties }) {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<DriveResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [projectTag, setProjectTag] = useState("");
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDocs(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (next: Doc[]) => {
    setDocs(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const searchDrive = useCallback((q: string) => {
    if (debounce.current) clearTimeout(debounce.current);
    if (!q.trim()) { setResults([]); return; }
    debounce.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/drive?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.files ?? []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);
  }, []);

  const pick = (file: DriveResult) => {
    persist([...docs, {
      id: file.id ?? Date.now().toString(),
      name: file.name,
      url: file.url,
      mimeType: file.mimeType,
      project: projectTag.trim(),
    }]);
    setSearch("");
    setResults([]);
    setProjectTag("");
    setAdding(false);
  };

  const remove = (id: string) => persist(docs.filter(d => d.id !== id));

  const projects = Array.from(new Set(docs.map(d => d.project).filter(Boolean)));
  const visible = filter === "all" ? docs : docs.filter(d => d.project === filter);

  return (
    <Widget
      title="Docs"
      badge={docs.length || undefined}
      badgeColor="primary"
      action={{ label: "+ add", onClick: () => setAdding(v => !v) }}
      style={style}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>

        {/* Add panel */}
        {adding && (
          <div style={{
            marginBottom: 4,
            padding: 10,
            background: "var(--surface-raised)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}>
            <div style={{ position: "relative" }}>
              <input
                autoFocus
                placeholder="Search Drive by name…"
                value={search}
                onChange={e => { setSearch(e.target.value); searchDrive(e.target.value); }}
                onKeyDown={e => e.key === "Escape" && setAdding(false)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "none",
                  border: "none",
                  borderBottom: "1px solid var(--border)",
                  outline: "none",
                  color: "var(--ink)",
                  fontSize: 13,
                  paddingBottom: 4,
                }}
              />
              {searching && (
                <span style={{ position: "absolute", right: 0, top: 0, fontSize: 10, color: "var(--ink-3)" }}>
                  searching…
                </span>
              )}
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {results.map(f => (
                  <button
                    key={f.id}
                    onClick={() => pick(f)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 8px",
                      background: "transparent",
                      border: "1px solid transparent",
                      borderRadius: "var(--radius)",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "var(--surface)";
                      e.currentTarget.style.borderColor = "var(--border)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "transparent";
                    }}
                  >
                    <span style={{ fontSize: 14, flexShrink: 0 }}>{docIcon(f.mimeType)}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {f.name}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--ink-3)", fontFamily: "var(--font-mono)", marginTop: 1 }}>
                        {docTypeLabel(f.mimeType)} · {new Date(f.modifiedTime).toLocaleDateString()}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {search && !searching && results.length === 0 && (
              <p style={{ fontSize: 11, color: "var(--ink-3)", margin: 0 }}>No results in Drive.</p>
            )}

            <input
              placeholder="Project tag (optional)"
              value={projectTag}
              onChange={e => setProjectTag(e.target.value)}
              style={{
                background: "none",
                border: "none",
                borderBottom: "1px solid var(--border-subtle)",
                outline: "none",
                color: "var(--ink-2)",
                fontSize: 12,
                paddingBottom: 4,
              }}
            />

            <button
              onClick={() => { setAdding(false); setSearch(""); setResults([]); setProjectTag(""); }}
              style={{ alignSelf: "flex-start", fontSize: 11, padding: "2px 8px", borderRadius: "var(--radius)", background: "transparent", color: "var(--ink-3)", border: "1px solid var(--border)", cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Project filter tabs */}
        {projects.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 2 }}>
            {["all", ...projects].map(p => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                style={{
                  fontSize: 10,
                  padding: "2px 7px",
                  borderRadius: "var(--radius-sm)",
                  border: `1px solid ${filter === p ? "var(--primary)" : "var(--border-subtle)"}`,
                  background: filter === p ? "var(--primary-bg)" : "transparent",
                  color: filter === p ? "var(--primary)" : "var(--ink-3)",
                  cursor: "pointer",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Doc list */}
        {visible.map(doc => (
          <div
            key={doc.id}
            style={{ display: "flex", alignItems: "center", gap: 4 }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-raised)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flex: 1,
                padding: "7px 8px",
                borderRadius: "var(--radius)",
                textDecoration: "none",
                minWidth: 0,
              }}
            >
              <span style={{ fontSize: 14, flexShrink: 0 }}>{docIcon(doc.mimeType)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {doc.name}
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 2, alignItems: "center" }}>
                  <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}>
                    {docTypeLabel(doc.mimeType)}
                  </span>
                  {doc.project && (
                    <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}>
                      · {doc.project}
                    </span>
                  )}
                </div>
              </div>
            </a>
            <button
              onClick={() => remove(doc.id)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", fontSize: 12, opacity: 0, flexShrink: 0, padding: "0 6px" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
            >
              ✕
            </button>
          </div>
        ))}

        {visible.length === 0 && !adding && (
          <p style={{ fontSize: 12, color: "var(--ink-3)", textAlign: "center", paddingTop: 20 }}>
            No docs yet. Hit + add to search Drive.
          </p>
        )}
      </div>
    </Widget>
  );
}
