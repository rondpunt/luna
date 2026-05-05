import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getSkillByKey, LUNA_PLUS_SKILL_KEYS } from "@/lib/dbt-skills";
import { usePremium } from "@/hooks/usePremium";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Play, Square, ChevronRight, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Breathing visualizer for TIP paced breathing
function BreathVisualizer({ active }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "24px 0" }}>
      <motion.div
        animate={active ? {
          scale: [1, 1.6, 1.6, 1],
          opacity: [0.6, 1, 1, 0.6],
        } : { scale: 1, opacity: 0.4 }}
        transition={active ? {
          duration: 10,
          repeat: Infinity,
          times: [0, 0.4, 0.6, 1],
          ease: "easeInOut",
        } : {}}
        style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,131,74,0.5) 0%, rgba(232,131,74,0.15) 60%, transparent 100%)",
          border: "1px solid rgba(232,131,74,0.30)",
        }}
      />
      {active && (
        <motion.p
          key="breath-label"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 10, repeat: Infinity, times: [0, 0.5, 1] }}
          style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 16 }}
        >
          In 4 · Uit 6
        </motion.p>
      )}
    </div>
  );
}

// Timer component
function Timer({ seconds, onComplete, running }) {
  const [remaining, setRemaining] = useState(seconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) { clearInterval(intervalRef.current); onComplete?.(); return 0; }
          return r - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, seconds]);

  const pct = ((seconds - remaining) / seconds) * 100;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "20px 0" }}>
      {/* Progress ring */}
      <div style={{ position: "relative", width: 88, height: 88 }}>
        <svg width={88} height={88} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={44} cy={44} r={38} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
          <circle cx={44} cy={44} r={38} fill="none" stroke="#E8834A" strokeWidth={4}
            strokeDasharray={`${2 * Math.PI * 38}`}
            strokeDashoffset={`${2 * Math.PI * 38 * (1 - pct / 100)}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span className="font-display" style={{ fontSize: 22, color: "#E8834A" }}>
            {mins > 0 ? `${mins}:${String(secs).padStart(2, "0")}` : secs}
          </span>
        </div>
      </div>
    </div>
  );
}

// Effectiveness rating
function EffectivenessRating({ onRate }) {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ padding: "24px 0" }}>
      <p style={{ fontSize: 15, color: "var(--text)", marginBottom: 16, textAlign: "center" }}>Hoe effectief was dit?</p>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => { setSelected(n); onRate(n); }}
            style={{ width: 44, height: 44, borderRadius: "50%", border: selected === n ? "1.5px solid #E8834A" : "1px solid rgba(255,255,255,0.12)", background: selected === n ? "rgba(232,131,74,0.12)" : "var(--surface)", cursor: "pointer", fontSize: 16, fontWeight: 600, color: selected === n ? "#E8834A" : "var(--text-muted)", transition: "all 0.15s" }}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SkillDetail() {
  const { key } = useParams();
  const navigate = useNavigate();
  const { isPlus } = usePremium();
  const result = getSkillByKey(key);

  const [currentStep, setCurrentStep] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [done, setDone] = useState(false);

  if (!result) return (
    <div className="fade-in px-6" style={{ paddingTop: 64 }}>
      <p style={{ color: "var(--text-muted)" }}>Skill niet gevonden.</p>
    </div>
  );

  if (LUNA_PLUS_SKILL_KEYS.includes(key) && !isPlus) {
    return (
      <div className="fade-in px-6 flex flex-col items-center" style={{ paddingTop: "calc(48px + env(safe-area-inset-top, 0px))", minHeight: "70vh" }}>
        <Lock size={28} style={{ color: "#E8834A", marginBottom: 16 }} strokeWidth={1.5} />
        <h1 className="font-display text-center" style={{ fontSize: 28, color: "var(--text)", marginBottom: 12 }}>DEAR MAN — Luna Plus</h1>
        <p style={{ fontSize: 15, color: "var(--text-muted)", textAlign: "center", maxWidth: 320, lineHeight: 1.55, marginBottom: 24 }}>
          Deze geavanceerde interpersoonlijke module is onderdeel van Luna Plus — effectief communiceren zonder jezelf kwijt te raken.
        </p>
        <Link to="/pricing" className="btn btn-primary press mb-3" style={{ fontSize: 15 }}>Upgrade</Link>
        <button type="button" className="btn btn-ghost" style={{ fontSize: 14 }} onClick={() => navigate("/skills")}>Terug</button>
      </div>
    );
  }

  const { skill, module } = result;
  const steps = skill.steps || [];
  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const hasTimer = step?.timer && step?.duration;
  const isBreathing = step?.visualizer === "breath";

  const handleTimerComplete = () => { setTimerRunning(false); setTimerDone(true); };

  const nextStep = () => {
    if (isLast) { setShowRating(true); }
    else { setCurrentStep(c => c + 1); setTimerRunning(false); setTimerDone(false); }
  };

  const logSkill = async (effectiveness) => {
    try {
      await base44.entities.SkillUse.create({
        skillKey: skill.key,
        effective: effectiveness,
      });
    } catch {}
    setDone(true);
  };

  if (done) {
    return (
      <div className="fade-in px-6 flex flex-col items-center justify-center" style={{ paddingTop: 120, minHeight: "60vh" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(107,173,138,0.12)", border: "1px solid rgba(107,173,138,0.30)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <span style={{ fontSize: 28 }}>✓</span>
        </div>
        <h2 className="font-display" style={{ fontSize: 28, color: "var(--text)", textAlign: "center", marginBottom: 12 }}>Gedaan.</h2>
        <p style={{ fontSize: 15, color: "var(--text-muted)", textAlign: "center", marginBottom: 32 }}>Gelogd. Goed dat je het geprobeerd hebt.</p>
        <button onClick={() => navigate("/skills")} className="btn btn-primary press" style={{ fontSize: 15 }}>Terug naar skills</button>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ paddingTop: "calc(32px + env(safe-area-inset-top, 0px))", paddingBottom: 40 }}>
      {/* Header */}
      <div className="px-6" style={{ marginBottom: 32 }}>
        <button onClick={() => navigate("/skills")} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 0", marginBottom: 16, display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)" }}>
          <ArrowLeft size={18} strokeWidth={1.5} />
          <span style={{ fontSize: 14 }}>Skills</span>
        </button>
        <p className="eyebrow" style={{ marginBottom: 8 }}>{module.title.toUpperCase()}</p>
        <h1 className="font-display" style={{ fontSize: 32, color: "var(--text)", letterSpacing: "-0.01em", lineHeight: 1.1 }}>
          {skill.title}
        </h1>
      </div>

      {/* Progress */}
      {steps.length > 1 && !showRating && (
        <div className="px-6" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {steps.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= currentStep ? "#E8834A" : "rgba(255,255,255,0.08)", transition: "background 0.3s" }} />
            ))}
          </div>
          <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 8 }}>Stap {currentStep + 1} van {steps.length}</p>
        </div>
      )}

      {/* Step content */}
      {!showRating && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="px-6"
          >
            {step?.title && (
              <h2 className="font-display" style={{ fontSize: 26, color: "var(--text)", marginBottom: 16 }}>
                {step.title}
              </h2>
            )}

            {/* Instruction */}
            <div className="surface" style={{ padding: "20px", marginBottom: 16, borderRadius: 18 }}>
              <p style={{ fontSize: 16, color: "var(--text)", lineHeight: 1.6 }}>{step?.instruction}</p>
            </div>

            {/* Why */}
            {step?.why && (
              <div style={{ padding: "14px 18px", background: "rgba(232,131,74,0.04)", border: "1px solid rgba(232,131,74,0.12)", borderRadius: 14, marginBottom: 20 }}>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                  <span style={{ color: "#E8834A", fontWeight: 500 }}>Waarom: </span>{step.why}
                </p>
              </div>
            )}

            {/* Timer or breathing visualizer */}
            {isBreathing && (
              <BreathVisualizer active={timerRunning} />
            )}
            {hasTimer && !isBreathing && (
              <Timer seconds={step.duration} running={timerRunning} onComplete={handleTimerComplete} />
            )}

            {/* Timer controls */}
            {hasTimer && !timerDone && (
              <button
                onClick={() => setTimerRunning(r => !r)}
                className="btn press"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", marginBottom: 12, background: timerRunning ? "rgba(209,77,77,0.08)" : "rgba(232,131,74,0.10)", border: timerRunning ? "1px solid rgba(209,77,77,0.25)" : "1px solid rgba(232,131,74,0.25)", color: timerRunning ? "#D14D4D" : "#E8834A", fontSize: 15, fontWeight: 500 }}
              >
                {timerRunning ? <><Square size={16} strokeWidth={2} /> Stop</> : <><Play size={16} strokeWidth={2} /> Start timer</>}
              </button>
            )}

            {/* Next button */}
            {(!hasTimer || timerDone) && (
              <button onClick={nextStep} className="btn btn-primary press" style={{ fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                {isLast ? "Klaar" : <><span>Volgende stap</span><ChevronRight size={16} strokeWidth={2} /></>}
              </button>
            )}
            {hasTimer && !timerDone && timerRunning && (
              <p style={{ fontSize: 13, color: "var(--text-faint)", textAlign: "center", marginTop: 12 }}>Timer loopt… je kunt ook overslaan.</p>
            )}
            {hasTimer && !timerDone && !timerRunning && (
              <button onClick={nextStep} style={{ background: "none", border: "none", cursor: "pointer", width: "100%", padding: "12px 0", fontSize: 13, color: "var(--text-faint)" }}>
                Overslaan
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Effectiveness rating */}
      {showRating && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6"
        >
          <div className="surface" style={{ padding: 24 }}>
            <EffectivenessRating onRate={logSkill} />
          </div>
        </motion.div>
      )}
    </div>
  );
}
