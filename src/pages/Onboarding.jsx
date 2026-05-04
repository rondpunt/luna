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
  { key: "overwhelmed", icon: Wind,           label: "Als ik me overweldigd voel" },
  { key: "evening",     icon: Moon,           label: "'s Avonds reflecteren" },
  { key: "anytime",     icon: MessageCircle,  label: "Zomaar, als ik wil praten" },
];

const CONCERNS = [
  { key: "bpd",    icon: Brain, title: "Intense emoties",    sub: "Stemmingswisselingen, relatieproblemen, impulsiviteit" },
  { key: "adhd",   icon: Zap,   title: "ADHD",               sub: "Concentratie, prikkels, uitgesteld gedrag, hyperfocus" },
  { key: "both",   icon: Brain, title: "Beide",               sub: "Emotie-regulatie én aandacht spelen mee" },
  { key: "unsure", icon: HelpCircle, title: "Ik weet het niet", sub: "Luna past zich aan terwijl we praten" },
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
        // Save preferences
        await base44.entities.UserPreferences.create({
          userId: user.id,
          primary_moods: moods,
          preferred_moments: moments,
          onboardingCompleted: true,
        }).catch(() => {});
      }
    } catch {}
    // CRITICAL: use replace so back-button doesn't loop to onboarding
    navigate("/", { replace: true });
  };

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{
        background: "#0B0B14",
        paddingTop: "calc(32px + env(safe-area-inset-top, 0px))",
        paddingBottom: "calc(32px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      {/* Ambient */}
      <div className="fixed inset-0 -z-10" style={{ background: "#0B0B14" }}>
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(232,131,74,0.07), transparent 60%)",
          opacity: 0.6,
        }} />
      </div>

      {/* Header: back + progress pills */}
      <div className="flex items-center px-6 mb-2" style={{ height: 44 }}>
        {step > 0 ? (
          <button
            onClick={() => setStep(step - 1)}
            aria-label="Terug"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, marginLeft: -4, color: "var(--text-muted)" }}
          >
            <ArrowLeft size={22} strokeWidth={1.5} />
          </button>
        ) : <div style={{ width: 30 }} />}

        <div className="flex items-center gap-1.5 mx-auto">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ background: i <= step ? "#E8834A" : "rgba(255,255,255,0.10)" }}
              transition={{ duration: 0.3 }}
              style={{ width: 28, height: 3, borderRadius: 2 }}
            />
          ))}
        </div>

        <div style={{ width: 30 }} />
      </div>

      {/* Content — animated slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          className="flex-1 flex flex-col px-6"
        >
          {step === 0 && <StepWhy onNext={() => setStep(1)} />}
          {step === 1 && (
            <StepMoods selected={moods} onToggle={(k) => toggle(moods, setMoods, k)} onNext={() => setStep(2)} />
          )}
          {step === 2 && (
            <StepMoments selected={moments} onToggle={(k) => toggle(moments, setMoments, k)} onNext={() => setStep(3)} />
          )}
          {step === 3 && (
            <StepConcern selected={concern} onSelect={setConcern} onNext={() => setStep(4)} />
          )}
          {step === 4 && (
            <StepFinish saving={saving} onStart={finish} onLater={() => navigate("/", { replace: true })} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── Step 1 — Waarom Luna ── */
const FEATURES = [
  { icon: Clock,    title: "Altijd beschikbaar",   sub: "Geen afspraken, geen wachttijden" },
  { icon: Lock,     title: "Volledig privé",        sub: "Versleuteld. Alleen jij en Luna." },
  { icon: Sparkles, title: "Leert jou kennen",      sub: "Onthoudt wat voor jou belangrijk is" },
];

function StepWhy({ onNext }) {
  return (
    <div className="flex flex-col flex-1">
      <div style={{ paddingTop: 8, paddingBottom: 32 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>WAAROM LUNA</p>
        <h1 className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05, maxWidth: 320 }}>
          Een rustige plek, voor jou alleen.
        </h1>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {FEATURES.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="surface" style={{ padding: "18px 20px", display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: "rgba(232,131,74,0.08)", border: "1px solid rgba(232,131,74,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={16} style={{ color: "#E8834A" }} strokeWidth={1.5} />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>{title}</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ paddingTop: 32 }}>
        <button onClick={onNext} className="btn btn-primary press" style={{ fontSize: 15 }}>Klinkt goed</button>
      </div>
    </div>
  );
}

/* ── Step 2 — Moods ── */
function StepMoods({ selected, onToggle, onNext }) {
  return (
    <div className="flex flex-col flex-1">
      <div style={{ paddingTop: 8, paddingBottom: 8 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>EVEN AANKOMEN</p>
        <h1 className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>Hoe voel je je nu?</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8 }}>Tik wat past. Meerdere mag.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, flex: 1, paddingTop: 24, alignContent: "start" }}>
        {MOODS.map((m) => {
          const active = selected.includes(m);
          return (
            <button key={m} onClick={() => onToggle(m)} className="press"
              style={{ padding: "14px 12px", background: active ? "rgba(232,131,74,0.06)" : "var(--surface)", border: active ? "1.5px solid #E8834A" : "1px solid var(--border)", borderRadius: 14, fontSize: 14, fontWeight: 500, color: active ? "#F2EDE3" : "var(--text)", cursor: "pointer", textAlign: "center", transition: "all 0.15s ease" }}>
              {m}
            </button>
          );
        })}
      </div>
      <div style={{ paddingTop: 24 }}>
        <button onClick={onNext} disabled={selected.length === 0} className="btn btn-primary press" style={{ fontSize: 15 }}>Dit klopt</button>
      </div>
    </div>
  );
}

/* ── Step 3 — Moments ── */
function StepMoments({ selected, onToggle, onNext }) {
  return (
    <div className="flex flex-col flex-1">
      <div style={{ paddingTop: 8, paddingBottom: 24 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>JOUW RITME</p>
        <h1 className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>Wanneer wil je Luna gebruiken?</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8 }}>Geen verplichting. Ze is er als jij dat wil.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {MOMENTS.map(({ key, icon: Icon, label }) => {
          const active = selected.includes(key);
          return (
            <button key={key} onClick={() => onToggle(key)} className="press"
              style={{ height: 64, display: "flex", alignItems: "center", padding: "14px 18px", gap: 14, background: active ? "rgba(232,131,74,0.06)" : "var(--surface)", border: active ? "1.5px solid #E8834A" : "1px solid var(--border)", borderRadius: 16, cursor: "pointer", transition: "all 0.15s ease" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: "rgba(232,131,74,0.08)", border: "1px solid rgba(232,131,74,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={15} style={{ color: "#E8834A" }} strokeWidth={1.5} />
              </div>
              <span style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>{label}</span>
            </button>
          );
        })}
      </div>
      <div style={{ paddingTop: 24 }}>
        <button onClick={onNext} className="btn btn-primary press" style={{ fontSize: 15 }}>Zo doe ik het</button>
      </div>
    </div>
  );
}

/* ── Step 4 — Primary Concern (NEW) ── */
function StepConcern({ selected, onSelect, onNext }) {
  return (
    <div className="flex flex-col flex-1">
      <div style={{ paddingTop: 8, paddingBottom: 24 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>WAT SPEELT ER</p>
        <h1 className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>Wat herken jij het meest?</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8 }}>Luna past haar aanpak aan. Eerlijk antwoord helpt meer.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {CONCERNS.map(({ key, icon: Icon, title, sub }) => {
          const active = selected === key;
          return (
            <button key={key} onClick={() => onSelect(key)} className="press"
              style={{ display: "flex", alignItems: "center", padding: "18px 20px", gap: 14, background: active ? "rgba(232,131,74,0.06)" : "var(--surface)", border: active ? "1.5px solid #E8834A" : "1px solid var(--border)", borderRadius: 16, cursor: "pointer", transition: "all 0.15s ease", textAlign: "left" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, background: active ? "rgba(232,131,74,0.12)" : "rgba(255,255,255,0.04)", border: active ? "1px solid rgba(232,131,74,0.30)" : "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={18} style={{ color: active ? "#E8834A" : "var(--text-muted)" }} strokeWidth={1.5} />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>{title}</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{sub}</p>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ paddingTop: 24 }}>
        <button onClick={onNext} disabled={!selected} className="btn btn-primary press" style={{ fontSize: 15 }}>Verder</button>
      </div>
    </div>
  );
}

/* ── Step 5 — Finish ── */
function StepFinish({ saving, onStart, onLater }) {
  return (
    <div className="flex flex-col flex-1 items-center" style={{ paddingTop: 48 }}>
      <Orb size="lg" />
      <h1 className="font-display text-center" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05, marginTop: 40 }}>
        Luna is er voor jou.
      </h1>
      <p style={{ fontSize: 16, color: "var(--text-muted)", textAlign: "center", marginTop: 12, lineHeight: 1.6, maxWidth: 280 }}>
        Vandaag, morgen, altijd. Geen oordeel. Alleen jij.
      </p>
      <div style={{ marginTop: "auto", width: "100%", paddingTop: 48 }}>
        <button onClick={onStart} disabled={saving} className="btn btn-primary press" style={{ fontSize: 15, marginBottom: 16 }}>
          {saving ? "Even geduld…" : "Start gesprek"}
        </button>
        <button onClick={onLater} className="btn btn-ghost" style={{ fontSize: 14, color: "var(--text-muted)" }}>
          Bekijk eerst de app
        </button>
      </div>
    </div>
  );
}
