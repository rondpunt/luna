import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Check } from "lucide-react";

/* 5 states — abstract, discreet, geen cijfers/smileys */
const STATES = [
  { key: "zwaar",  label: "Zwaar",  score: 2,  accent: "#9C5A5A", bgDark: "#241317" },
  { key: "vlak",   label: "Vlak",   score: 4,  accent: "#8A8278", bgDark: "#1C1A18" },
  { key: "rustig", label: "Rustig", score: 6,  accent: "#8A9482", bgDark: "#161C18" },
  { key: "open",   label: "Open",   score: 8,  accent: "#B89572", bgDark: "#241B14" },
  { key: "helder", label: "Helder", score: 10, accent: "#D4AF89", bgDark: "#251D14" },
];

function TextureBar({ state, active }) {
  const { key, accent } = state;
  const baseProps = { width: "100%", height: 36, viewBox: "0 0 100 36", preserveAspectRatio: "none" };
  const stroke = active ? accent : "rgba(242,237,228,0.20)";
  const opacity = active ? 1 : 0.45;

  if (key === "zwaar") {
    return (
      <svg {...baseProps} style={{ opacity }}>
        {[...Array(14)].map((_, i) => (
          <line key={i} x1={i * 7.5 + 4} y1="2" x2={i * 7.5 + 4} y2="34" stroke={stroke} strokeWidth="1.6" />
        ))}
      </svg>
    );
  }
  if (key === "vlak") {
    return (
      <svg {...baseProps} style={{ opacity }}>
        <line x1="2" y1="18" x2="98" y2="18" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (key === "rustig") {
    return (
      <svg {...baseProps} style={{ opacity }}>
        <path d="M 2 18 Q 25 10, 50 18 T 98 18" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (key === "open") {
    return (
      <svg {...baseProps} style={{ opacity }}>
        {[12, 28, 44, 60, 76, 92].map((x, i) => (
          <circle key={i} cx={x} cy={18 + (i % 2 === 0 ? -4 : 4)} r="1.7" fill={stroke} />
        ))}
      </svg>
    );
  }
  return (
    <svg {...baseProps} style={{ opacity }}>
      <path d="M 2 28 L 25 22 L 50 16 L 75 10 L 98 6" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HeroMoodCard({ mood, setMood, onSave, onSaveAndChat, saving, saved, checkedToday, onOpenChat }) {
  const currentIdx = Math.max(0, Math.min(STATES.length - 1, Math.floor((mood - 1) / 2)));
  const current = STATES[currentIdx];
  const { accent, bgDark } = current;

  const handleSelect = (idx) => { import("@/lib/haptics").then(({ haptic }) => haptic.soft()); setMood(STATES[idx].score); };

  if (checkedToday && !saved) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative", borderRadius: 32, overflow: "hidden",
          padding: "44px 28px",
          background: "linear-gradient(160deg, #1A1F1B 0%, #15101D 65%, #0E0B14 100%)",
          border: "1px solid rgba(138,148,130,0.20)",
          textAlign: "center",
        }}
      >
        <div style={{
          width: 64, height: 64, borderRadius: "50%", margin: "0 auto 22px",
          background: "rgba(138,148,130,0.14)", border: "1px solid rgba(138,148,130,0.32)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Check size={26} style={{ color: "#8A9482" }} strokeWidth={2} />
        </div>
        <h2 className="font-display" style={{ fontSize: 30, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 10 }}>
          Vandaag ingecheckt.
        </h2>
        <p style={{ fontSize: 15, color: "var(--text-soft)", marginBottom: 30, lineHeight: 1.5 }}>
          Je hoeft niets meer te doen. Open een gesprek als je wil.
        </p>
        <button onClick={onOpenChat} className="btn btn-primary press" style={{ maxWidth: 240, margin: "0 auto", height: 50, fontSize: 15 }}>
          <MessageCircle size={16} strokeWidth={2} />
          Open chat
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "relative", borderRadius: 32, overflow: "hidden",
        padding: "32px 28px 28px",
        background: `linear-gradient(160deg, ${bgDark} 0%, #15101D 65%, #0E0B14 100%)`,
        border: `1px solid ${accent}28`,
        transition: "background 0.7s ease, border-color 0.7s ease",
        boxShadow: `0 28px 70px ${accent}18, 0 0 0 1px rgba(242,237,228,0.02) inset`,
      }}
    >
      <motion.div
        animate={{ opacity: [0.40, 0.70, 0.40] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: -100, right: -70,
          width: 260, height: 260, borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}22, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <p className="eyebrow" style={{ marginBottom: 22, color: accent }}>HOE VOELT HET?</p>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="font-display"
            style={{
              fontSize: 56, lineHeight: 1, color: accent,
              letterSpacing: "-0.035em", marginBottom: 30,
              filter: `drop-shadow(0 0 28px ${accent}40)`,
            }}
          >
            {current.label}
          </motion.div>
        </AnimatePresence>

        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {STATES.map((s, i) => {
            const active = i === currentIdx;
            return (
              <button
                key={s.key}
                onClick={() => handleSelect(i)}
                aria-label={s.label}
                className="press"
                style={{
                  flex: 1, padding: "14px 8px 12px",
                  background: active ? `${s.accent}14` : "rgba(242,237,228,0.025)",
                  border: `1px solid ${active ? s.accent + "44" : "rgba(242,237,228,0.06)"}`,
                  borderRadius: 16, cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                }}
              >
                <TextureBar state={s} active={active} />
                <span style={{
                  fontSize: 10, fontWeight: 600,
                  color: active ? s.accent : "var(--text-faint)",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  transition: "color 0.3s",
                }}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => { import("@/lib/haptics").then(({ haptic }) => haptic.medium()); onSaveAndChat?.(); }} disabled={saving} className="press" style={{
            flex: 2, height: 52, borderRadius: 26, border: "none",
            background: `linear-gradient(135deg, ${accent}, ${accent}CC)`,
            color: "#1A120A", fontSize: 15, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: `0 10px 28px ${accent}38`,
            transition: "all 0.2s",
          }}>
            <MessageCircle size={16} strokeWidth={2.2} />
            Open chat
          </button>
          <button onClick={() => { import("@/lib/haptics").then(({ haptic }) => haptic.soft()); onSave?.(); }} disabled={saving || saved} className="press" style={{
            flex: 1, height: 52, borderRadius: 26,
            background: "rgba(242,237,228,0.04)", border: "1px solid rgba(242,237,228,0.09)",
            color: saved ? "#8A9482" : "var(--text)", fontSize: 13, fontWeight: 500, cursor: "pointer",
            transition: "all 0.2s",
          }}>
            {saved ? "✓ Opgeslagen" : "Alleen opslaan"}
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
          <span style={{ fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.04em" }}>
            🔒 Alleen jij ziet dit · niets gedeeld
          </span>
        </div>
      </div>
    </motion.div>
  );
}