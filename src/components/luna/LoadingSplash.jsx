import { useEffect, useState } from "react";

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
  }, []);

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-8"
      style={{ background: "var(--bg)" }}
    >
      {/* Orb */}
      <div
        className="orb-breathe rounded-full"
        style={{
          width: 72,
          height: 72,
          background: "radial-gradient(circle at 35% 35%, #ee9670 0%, #c25a32 55%, #7a2d14 100%)",
          boxShadow: "0 0 40px 12px rgba(194,90,50,0.28)",
        }}
      />

      <div className="flex flex-col items-center gap-1.5">
        <h1 className="text-[28px] font-bold" style={{ color: "var(--text)", letterSpacing: "-0.5px" }}>Luna</h1>
        <p className="text-[14px]" style={{ color: "var(--text-3)" }}>Jouw ruimte. Altijd hier.</p>
      </div>

      {/* Progress */}
      <div className="w-40 flex flex-col items-center gap-2.5">
        <div className="w-full h-[2px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{ width: `${progress}%`, background: "#C25A32" }}
          />
        </div>
        <p className="text-[11.5px] text-center" style={{ color: "var(--text-3)" }}>
          {PHASES[phase]}
        </p>
      </div>
    </div>
  );
}