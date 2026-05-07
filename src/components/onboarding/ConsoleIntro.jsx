import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LINES = [
  "Kies een paar woorden die iets over jou zeggen.",
  "Tik op een woord als het klopt. Het verdwijnt daarna vanzelf.",
  "Je hoeft niets uit te leggen. Luna gebruikt dit alleen om zachter aan te sluiten."
];

export default function ConsoleIntro({ onDone }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished) return;
    const current = LINES[lineIndex];
    if (charIndex < current.length) {
      const delay = 100 + Math.floor(Math.random() * 60);
      const timer = setTimeout(() => setCharIndex((i) => i + 1), delay);
      return () => clearTimeout(timer);
    }
    if (lineIndex < LINES.length - 1) {
      const timer = setTimeout(() => {
        setLineIndex((i) => i + 1);
        setCharIndex(0);
      }, 600);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setFinished(true), 600);
    return () => clearTimeout(timer);
  }, [charIndex, lineIndex, finished]);

  const shownLines = LINES.slice(0, lineIndex).concat(LINES[lineIndex].slice(0, charIndex));

  return (
    <div className="min-h-dvh relative overflow-hidden flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 20% 30%, rgba(232,131,74,0.06), transparent 70%)" }} />
      </div>

      <div
        className="flex-1"
        style={{ padding: "calc(32px + env(safe-area-inset-top, 0px)) 24px" }}
      >
        <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 16, lineHeight: 1.8, color: "var(--text-muted)", letterSpacing: "0.02em" }}>
          {shownLines.map((line, i) => (
            <div key={i} style={{ minHeight: 32 }}>{line}</div>
          ))}
          <span className="console-cursor" aria-hidden="true" style={{ background: "#E8834A" }} />
        </div>
      </div>

      <div style={{ padding: "0 24px calc(24px + env(safe-area-inset-bottom, 0px))" }}>
        <button
          onClick={onDone}
          className="press"
          style={{
            width: "100%", height: 52, borderRadius: 999,
            border: finished ? "1px solid rgba(232,131,74,0.3)" : "1px solid var(--border)",
            background: finished ? "rgba(232,131,74,0.12)" : "rgba(255,255,255,0.02)",
            color: finished ? "#E8834A" : "var(--text-faint)",
            fontSize: 14, fontWeight: 500, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            transition: "all 0.2s ease",
          }}
        >
          {finished ? "Start selectie" : "Overslaan"}
        </button>
      </div>
    </div>
  );
}