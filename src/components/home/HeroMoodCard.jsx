import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Check } from "lucide-react";
import { haptic } from "@/lib/haptics";

/* 5 states — Junie-warm, friendly */
const STATES = [
  { key: "zwaar",  label: "Zwaar",  emoji: "💙", score: 2,  accent: "#EC6F6F", bgSoft: "#FFF0F0" },
  { key: "vlak",   label: "Vlak",   emoji: "🌫️", score: 4,  accent: "#9B7FC4", bgSoft: "#F4F0FA" },
  { key: "rustig", label: "Rustig", emoji: "🌿", score: 6,  accent: "#7BC096", bgSoft: "#EEF8F1" },
  { key: "open",   label: "Open",   emoji: "🌤️", score: 8,  accent: "#F0C674", bgSoft: "#FFF8E8" },
  { key: "helder", label: "Helder", emoji: "✨", score: 10, accent: "#6A9AD9", bgSoft: "#EEF3FB" },
];

export default function HeroMoodCard({ mood, setMood, onSave, onSaveAndChat, saving, saved, checkedToday, onOpenChat }) {
  const currentIdx = Math.max(0, Math.min(STATES.length - 1, Math.floor((mood - 1) / 2)));
  const current = STATES[currentIdx];
  const { accent, bgSoft } = current;

  const handleSelect = (idx) => { haptic.soft(); setMood(STATES[idx].score); };

  if (checkedToday && !saved) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative", borderRadius: 28, overflow: "hidden",
          padding: "40px 28px",
          background: "linear-gradient(160deg, #EEF8F1 0%, #FFFFFF 100%)",
          border: "1px solid #C9E5D3",
          textAlign: "center",
          boxShadow: "0 8px 28px rgba(123, 192, 150, 0.18)",
        }}
      >
        <div style={{
          width: 64, height: 64, borderRadius: "50%", margin: "0 auto 22px",
          background: "#7BC096", boxShadow: "0 6px 16px rgba(123, 192, 150, 0.32)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Check size={28} style={{ color: "#FFFFFF" }} strokeWidth={2.6} />
        </div>
        <h2 className="font-display-bold" style={{ fontSize: 28, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 10 }}>
          Vandaag ingecheckt ✨
        </h2>
        <p style={{ fontSize: 15, color: "var(--text-soft)", marginBottom: 28, lineHeight: 1.5 }}>
          Lief van jezelf. Open een gesprek met Junie wanneer je wilt.
        </p>
        <button onClick={onOpenChat} className="btn btn-primary press" style={{ maxWidth: 260, margin: "0 auto", height: 50, fontSize: 15 }}>
          <MessageCircle size={16} strokeWidth={2.4} />
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
        position: "relative", borderRadius: 28, overflow: "hidden",
        padding: "30px 26px 26px",
        background: `linear-gradient(160deg, ${bgSoft} 0%, #FFFFFF 100%)`,
        border: `1px solid ${accent}38`,
        transition: "background 0.7s ease, border-color 0.7s ease",
        boxShadow: `0 12px 36px ${accent}22, 0 2px 6px rgba(45,42,58,0.04)`,
      }}
    >
      <motion.div
        animate={{ opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: -80, right: -50,
          width: 220, height: 220, borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}38, transparent 70%)`,
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <p className="eyebrow" style={{ marginBottom: 18, color: accent }}>HOE VOELT HET?</p>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 26 }}
          >
            <span style={{ fontSize: 44, lineHeight: 1 }}>{current.emoji}</span>
            <span
              className="font-display-bold"
              style={{ fontSize: 44, lineHeight: 1, color: accent, letterSpacing: "-0.02em" }}
            >
              {current.label}
            </span>
          </motion.div>
        </AnimatePresence>

        <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
          {STATES.map((s, i) => {
            const active = i === currentIdx;
            return (
              <button
                key={s.key}
                onClick={() => handleSelect(i)}
                aria-label={s.label}
                className="press"
                style={{
                  flex: 1, padding: "12px 4px",
                  background: active ? s.accent : "#FFFFFF",
                  border: `1.5px solid ${active ? s.accent : "#F0E6D8"}`,
                  borderRadius: 16, cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  boxShadow: active ? `0 4px 14px ${s.accent}40` : "0 1px 2px rgba(45,42,58,0.04)",
                  transform: active ? "translateY(-2px)" : "none",
                }}
              >
                <span style={{ fontSize: 22, lineHeight: 1 }}>{s.emoji}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  color: active ? "#FFFFFF" : "var(--text-muted)",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  transition: "color 0.25s",
                }}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => { haptic.medium(); onSaveAndChat?.(); }}
            disabled={saving}
            className="press"
            style={{
              flex: 2, height: 52, borderRadius: 26, border: "none",
              background: `linear-gradient(135deg, ${accent}, ${accent}DD)`,
              color: "#FFFFFF", fontSize: 15, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: `0 8px 22px ${accent}48`,
              transition: "all 0.2s",
            }}
          >
            <MessageCircle size={16} strokeWidth={2.4} />
            Praat met Junie
          </button>
          <button
            onClick={() => { haptic.soft(); onSave?.(); }}
            disabled={saving || saved}
            className="press"
            style={{
              flex: 1, height: 52, borderRadius: 26,
              background: "#FFFFFF",
              border: "1.5px solid #F0E6D8",
              color: saved ? "#7BC096" : "var(--text-soft)",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 1px 2px rgba(45,42,58,0.04)",
            }}
          >
            {saved ? "✓ Opgeslagen" : "Alleen opslaan"}
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.04em" }}>
            🔒 Alleen jij ziet dit · niets gedeeld
          </span>
        </div>
      </div>
    </motion.div>
  );
}