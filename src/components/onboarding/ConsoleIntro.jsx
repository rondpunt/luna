import { useEffect, useState } from "react";

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
      const delay = 115 + Math.floor(Math.random() * 70);
      const timer = setTimeout(() => setCharIndex((i) => i + 1), delay);
      return () => clearTimeout(timer);
    }
    if (lineIndex < LINES.length - 1) {
      const timer = setTimeout(() => {
        setLineIndex((i) => i + 1);
        setCharIndex(0);
      }, 620);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setFinished(true), 700);
    return () => clearTimeout(timer);
  }, [charIndex, lineIndex, finished]);

  const shownLines = LINES.slice(0, lineIndex).concat(LINES[lineIndex].slice(0, charIndex));

  return (
    <div className="min-h-dvh relative overflow-hidden" style={{ background: "#050508" }}>
      <div
        className="absolute left-6 right-6 top-8"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 17, lineHeight: 1.9, color: "rgba(242,237,227,0.88)", letterSpacing: "0.01em" }}>
          {shownLines.map((line, i) => (
            <div key={i} style={{ minHeight: 32 }}>{line}</div>
          ))}
          <span className="console-cursor" aria-hidden="true" />
        </div>
      </div>

      <button
        onClick={onDone}
        className="fixed left-6 right-6 press"
        style={{
          bottom: "calc(24px + env(safe-area-inset-bottom, 0px))",
          minHeight: 48,
          borderRadius: 999,
          border: "1px solid rgba(242,237,227,0.18)",
          background: finished ? "rgba(242,237,227,0.055)" : "transparent",
          color: finished ? "rgba(242,237,227,0.82)" : "rgba(242,237,227,0.42)",
          fontSize: 14,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          transition: "opacity 180ms ease, background 180ms ease, color 180ms ease",
        }}
      >
        {finished ? "verder" : "overslaan"}
      </button>
    </div>
  );
}