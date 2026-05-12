import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Check } from "lucide-react";

/* 5 states — geen cijfers, geen smileys, geen "score".
   Elk woord is bewust dubbelzinnig (kan slaan op binnen of buiten). */
const STATES = [
  { key: "zwaar",   label: "Zwaar",        score: 2,  accent: "#A14848", bgDark: "#2B1414" },
  { key: "vlak",    label: "Vlak",         score: 4,  accent: "#8A7A6E", bgDark: "#1F1B17" },
  { key: "rustig",  label: "Rustig",       score: 6,  accent: "#8A8F7E", bgDark: "#1A1E1A" },
  { key: "open",    label: "Open",         score: 8,  accent: "#C68A55", bgDark: "#241710" },
  { key: "helder",  label: "Helder",       score: 10, accent: "#E8834A", bgDark: "#2D1A0E" },
];

/* Visuele textuur per state — abstract, geen gezichten */
function TextureBar({ state, active }) {
  const { key, accent } = state;
  const baseProps = { width: "100%", height: 36, viewBox: "0 0 100 36", preserveAspectRatio: "none" };
  const stroke = active ? accent : "rgba(255,255,255,0.22)";
  const opacity = active ? 1 : 0.45;

  if (key === "zwaar") {
    // Dichte, drukkende verticale strepen
    return (
      <svg {...baseProps} style={{ opacity }}>
        {[...Array(14)].map((_, i) => (
          <line key={i} x1={i * 7.5 + 4} y1="2" x2={i * 7.5 + 4} y2="34" stroke={stroke} strokeWidth="1.8" />
        ))}
      </svg>
    );
  }
  if (key === "vlak") {
    // Horizontale lijn — niets beweegt
    return (
      <svg {...baseProps} style={{ opacity }}>
        <line x1="2" y1="18" x2="98" y2="18" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (key === "rustig") {
    // Trage golf
    return (
      <svg {...baseProps} style={{ opacity }}>
        <path d="M 2 18 Q 25 10, 50 18 T 98 18" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (key === "open") {
    // Verspreide stippen — beweging zonder druk
    return (
      <svg {...baseProps} style={{ opacity }}>
        {[12, 28, 44, 60, 76, 92].map((x, i) => (
          <circle key={i} cx={x} cy={18 + (i % 2 === 0 ? -4 : 4)} r="1.8" fill={stroke} />
        ))}
      </svg>
    );
  }
  // helder — opwaartse beweging
  return (
    <svg {...baseProps} style={{ opacity }}>
      <path d="M 2 28 L 25 22 L 50 16 L 75 10 L 98 6" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HeroMoodCard({ mood, setMood, onSave, onSaveAndChat, saving, saved, checkedToday, onOpenChat }) {
  // Map externe `mood` (1-10) naar onze state index
  const currentIdx = Math.max(0, Math.min(STATES.length - 1, Math.floor((mood - 1) / 2)));
  const current = STATES[currentIdx];
  const { accent, bgDark } = current;

  const handleSelect = (idx) => setMood(STATES[idx].score);

  if (checkedToday && !saved) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative", borderRadius: 32, overflow: "hidden",
          padding: "40px 28px",
          background: "linear-gradient(160deg, #1A2D24 0%, #0F1814 60%, #080810 100%)",
          border: "1px solid rgba(107,173,138,0.18)",
          textAlign: "center",
        }}
      >
        <div style={{
          width: 64, height: 64, borderRadius: "50%", margin: "0 auto 20px",
          background: "rgba(107,173,138,0.14)", border: "1px solid rgba(107,173,138,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Check size={28} style={{ color: "#6BAD8A" }} strokeWidth={2} />
        </div>
        <h2 className="font-display" style={{ fontSize: 32, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 8 }}>
          Vandaag ingecheckt.
        </h2>
        <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 28, lineHeight: 1.5 }}>
          Je hoeft niets meer te doen. 66 is er als je wil praten.
        </p>
        <button onClick={onOpenChat} className="btn btn-primary press" style={{ maxWidth: 240, margin: "0 auto", height: 50, fontSize: 15 }}>
          <MessageCircle size={16} strokeWidth={2} />
          Praat met 66
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
        padding: "30px 26px 26px",
        background: `linear-gradient(160deg, ${bgDark} 0%, #0F0F1A 65%, #080810 100%)`,
        border: `1px solid ${accent}26`,
        transition: "background 0.7s ease, border-color 0.7s ease",
        boxShadow: `0 24px 60px ${accent}1A, 0 0 0 1px rgba(255,255,255,0.02) inset`,
      }}
    >
      {/* Ambient glow */}
      <motion.div
        animate={{ opacity: [0.45, 0.75, 0.45] }}
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

        {/* Current label — groot, serif */}
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
              letterSpacing: "-0.035em", marginBottom: 28,
              filter: `drop-shadow(0 0 28px ${accent}40)`,
            }}
          >
            {current.label}
          </motion.div>
        </AnimatePresence>

        {/* 5 texture pills — geen cijfers, geen emoji */}
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
                  background: active ? `${s.accent}14` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${active ? s.accent + "44" : "rgba(255,255,255,0.06)"}`,
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

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onSaveAndChat} disabled={saving} className="press" style={{
            flex: 2, height: 52, borderRadius: 26, border: "none",
            background: `linear-gradient(135deg, ${accent}, ${accent}DD)`,
            color: "#1A0E08", fontSize: 15, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: `0 10px 28px ${accent}40`,
            transition: "all 0.2s",
          }}>
            <MessageCircle size={16} strokeWidth={2.2} />
            Praat met 66
          </button>
          <button onClick={onSave} disabled={saving || saved} className="press" style={{
            flex: 1, height: 52, borderRadius: 26,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            color: saved ? "#6BAD8A" : "var(--text)", fontSize: 13, fontWeight: 500, cursor: "pointer",
            transition: "all 0.2s",
          }}>
            {saved ? "✓ Opgeslagen" : "Alleen opslaan"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}