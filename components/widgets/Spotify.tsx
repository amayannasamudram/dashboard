"use client";

import React, { useEffect, useState } from "react";
import Widget from "./Widget";

interface NowPlaying {
  playing: boolean;
  track?: string;
  artist?: string;
  album?: string;
  albumArt?: string;
  progress?: number;
  duration?: number;
  url?: string;
}

export default function Spotify({ style }: { style?: React.CSSProperties }) {
  const [data, setData] = useState<NowPlaying | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await fetch("/api/spotify");
      const d = await res.json();
      if (d.error) { setError(d.error); return; }
      setData(d);
      setError("");
    } catch { setError("fetch failed"); }
  };

  useEffect(() => { load(); const t = setInterval(load, 15000); return () => clearInterval(t); }, []);

  const pct = data?.progress && data?.duration ? (data.progress / data.duration) * 100 : 0;

  return (
    <Widget title="Spotify" badge={data?.playing ? "live" : "idle"} badgeColor={data?.playing ? "green" : "primary"} style={style}>
      {error ? (
        <p style={{ fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>
          {error.includes("not configured") ? "Add Spotify tokens to .env.local" : error}
        </p>
      ) : !data ? (
        <p style={{ fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>loading…</p>
      ) : !data.playing ? (
        <p style={{ fontSize: 12, color: "var(--ink-3)" }}>Nothing playing</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {data.albumArt && (
              <img src={data.albumArt} alt="" style={{ width: 40, height: 40, borderRadius: "var(--radius)", flexShrink: 0 }} />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <a href={data.url} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", textDecoration: "none", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {data.track}
              </a>
              <p style={{ fontSize: 11, color: "var(--ink-2)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {data.artist}
              </p>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ height: 2, background: "var(--surface-raised)", borderRadius: 1 }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "var(--green)", borderRadius: 1, transition: "width 1s linear" }} />
          </div>
          <p style={{ fontSize: 10, color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>{data.album}</p>
        </div>
      )}
    </Widget>
  );
}
