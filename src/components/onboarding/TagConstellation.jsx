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
    <div className="min-h-dvh relative overflow-hidden" style={{ background: "#050508" }}>
      <div className="sr-only" aria-live="polite">{selectedCount} woorden gekozen</div>

      <div className="fixed left-6 right-6 top-8 z-10" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <p className="eyebrow-muted" style={{ marginBottom: 8 }}>KIES WAT KLOPT</p>
        <h1 className="font-display" style={{ fontSize: 34, color: "var(--text)", letterSpacing: "-0.03em", lineHeight: 1.02 }}>
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
              className="tag-orbit-button"
              style={{ left: position.left, top: position.top }}
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
        style={{ bottom: "calc(22px + env(safe-area-inset-bottom, 0px))" }}
      >
        <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, color: "rgba(242,237,227,0.38)" }}>
          {selectedCount > 0 ? `${selectedCount} gekozen` : "tik wat klopt"}
        </span>
        <button
          type="button"
          onClick={onContinue}
          className="press"
          style={{
            minHeight: 46,
            padding: "0 18px",
            borderRadius: 999,
            border: "1px solid rgba(242,237,227,0.16)",
            background: "rgba(242,237,227,0.045)",
            color: "rgba(242,237,227,0.76)",
            fontSize: 13,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          verder naar chat
        </button>
      </div>
    </div>
  );
}