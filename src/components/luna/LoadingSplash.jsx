import { useEffect, useState } from "react";
import LunaMoon from "./LunaMoon";

const PHASES = [
  "Beveiligde sessie starten...",
  "Jouw ruimte klaarmaken...",
  "LUNA wordt wakker...",
];

export default function LoadingSplash({ onDone }) {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cycle through phase texts
    const phaseInterval = setInterval(() => {
      setPhase((p) => (p + 1) % PHASES.length);
    }, 900);

    // Animate progress bar 0 → 100 over ~2.4s
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
  }, []);

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-6"
      style={{
        background: "radial-gradient(ellipse at 80% -10%, rgba(180,120,20,0.12), transparent 50%), radial-gradient(ellipse at 50% -5%, rgba(79,70,229,0.10), transparent 45%), #080d1e",
      }}
    >
      <LunaMoon size={84} state="idle" float />

      <div className="flex flex-col items-center gap-2">
        <h1
          className="text-3xl tracking-tight"
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontStyle: "italic",
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "-0.02em",
          }}
        >
          LUNA
        </h1>
        <p
          className="text-[13px]"
          style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}
        >
          Jouw ruimte. Altijd hier.
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-48 flex flex-col items-center gap-2">
        <div
          className="w-full h-[3px] rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #6366f1, #818cf8)",
              boxShadow: "0 0 8px rgba(99,102,241,0.6)",
            }}
          />
        </div>
        <p
          className="text-[11px] text-center transition-opacity duration-300"
          style={{ color: "rgba(255,255,255,0.30)", fontFamily: "'DM Sans', sans-serif" }}
        >
          {PHASES[phase]}
        </p>
      </div>
    </div>
  );
}