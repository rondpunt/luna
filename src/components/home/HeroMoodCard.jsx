import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Check } from "lucide-react";

const MOOD_LABELS = {
  1: "Erg zwaar", 2: "Zwaar", 3: "Moeilijk", 4: "Niet makkelijk",
  5: "Het gaat", 6: "Redelijk", 7: "Goed", 8: "Goed",
  9: "Heel goed", 10: "Uitstekend",
};

const MOOD_GRADIENTS = {
  1: ["#3A1818", "#C94040"], 2: ["#3A1818", "#C94040"],
  3: ["#3A2818", "#D4A86B"], 4: ["#3A2818", "#D4A86B"],
  5: ["#23201D", "#8A8278"], 6: ["#23201D", "#8A8278"],
  7: ["#1A2D24", "#6BAD8A"], 8: ["#1A2D24", "#6BAD8A"],
  9: ["#2D1A0E", "#E8834A"], 10: ["#2D1A0E", "#E8834A"],
};

const MOOD_ACCENT = {
  1: "#C94040", 2: "#C94040", 3: "#D4A86B", 4: "#D4A86B",
  5: "#8A8278", 6: "#8A8278", 7: "#6BAD8A", 8: "#6BAD8A",
  9: "#E8834A", 10: "#E8834A",
};

export default function HeroMoodCard({ mood, setMood, onSave, onSaveAndChat, saving, saved, checkedToday, onOpenChat }) {
  const [bgDark, bgLight] = MOOD_GRADIENTS[mood] || MOOD_GRADIENTS[5];
  const accent = MOOD_ACCENT[mood] || "#E8834A";
  const fillPct = ((mood - 1) / 9) * 100;

  if (checkedToday && !saved) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative",
          borderRadius: 32,
          overflow: "hidden",
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
        position: "relative",
        borderRadius: 32,
        overflow: "hidden",
        padding: "32px 28px 28px",
        background: `linear-gradient(160deg, ${bgDark} 0%, #0F0F1A 65%, #080810 100%)`,
        border: `1px solid ${accent}22`,
        transition: "background 0.6s ease, border-color 0.6s ease",
        boxShadow: `0 24px 60px ${accent}18, 0 0 0 1px rgba(255,255,255,0.02) inset`,
      }}
    >
      {/* Ambient glow */}
      <motion.div
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: -80, right: -60,
          width: 240, height: 240, borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}22, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <p className="eyebrow" style={{ marginBottom: 24, color: accent }}>HOE IS HET NU?</p>

        {/* Big mood number */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 8 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={mood}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 25 }}
              className="font-display"
              style={{
                fontSize: 96, lineHeight: 0.95, color: accent,
                letterSpacing: "-0.05em",
                filter: `drop-shadow(0 0 24px ${accent}55)`,
              }}
            >
              {mood}
            </motion.div>
          </AnimatePresence>
          <span style={{ fontSize: 24, color: "var(--text-faint)", lineHeight: 1, fontWeight: 300 }}>/ 10</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={mood}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            style={{ fontSize: 17, color: "var(--text)", fontWeight: 500, marginBottom: 24, letterSpacing: "-0.01em" }}
          >
            {MOOD_LABELS[mood]}
          </motion.p>
        </AnimatePresence>

        {/* Slider */}
        <div style={{ marginBottom: 28 }}>
          <input
            type="range" min={1} max={10} value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="mood-slider"
            style={{ background: `linear-gradient(to right, ${accent} ${fillPct}%, rgba(255,255,255,0.06) ${fillPct}%)` }}
            aria-label="Stemming"
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
            <span style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em" }}>zwaar</span>
            <span style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em" }}>licht</span>
          </div>
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