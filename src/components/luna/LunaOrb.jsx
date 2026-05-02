import { motion } from "framer-motion";

/**
 * LunaOrb — abstracte blob-orb met CSS morphing ademhaling.
 * Props: size (px), state ('idle' | 'thinking' | 'warm')
 */
export default function LunaOrb({ size = 48, state = "idle", className = "" }) {
  const glow =
    state === "thinking"
      ? "0 0 0 1px rgba(129,140,248,0.5), 0 0 32px rgba(99,102,241,0.5), 0 0 56px rgba(79,70,229,0.25)"
      : state === "warm"
      ? "0 0 0 1px rgba(251,191,36,0.5), 0 0 32px rgba(180,120,20,0.5), 0 0 56px rgba(245,158,11,0.25)"
      : "0 0 0 1px rgba(251,191,36,0.18), 0 0 20px rgba(180,120,20,0.20), 0 0 40px rgba(79,70,229,0.12)";

  return (
    <motion.div
      className={`relative flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: "52% 48% 66% 34% / 38% 64% 36% 62%",
        background:
          "radial-gradient(circle at 65% 38%, #fbbf24 0%, #d97706 18%, #7c3aed 52%, #2e1065 75%, #0a0520 100%)",
        boxShadow: glow,
      }}
      animate={{
        borderRadius: [
          "52% 48% 66% 34% / 38% 64% 36% 62%",
          "44% 56% 58% 42% / 52% 44% 56% 48%",
          "60% 40% 52% 48% / 36% 60% 40% 64%",
          "52% 48% 66% 34% / 38% 64% 36% 62%",
        ],
        scale: state === "thinking" ? [1, 1.06, 1] : [1, 1.03, 1],
        boxShadow: [glow, glow],
      }}
      transition={{
        borderRadius: { duration: 8, ease: "easeInOut", repeat: Infinity },
        scale: {
          duration: state === "thinking" ? 1.4 : 4,
          ease: "easeInOut",
          repeat: Infinity,
        },
      }}
    >
      {/* Highlight */}
      <div
        className="absolute rounded-full"
        style={{
          top: "15%",
          left: "20%",
          width: "38%",
          height: "38%",
          background: "radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 70%)",
          filter: "blur(4px)",
        }}
      />
    </motion.div>
  );
}