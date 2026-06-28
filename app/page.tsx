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

  const fmt = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

  const fmtDate = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="flex flex-col h-screen" style={{ background: "#080808" }}>
      {/* Menubar */}
      <div
        className="flex items-center justify-between px-5 shrink-0"
        style={{ height: 40, background: "#0d0d0d", borderBottom: "1px solid #1c1c1c" }}
      >
        <div className="flex items-center gap-6">
          <span className="text-xs font-semibold" style={{ color: "#3b82f6", letterSpacing: "0.2em" }}>
            PiOS
          </span>
          <div className="flex items-center gap-1">
            {(["projects", "school"] as Workspace[]).map((w) => (
              <button
                key={w}
                onClick={() => setWorkspace(w)}
                className="px-3 py-1 text-xs rounded transition-all"
                style={{
                  background: workspace === w ? "#1e1e1e" : "transparent",
                  color: workspace === w ? "#e8e8e8" : "#555",
                  border: workspace === w ? "1px solid #2a2a2a" : "1px solid transparent",
                  fontWeight: workspace === w ? 500 : 400,
                  textTransform: "capitalize",
                }}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs" style={{ color: "#444", fontFamily: "monospace" }}>
            {fmtDate(time)}
          </span>
          <span className="text-xs" style={{ color: "#666", fontFamily: "monospace" }}>
            {fmt(time)}
          </span>
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 overflow-hidden">
        {workspace === "projects" ? <ProjectsWorkspace /> : <SchoolWorkspace />}
      </div>
    </div>
  );
}
