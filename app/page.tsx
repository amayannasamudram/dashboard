"use client";

import { useState, useEffect } from "react";
import ProjectsWorkspace from "@/components/workspaces/ProjectsWorkspace";
import SchoolWorkspace from "@/components/workspaces/SchoolWorkspace";

type Workspace = "projects" | "school";

export default function PiOS() {
  const [workspace, setWorkspace] = useState<Workspace>("projects");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fmtTime = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

  const fmtDate = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "var(--bg)" }}>

      {/* ── Menubar ── */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 36,
        padding: "0 14px",
        background: "var(--surface)",
        borderBottom: "1px solid var(--border-subtle)",
        flexShrink: 0,
      }}>

        {/* Left: wordmark + nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 600,
            color: "var(--primary)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}>
            PiOS
          </span>

          <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {(["projects", "school"] as Workspace[]).map((w) => (
              <button
                key={w}
                onClick={() => setWorkspace(w)}
                className="interactive"
                style={{
                  padding: "3px 10px",
                  fontSize: 12,
                  fontWeight: workspace === w ? 500 : 400,
                  color: workspace === w ? "var(--ink)" : "var(--ink-2)",
                  background: workspace === w ? "var(--surface-raised)" : "transparent",
                  border: workspace === w ? "1px solid var(--border)" : "1px solid transparent",
                  borderRadius: "var(--radius)",
                  cursor: "pointer",
                  textTransform: "capitalize",
                  letterSpacing: "0.01em",
                }}
              >
                {w}
              </button>
            ))}
          </nav>
        </div>

        {/* Right: date + time */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>
            {fmtDate(time)}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-2)", fontWeight: 500 }}>
            {fmtTime(time)}
          </span>
        </div>
      </header>

      {/* ── Workspace ── */}
      <main style={{ flex: 1, overflow: "hidden" }}>
        {workspace === "projects" ? <ProjectsWorkspace /> : <SchoolWorkspace />}
      </main>

    </div>
  );
}
