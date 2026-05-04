import { useEffect, useState } from "react";
import { Orb } from "./Orb";

const PHASES = [
  "Beveiligde sessie starten…",
  "Jouw ruimte klaarmaken…",
  "Luna is bijna klaar…",
];

export default function LoadingSplash({ onDone }) {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const phaseInterval = setInterval(() => {
      setPhase((p) => (p + 1) % PHASES.length);
    }, 900);

    let p = 0;
    const progressInterval = setInterval(() => {
      p += 2;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(progressInterval);
        clearInterval(phaseInterval);
        setTimeout(() => onDone?.(), 200);
      }
    }, 48);

    return () => {
      clearInterval(phaseInterval);
      clearInterval(progressInterval);
    };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-[100]"
      style={{ background: "#0B0B14" }}
    >
      {/* Ambient */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(232,131,74,0.10), transparent 70%)",
        }}
      />

      {/* Orb */}
      <div className="relative z-10 fade-in">
        <Orb size="lg" />
      </div>

      {/* Name */}
      <p
        className="font-display relative z-10 fade-up"
        style={{
          fontSize: 28,
          color: "var(--text)",
          letterSpacing: "-0.02em",
          marginTop: 40,
          animationDelay: "0.2s",
        }}
      >
        Luna
      </p>

      {/* Status */}
      <p
        className="relative z-10"
        style={{
          fontSize: 13,
          color: "var(--text-muted)",
          marginTop: 12,
          transition: "opacity 0.3s ease",
        }}
      >
        {PHASES[phase]}
      </p>

      {/* Progress bar */}
      <div
        className="relative z-10"
        style={{
          width: 160,
          height: 2,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 1,
          marginTop: 24,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "#E8834A",
            borderRadius: 1,
            transition: "width 0.05s linear",
          }}
        />
      </div>
    </div>
  );
}
