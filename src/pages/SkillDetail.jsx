import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { SKILL_MODULES } from "@/lib/dbt-skills";
import { motion, AnimatePresence } from "framer-motion";

export default function SkillDetail() {
  const { key } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [rating, setRating] = useState(null);
  const [saving, setSaving] = useState(false);

  const skill = SKILL_MODULES.flatMap((m) => m.skills).find((s) => s.key === key);
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });

  if (!skill) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center">
        <AlertCircle size={32} style={{ color: "var(--text-faint)", marginBottom: 16 }} strokeWidth={1.5} />
        <h1 className="font-display text-2xl text-white mb-2">Skill niet gevonden.</h1>
        <button onClick={() => navigate("/skills")} className="btn btn-ghost mt-4">Terug naar overzicht</button>
      </div>
    );
  }

  const steps = skill.steps || [{ instruction: "Geen stappen gedefinieerd.", title: skill.title }];
  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else setStep("rating");
  };

  const handleSave = async () => {
    if (!rating || saving || !user) return;
    setSaving(true);
    try {
      await base44.entities.SkillUse.create({ skillKey: skill.key, effective: rating });
      navigate("/skills");
    } catch {}
    setSaving(false);
  };

  if (step === "rating") {
    return (
      <div className="fade-in px-5 flex flex-col items-center justify-center min-h-dvh" style={{ background: "var(--bg)" }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-sm w-full">
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(107,173,138,0.15)", border: "1px solid rgba(107,173,138,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <Check size={28} style={{ color: "#6BAD8A" }} strokeWidth={2.5} />
          </div>
          <h2 className="font-display" style={{ fontSize: 32, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 12 }}>
            Klaar.
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 32, lineHeight: 1.5 }}>
            Hoe helpend was {skill.title} voor jou, net nu?
          </p>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 40 }}>
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                onClick={() => setRating(val)}
                className="press"
                style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: rating === val ? "#E8834A" : "rgba(255,255,255,0.04)",
                  border: rating === val ? "1px solid #E8834A" : "1px solid rgba(255,255,255,0.1)",
                  color: rating === val ? "#1A0E08" : "var(--text-muted)",
                  fontSize: 20, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s", boxShadow: rating === val ? "0 8px 24px rgba(232,131,74,0.3)" : "none",
                }}
              >
                {val}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => navigate("/skills")} className="btn btn-ghost press" style={{ flex: 1, height: 50 }}>Overslaan</button>
            <button onClick={handleSave} disabled={!rating || saving} className="btn btn-primary press" style={{ flex: 2, height: 50 }}>
              {saving ? "Opslaan…" : "Sla op en terug"}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh px-5" style={{ paddingTop: "calc(20px + env(safe-area-inset-top, 0px))" }}>
      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <button onClick={() => navigate(-1)} className="press" style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)", padding: "8px 0" }}>
          <ArrowLeft size={18} strokeWidth={1.5} />
          <span style={{ fontSize: 14 }}>Terug</span>
        </button>
        <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>
          Stap {step + 1} van {steps.length}
        </span>
      </header>

      {/* Progress bar */}
      <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, marginBottom: 40, overflow: "hidden" }}>
        <motion.div
          initial={{ width: `${(step / steps.length) * 100}%` }}
          animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
          style={{ height: "100%", background: "#E8834A", borderRadius: 2 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          {currentStep.title && (
            <p className="eyebrow" style={{ marginBottom: 12 }}>{currentStep.title}</p>
          )}
          <h2 className="font-display" style={{ fontSize: 32, color: "var(--text)", letterSpacing: "-0.01em", lineHeight: 1.2, marginBottom: 24 }}>
            {currentStep.instruction}
          </h2>
          {currentStep.detail && (
            <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.6 }}>{currentStep.detail}</p>
          )}
        </motion.div>
      </AnimatePresence>

      <div style={{ paddingBottom: "calc(32px + env(safe-area-inset-bottom, 0px))" }}>
        <button onClick={handleNext} className="btn btn-primary press" style={{ height: 56, fontSize: 16, width: "100%" }}>
          {step < steps.length - 1 ? "Volgende stap" : "Afronden"}
        </button>
      </div>
    </div>
  );
}