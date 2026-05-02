import { useEffect, useState } from "react";

/**
 * LunaMoon — the core visual identity of the app.
 * A premium celestial moon orb with atmospheric glow.
 * Props: size (px), state ('idle'|'thinking'|'spoke'), float (bool)
 */
export default function LunaMoon({ size = 48, state = "idle", float = false, className = "" }) {
  const [currentState, setCurrentState] = useState(state);

  useEffect(() => {
    if (state === "spoke") {
      setCurrentState("spoke");
      const t = setTimeout(() => setCurrentState("idle"), 700);
      return () => clearTimeout(t);
    } else {
      setCurrentState(state);
    }
  }, [state]);

  const animClass =
    currentState === "thinking"
      ? "luna-thinking"
      : currentState === "spoke"
      ? "luna-spoke"
      : float
      ? "luna-float luna-breathe"
      : "luna-breathe";

  return (
    <div
      className={`relative flex-shrink-0 rounded-full ${animClass} ${className}`}
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle at 65% 38%, #fbbf24 0%, #d97706 18%, #7c3aed 52%, #2e1065 75%, #0a0520 100%)",
        boxShadow:
          "0 0 0 1px rgba(251,191,36,0.18), 0 0 20px rgba(180,120,20,0.20), 0 0 40px rgba(79,70,229,0.12)",
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
    </div>
  );
}