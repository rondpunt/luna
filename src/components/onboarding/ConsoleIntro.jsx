import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const LINES = [
  "Kies een paar woorden die iets over jou zeggen.",
  "Tik op een woord als het klopt. Het verdwijnt vanzelf.",
  "Je hoeft niets uit te leggen. Luna sluit zachter aan."
];

export default function ConsoleIntro({ onDone }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished) return;
    const current = LINES[lineIndex];
    if (charIndex < current.length) {
      // Snelle, vloeiende typesnelheid: 22-32ms per char
      const delay = 22 + Math.floor(Math.random() * 10);
      const t = setTimeout(() => setCharIndex((i) => i + 1), delay);
      return () => clearTimeout(t);
    }
    if (lineIndex < LINES.length - 1) {
      // Korte pauze tussen zinnen
      const t = setTimeout(() => {
        setLineIndex((i) => i + 1);
        setCharIndex(0);
      }, 220);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setFinished(true), 250);
    return () => clearTimeout(t);
  }, [charIndex, lineIndex, finished]);

  // Alle volledige zinnen tot nu toe + huidige (deels) zin
  const completedLines = LINES.slice(0, lineIndex);
  const currentPartial = LINES[lineIndex].slice(0, charIndex);

  const skip = () => {
    setLineIndex(LINES.length - 1);
    setCharIndex(LINES[LINES.length - 1].length);
    setFinished(true);
  };

  return (
    <div className="min-h-dvh relative overflow-hidden flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 25% 20%, rgba(232,131,74,0.08), transparent 60%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 80% 90%, rgba(164,107,168,0.05), transparent 60%)" }} />
      </div>

      {/* Top eyebrow */}
      <div style={{ padding: "calc(28px + env(safe-area-inset-top, 0px)) 24px 0" }}>
        <p className="eyebrow" style={{ marginBottom: 4 }}>EVEN AANKOMEN</p>
      </div>

      {/* Tekst */}
      <div className="flex-1 flex flex-col justify-center" style={{ padding: "0 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {completedLines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="font-display"
              style={{
                fontSize: 26,
                lineHeight: 1.25,
                letterSpacing: "-0.015em",
                color: "var(--text)",
              }}
            >
              {line}
            </motion.p>
          ))}
          {!finished || charIndex > 0 ? (
            <p
              className="font-display"
              style={{
                fontSize: 26,
                lineHeight: 1.25,
                letterSpacing: "-0.015em",
                color: "var(--text)",
              }}
            >
              {currentPartial}
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  width: 3,
                  height: 24,
                  marginLeft: 4,
                  marginBottom: -3,
                  background: "#E8834A",
                  borderRadius: 2,
                  animation: "consoleBlink 0.8s steps(1) infinite",
                  boxShadow: "0 0 12px rgba(232,131,74,0.6)",
                }}
              />
            </p>
          ) : null}
        </div>
      </div>

      {/* Knoppen */}
      <div style={{ padding: "0 24px calc(28px + env(safe-area-inset-bottom, 0px))", display: "flex", flexDirection: "column", gap: 10 }}>
        <AnimatePresence mode="wait">
          {finished ? (
            <motion.button
              key="start"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={onDone}
              className="btn btn-primary press"
              style={{ height: 56, fontSize: 16, fontWeight: 600 }}
            >
              Start
              <ArrowRight size={18} strokeWidth={2.2} />
            </motion.button>
          ) : (
            <motion.button
              key="skip"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={skip}
              className="press"
              style={{
                height: 48,
                borderRadius: 999,
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,0.025)",
                color: "var(--text-muted)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Overslaan
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}