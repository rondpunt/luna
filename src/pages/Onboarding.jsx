import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Lock, Sparkles, Sunrise, Wind, Moon, MessageCircle, Brain, Zap, HelpCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Orb } from "@/components/luna/Orb";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_STEPS = 5;

const MOODS = [
  "Zwaar","Moe","Gespannen","Onrustig","Verdoofd","Boos",
  "Verdrietig","Leeg","Bang","Eenzaam","Oké","Rustig",
  "Hoopvol","Wakker","Licht","Dankbaar",
];

const MOMENTS = [
  { key: "morning",     icon: Sunrise,       label: "'s Ochtends starten" },
  { key: "overwhelmed", icon: Wind,          label: "Als ik me overweldigd voel" },
  { key: "evening",     icon: Moon,          label: "'s Avonds reflecteren" },
  { key: "anytime",     icon: MessageCircle, label: "Zomaar, als ik wil praten" },
];

const CONCERNS = [
  { key: "bpd",    icon: Brain, title: "Intense emoties",    sub: "Stemmingswisselingen, impulsiviteit" },
  { key: "adhd",   icon: Zap,   title: "ADHD",               sub: "Concentratie, prikkels, hyperfocus" },
  { key: "both",   icon: Brain, title: "Beide",              sub: "Emotie-regulatie én aandacht" },
  { key: "unsure", icon: HelpCircle, title: "Ik weet het niet", sub: "Luna past zich aan" },
];

