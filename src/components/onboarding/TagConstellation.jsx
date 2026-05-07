import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const POSITIONS = [
  { left: "10%", top: "16%" }, { left: "58%", top: "13%" },
  { left: "30%", top: "25%" }, { left: "68%", top: "31%" },
  { left: "8%", top: "39%" },  { left: "43%", top: "45%" },
  { left: "70%", top: "52%" }, { left: "17%", top: "60%" },
  { left: "47%", top: "68%" }, { left: "12%", top: "78%" },
  { left: "61%", top: "78%" }, { left: "34%", top: "83%" },
];

export default function TagConstellation({ tags, selectedCount, onSelect, onContinue }) {
  const [dissolvingKey, setDissolvingKey] = useState(null);

  const handleSelect = (tag) => {
    if (dissolvingKey) return;
    setDissolvingKey(tag.label);
    setTimeout(() => {
      onSelect(tag);
      setDissolvingKey(null);
    }, 260);
  };

  return (
    <div className="min-h-dvh relative overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, rgba(232,131,74,0.06), transparent 70%)" }} />
      </div>

      <div className="sr-only" aria-live="polite">{selectedCount} woorden gekozen</div>

      <div className="fixed left-6 right-6 top-8 z-10" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>KIES WAT KLOPT</p>
        <h1 className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
          Tik op woorden die bij je passen.
        </h1>
        <p style={{ marginTop: 10, maxWidth: 310, fontSize: 14, color: "var(--text-muted)", lineHeight: 1.55 }}>
          Elk gekozen woord lost op en maakt plaats voor een nieuw woord.
        </p>
      </div>

      <AnimatePresence>
        {tags.map((tag, index) => {
          const position = POSITIONS[index % POSITIONS.length];
          return (
            <motion.button
              key={tag.label}
              type="button"
              onClick={() => handleSelect(tag)}
              className="press"
              style={{
                position: "absolute",
                left: position.left, top: position.top,
                transform: "translate(-50%, -50%)",
                minHeight: 48, padding: "10px 18px",
                borderRadius: 999,
                border: "1px solid rgba(232,131,74,0.28)",
                background: "linear-gradient(145deg, rgba(232,131,74,0.12), rgba(232,131,74,0.02))",
                color: "var(--text)",
                fontFamily: "'Geist', system-ui, sans-serif",
                fontSize: 14, fontWeight: 500,
                whiteSpace: "nowrap", cursor: "pointer",
                boxShadow: "0 12px 32px rgba(0,0,0,0.3), 0 0 24px rgba(232,131,74,0.08)",
              }}
              initial={{ opacity: 0, filter: "blur(10px)", scale: 0.92 }}
              animate={dissolvingKey === tag.label ? { opacity: 0, filter: "blur(16px)", scale: 0.72 } : { opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, filter: "blur(16px)", scale: 0.72 }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              aria-label={`Kies ${tag.label}`}
            >
              {tag.label}
            </motion.button>
          );
        })}
      </AnimatePresence>

      <div
        className="fixed left-6 right-6 flex items-center justify-between gap-4"
        style={{ bottom: "calc(24px + env(safe-area-inset-bottom, 0px))" }}
      >
        <span style={{ fontSize: 13, color: "var(--text-faint)", fontWeight: 500, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
          {selectedCount > 0 ? `${selectedCount} gekozen` : "tik wat klopt"}
        </span>
        <button
          type="button"
          onClick={onContinue}
          className="press"
          style={{
            minHeight: 46, padding: "0 20px", borderRadius: 999,
            border: "1px solid var(--border)", background: "rgba(255,255,255,0.05)",
            color: "var(--text-muted)", fontSize: 13, fontWeight: 500,
          }}
        >
          Verder naar chat
        </button>
      </div>
    </div>
  );
}