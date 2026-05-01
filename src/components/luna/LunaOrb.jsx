import { motion } from "framer-motion";

const stateConfigs = {
  idle: { scale: [1, 1.03, 1], duration: 4, glow: 0.35 },
  listening: { scale: [1, 1.05, 1], duration: 3, glow: 0.5 },
  thinking: { scale: [1, 1.02, 1], duration: 1.5, glow: 0.4 },
  speaking: { scale: [1, 1.04, 1], duration: 0.4, glow: 0.55 },
  soft: { scale: [1, 1.01, 1], duration: 6, glow: 0.2 },
};

export default function LunaOrb({ size = 160, state = "idle", className = "" }) {
  const config = stateConfigs[state] || stateConfigs.idle;
  const isSoft = state === "soft";

  return (
    <motion.div
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
      animate={{ scale: config.scale }}
      transition={{
        duration: config.duration,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
      }}
    >
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: isSoft
            ? "radial-gradient(circle, rgba(168,174,203,0.3) 0%, transparent 70%)"
            : `radial-gradient(circle, rgba(123,92,255,${config.glow}) 0%, transparent 70%)`,
          filter: "blur(20px)",
          transform: "scale(1.5)",
        }}
      />
      {/* Main orb */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: isSoft
            ? "radial-gradient(circle at 35% 35%, #8B7FCF 0%, #6B6BA0 40%, #4A4A70 100%)"
            : "radial-gradient(circle at 35% 35%, #7B5CFF 0%, #9F6FFF 30%, #FF7E5F 80%, #FF9F7F 100%)",
          boxShadow: `0 0 ${size * 0.4}px rgba(123,92,255,${config.glow})`,
          filter: "blur(1px)",
        }}
      />
      {/* Inner highlight */}
      <div
        className="absolute rounded-full"
        style={{
          top: "15%",
          left: "20%",
          width: "40%",
          height: "40%",
          background: isSoft
            ? "radial-gradient(circle, rgba(200,200,230,0.3) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />
    </motion.div>
  );
}