const toggle = (arr, setArr, key) =>
  setArr(arr.includes(key) ? arr.filter((x) => x !== key) : [...arr, key]);

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [moods, setMoods] = useState([]);
  const [moments, setMoments] = useState([]);
  const [concern, setConcern] = useState(null);
  const [saving, setSaving] = useState(false);

  const finish = async () => {
    setSaving(true);
    try {
      const user = await base44.auth.me();
      if (user) {
        await base44.entities.UserPreferences.create({
          userId: user.id,
          primary_moods: moods,
          preferred_moments: moments,
          concern: concern,
          onboardingCompleted: true,
        }).catch(() => {});
      }
    } catch {}
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-dvh flex flex-col px-5" style={{ background: "var(--bg)", paddingTop: "calc(28px + env(safe-area-inset-top, 0px))", paddingBottom: "calc(28px + env(safe-area-inset-bottom, 0px))" }}>
      {/* Ambient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% -20%, rgba(232,131,74,0.06), transparent 60%)" }} />
      </div>

      {/* Header */}
      <div className="flex items-center mb-6" style={{ height: 44 }}>
        {step > 0 ? (
          <button onClick={() => setStep(step - 1)} className="press" style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--text-muted)" }}>
            <ArrowLeft size={20} strokeWidth={1.5} />
          </button>
        ) : <div style={{ width: 28 }} />}
        
        <div className="flex items-center gap-1.5 mx-auto">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <motion.div key={i} animate={{ background: i <= step ? "#E8834A" : "rgba(255,255,255,0.08)" }} transition={{ duration: 0.3 }} style={{ width: 28, height: 4, borderRadius: 2 }} />
          ))}
        </div>
        <div style={{ width: 28 }} />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 flex flex-col"
        >
          {step === 0 && <StepWhy onNext={() => setStep(1)} />}
          {step === 1 && <StepMoods selected={moods} onToggle={(k) => toggle(moods, setMoods, k)} onNext={() => setStep(2)} />}
          {step === 2 && <StepMoments selected={moments} onToggle={(k) => toggle(moments, setMoments, k)} onNext={() => setStep(3)} />}
          {step === 3 && <StepConcern selected={concern} onSelect={setConcern} onNext={() => setStep(4)} />}
          {step === 4 && <StepFinish saving={saving} onStart={finish} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function StepWhy({ onNext }) {
  return (
    <div className="flex flex-col flex-1">
      <div style={{ paddingBottom: 32 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>WAAROM LUNA</p>
        <h1 className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
          Een rustige plek,<br/>voor jou alleen.
        </h1>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {[
          { icon: Clock, title: "Altijd beschikbaar", sub: "Geen afspraken, wachttijden" },
          { icon: Lock, title: "Volledig privé", sub: "Versleuteld. Jij en Luna." },
          { icon: Sparkles, title: "Leert jou kennen", sub: "Onthoudt wat belangrijk is" },
        ].map(({ icon: Icon, title, sub }) => (
          <div key={title} style={{ padding: "18px 20px", display: "flex", gap: 14, alignItems: "center", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 20 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, flexShrink: 0, background: "rgba(232,131,74,0.1)", border: "1px solid rgba(232,131,74,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={18} style={{ color: "#E8834A" }} strokeWidth={1.5} />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{title}</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onNext} className="btn btn-primary press" style={{ fontSize: 15, height: 52 }}>Klinkt goed</button>
    </div>
  );
}

function StepMoods({ selected, onToggle, onNext }) {
  return (
    <div className="flex flex-col flex-1">
      <div style={{ paddingBottom: 24 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>EVEN AANKOMEN</p>
        <h1 className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>Hoe voel je je nu?</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8 }}>Kies wat past. Meerdere mag.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, flex: 1, alignContent: "start" }}>
        {MOODS.map((m) => {
          const active = selected.includes(m);
          return (
            <button key={m} onClick={() => onToggle(m)} className="press" style={{ padding: "14px 8px", background: active ? "rgba(232,131,74,0.12)" : "rgba(255,255,255,0.03)", border: active ? "1px solid rgba(232,131,74,0.4)" : "1px solid rgba(255,255,255,0.06)", borderRadius: 16, fontSize: 13, fontWeight: 500, color: active ? "#E8834A" : "var(--text)", cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
              {m}
            </button>
          );
        })}
      </div>
      <button onClick={onNext} disabled={selected.length === 0} className="btn btn-primary press" style={{ fontSize: 15, height: 52 }}>Verder</button>
    </div>
  );
}

function StepMoments({ selected, onToggle, onNext }) {
  return (
    <div className="flex flex-col flex-1">
      <div style={{ paddingBottom: 24 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>JOUW RITME</p>
        <h1 className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>Wanneer gebruik je Luna?</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8 }}>Ze is er wanneer je haar nodig hebt.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {MOMENTS.map(({ key, icon: Icon, label }) => {
          const active = selected.includes(key);
          return (
            <button key={key} onClick={() => onToggle(key)} className="press" style={{ display: "flex", alignItems: "center", padding: "16px 18px", gap: 14, background: active ? "rgba(232,131,74,0.12)" : "rgba(255,255,255,0.03)", border: active ? "1px solid rgba(232,131,74,0.4)" : "1px solid rgba(255,255,255,0.06)", borderRadius: 18, cursor: "pointer", transition: "all 0.15s" }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: active ? "rgba(232,131,74,0.1)" : "rgba(255,255,255,0.05)", border: active ? "1px solid rgba(232,131,74,0.3)" : "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={16} style={{ color: active ? "#E8834A" : "var(--text-muted)" }} strokeWidth={1.5} />
              </div>
              <span style={{ fontSize: 15, fontWeight: 500, color: active ? "var(--text)" : "var(--text)" }}>{label}</span>
            </button>
          );
        })}
      </div>
      <button onClick={onNext} className="btn btn-primary press" style={{ fontSize: 15, height: 52 }}>Zo doe ik het</button>
    </div>
  );
}

function StepConcern({ selected, onSelect, onNext }) {
  return (
    <div className="flex flex-col flex-1">
      <div style={{ paddingBottom: 24 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>WAT SPEELT ER</p>
        <h1 className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>Wat herken jij het meest?</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8 }}>Eerlijkheid helpt Luna jou beter te helpen.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {CONCERNS.map(({ key, icon: Icon, title, sub }) => {
          const active = selected === key;
          return (
            <button key={key} onClick={() => onSelect(key)} className="press" style={{ display: "flex", alignItems: "center", padding: "18px 20px", gap: 14, background: active ? "rgba(232,131,74,0.12)" : "rgba(255,255,255,0.03)", border: active ? "1px solid rgba(232,131,74,0.4)" : "1px solid rgba(255,255,255,0.06)", borderRadius: 18, cursor: "pointer", transition: "all 0.15s", textAlign: "left" }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, flexShrink: 0, background: active ? "rgba(232,131,74,0.1)" : "rgba(255,255,255,0.05)", border: active ? "1px solid rgba(232,131,74,0.3)" : "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={18} style={{ color: active ? "#E8834A" : "var(--text-muted)" }} strokeWidth={1.5} />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{title}</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{sub}</p>
              </div>
            </button>
          );
        })}
      </div>
      <button onClick={onNext} disabled={!selected} className="btn btn-primary press" style={{ fontSize: 15, height: 52 }}>Afronden</button>
    </div>
  );
}

function StepFinish({ saving, onStart }) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <Orb size="lg" />
      <h1 className="font-display text-center" style={{ fontSize: 38, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05, marginTop: 40 }}>
        Luna is er.
      </h1>
      <p style={{ fontSize: 15, color: "var(--text-muted)", textAlign: "center", marginTop: 12, lineHeight: 1.6, maxWidth: 280, marginBottom: 48 }}>
        Vandaag, morgen, altijd. Geen oordeel. Alleen jij.
      </p>
      <button onClick={onStart} disabled={saving} className="btn btn-primary press" style={{ fontSize: 16, height: 56, width: "100%" }}>
        {saving ? "Geduld…" : "Ga naar Luna"}
      </button>
    </div>
  );
}