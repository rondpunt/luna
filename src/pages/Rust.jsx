import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Wind } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const BREATH_MS = 4000;
const PHASES = [
  { key: "in", label: "Inademen", sub: "4 tellen" },
  { key: "hold1", label: "Vasthouden", sub: "4 tellen" },
  { key: "out", label: "Uitademen", sub: "4 tellen" },
  { key: "hold2", label: "Vasthouden", sub: "4 tellen" },
];

const GROUND_STEPS = [
  { n: 5, sense: "dingen die je ziet", placeholder: "bv. lamp, deur, hand" },
  { n: 4, sense: "dingen die je voelt", placeholder: "bv. stoel, lucht op je huid" },
  { n: 3, sense: "geluiden die je hoort", placeholder: "bv. verkeer, stilte" },
  { n: 2, sense: "geuren die je ruikt", placeholder: "optioneel" },
  { n: 1, sense: "smaak of één diepe adem", placeholder: "optioneel" },
];

export default function Rust() {
  const reduceMotion = useReducedMotion();
  const [breathOn, setBreathOn] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [ground, setGround] = useState(() => Object.fromEntries(GROUND_STEPS.map((s) => [s.n, ""])));

  useEffect(() => {
    if (!breathOn) return;
    const id = setInterval(() => {
      setPhaseIdx((i) => (i + 1) % PHASES.length);
    }, BREATH_MS);
    return () => clearInterval(id);
  }, [breathOn]);

  const phase = PHASES[phaseIdx];
  const scale = reduceMotion ? 1 : phase.key === "in" ? 1.12 : phase.key === "out" ? 0.92 : 1;

  const setLine = useCallback((n, v) => {
    setGround((g) => ({ ...g, [n]: v }));
  }, []);

  return (
    <div className="fade-in px-6 pb-10" style={{ paddingTop: "calc(28px + env(safe-area-inset-top, 0px))" }}>
      <p className="eyebrow" style={{ marginBottom: 8 }}>GRONDING</p>
      <h1 className="font-display" style={{ fontSize: 34, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
        Even rust.
      </h1>
      <p style={{ fontSize: 15, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.55, maxWidth: 360 }}>
        Box breathing (4-4-4-4) en 5-4-3-2-1 — bewezen manieren om je zenuwstelsel te helpen kalmeren. Geen haast.
      </p>

      {/* Box breathing */}
      <div className="surface mt-8" style={{ padding: "24px 20px" }}>
        <div className="flex items-center gap-2 mb-4">
          <Wind className="h-5 w-5 shrink-0" style={{ color: "#E8834A" }} strokeWidth={1.75} />
          <p className="eyebrow-muted" style={{ marginBottom: 0 }}>ADEM — BOX 4-4-4-4</p>
        </div>
        <div className="flex flex-col items-center py-6">
          <motion.div
            animate={{ scale }}
            transition={{ duration: reduceMotion ? 0 : BREATH_MS / 1000, ease: "easeInOut" }}
            className="rounded-full flex items-center justify-center"
            style={{
              width: 132,
              height: 132,
              background: "radial-gradient(circle at 35% 30%, rgba(255,200,170,0.35), rgba(232,131,74,0.12) 45%, transparent 70%)",
              border: "1px solid rgba(232,131,74,0.35)",
              boxShadow: "0 0 40px rgba(232,131,74,0.15)",
            }}
          >
            <span className="font-display text-[22px]" style={{ color: "var(--text)" }}>
              {phase.label}
            </span>
          </motion.div>
          <p className="text-[13px] mt-4" style={{ color: "var(--text-3)" }}>
            {phase.sub}
          </p>
          <button
            type="button"
            onClick={() => {
              setBreathOn((o) => !o);
              setPhaseIdx(0);
            }}
            className="btn btn-primary mt-6 max-w-[240px]"
            style={{ height: 48, fontSize: 14 }}
          >
            {breathOn ? "Stop timer" : "Start adem-cyclus"}
          </button>
        </div>
      </div>

      {/* 5-4-3-2-1 */}
      <div className="surface mt-4" style={{ padding: "24px 20px" }}>
        <p className="eyebrow-muted" style={{ marginBottom: 16 }}>5-4-3-2-1 — ZINTUIGEN</p>
        <div className="flex flex-col gap-5">
          {GROUND_STEPS.map(({ n, sense, placeholder }) => (
            <div key={n}>
              <p className="text-[13px] font-semibold mb-1.5" style={{ color: "var(--text-2)" }}>
                {n} — {sense}
              </p>
              <textarea
                rows={n <= 2 ? 2 : 1}
                value={ground[n]}
                onChange={(e) => setLine(n, e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl px-3 py-2.5 text-[14px] resize-none outline-none"
                style={{
                  background: "var(--bg-input)",
                  border: "1px solid var(--line)",
                  color: "var(--text)",
                  minHeight: n <= 2 ? 56 : 40,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card mt-6 px-5 py-4 flex flex-col gap-3">
        <p className="text-[14px] leading-relaxed" style={{ color: "var(--text-2)" }}>
          Voel je je onveilig of denk je aan jezelf schaden? Je hoeft het niet alleen te doen.
        </p>
        <Link
          to="/chat"
          className="btn btn-ghost-accent text-[14px] h-11"
          style={{ borderRadius: "var(--r-pill)" }}
        >
          Praat met Luna
        </Link>
        <Link
          to="/profiel#luna-nood-profiel"
          className="text-[13px] text-center leading-relaxed"
          style={{ color: "var(--text-faint)" }}
        >
          Telefoonnummers en opties staan onder Profiel, bij «Ik voel me onveilig».
        </Link>
      </div>
    </div>
  );
}
