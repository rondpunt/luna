import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Lock,
  Sparkles,
  Sunrise,
  Wind,
  Moon,
  MessageCircle,
  Brain,
  Zap,
  HelpCircle,
  Bell,
  Shield,
  Gem,
  Flower2,
  Boxes,
  Palette,
  Activity,
  MinusCircle,
  LayoutTemplate,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { Orb } from "@/components/luna/Orb";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboardingStep } from "@/hooks/useOnboardingStep";
import { profileToAiResponseStyle, DEFAULT_ONBOARDING_PROFILE } from "@/lib/lunaComfortPreferences";
import { USER_PREFERENCES_QUERY_KEY } from "@/hooks/useChatSettings";

const TOTAL_STEPS = 11;

const GOAL_CHIPS = [
  "Emotieregulatie",
  "Slapen of ritme",
  "Relaties en grenzen",
  "Werk of school",
  "Identiteit en zelfbeeld",
  "Minder schaamte",
  "Meer overzicht in mijn hoofd",
  "Gewoon even praten",
];

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
  { key: "bpd", icon: Brain, title: "Intense emoties", sub: "Snel op en neer, schaamte, relaties die wringen — geen diagnose, enkel wat jij voelt." },
  { key: "adhd", icon: Zap, title: "ADHD of aandacht", sub: "Concentratie, prikkels, uitstel — wat herken jij?" },
  { key: "autism", icon: Flower2, title: "Autisme", sub: "Structuur, prikkels, energie — in jouw tempo." },
  { key: "combination", icon: Boxes, title: "Meerdere dingen tegelijk", sub: "Een mix die bij jou hoort." },
  { key: "unsure", icon: HelpCircle, title: "Ik weet het nog niet", sub: "Luna past zich rustig aan terwijl we praten." },
];

const NOTIFICATION_PREFS = [
  { key: "none", label: "Geen herinnering", time: "none" },
  { key: "morning", label: "Zacht rond 9u", time: "09:00" },
  { key: "evening", label: "Zacht rond 21u", time: "21:00" },
];

const toggle = (arr, setArr, key) =>
  setArr(arr.includes(key) ? arr.filter((x) => x !== key) : [...arr, key]);

async function persistPreferences(payload) {
  const user = await base44.auth.me();
  if (!user) return;
  const existing = await base44.entities.UserPreferences.filter({ userId: user.id }).catch(() => []);
  const row = existing?.[0];
  if (row?.id) {
    await base44.entities.UserPreferences.update(row.id, payload).catch(() => {});
  } else {
    await base44.entities.UserPreferences.create({ userId: user.id, ...payload }).catch(() => {});
  }
}

export default function Onboarding() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { step, next, back, goTo } = useOnboardingStep(TOTAL_STEPS);
  const [moods, setMoods] = useState([]);
  const [moments, setMoments] = useState([]);
  const [goals, setGoals] = useState([]);
  const [concern, setConcern] = useState(null);
  const [reduceAnimations, setReduceAnimations] = useState(false);
  const [calmPalette, setCalmPalette] = useState(false);
  const [fewerCelebrations, setFewerCelebrations] = useState(false);
  const [plainMode, setPlainMode] = useState(false);
  const [replyShape, setReplyShape] = useState("short");
  const [communicationDirectness, setCommunicationDirectness] = useState("softer");
  const [notif, setNotif] = useState("none");
  const [privacyOk, setPrivacyOk] = useState(false);
  const [saving, setSaving] = useState(false);

  const finish = async () => {
    setSaving(true);
    const notifRow = NOTIFICATION_PREFS.find((n) => n.key === notif);
    const profileObj = {
      ...DEFAULT_ONBOARDING_PROFILE,
      reduceAnimations,
      calmPalette,
      fewerCelebrations,
      plainMode,
      communicationDirectness: /** @type {"softer"|"direct"} */ (communicationDirectness === "direct" ? "direct" : "softer"),
      replyShape: /** @type {"short"|"structured"} */ (replyShape === "structured" ? "structured" : "short"),
    };
    try {
      await persistPreferences({
        primary_moods: moods,
        preferred_moments: moments,
        goals,
        concern: concern || "unsure",
        onboarding_profile: JSON.stringify(profileObj),
        aiResponseStyle: profileToAiResponseStyle(profileObj),
        calmUi: calmPalette,
        reduceMotionUi: reduceAnimations,
        notificationTime: notifRow?.time || "none",
        crisisDisclaimerAccepted: privacyOk,
        onboardingCompleted: true,
      });
      qc.invalidateQueries({ queryKey: USER_PREFERENCES_QUERY_KEY });
      qc.invalidateQueries({ queryKey: ["userprefs-home-reminder"] });
    } catch {}
    setSaving(false);
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
      <div className="fixed inset-0 -z-10" style={{ background: "#0B0B14" }}>
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(232,131,74,0.07), transparent 60%)",
          opacity: 0.6,
        }} />
      </div>

      <div className="flex items-center px-6 mb-2" style={{ height: 44 }}>
        {step > 0 ? (
          <button
            type="button"
            onClick={() => back()}
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
              style={{ width: 22, height: 3, borderRadius: 2 }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(TOTAL_STEPS - 1)}
          className="text-xs"
          style={{ width: 52, textAlign: "right", background: "none", border: "none", color: "var(--text-faint)", cursor: "pointer" }}
        >
          overslaan
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          className="flex-1 flex flex-col px-6"
        >
          {step === 0 && <StepWhy onNext={() => next()} />}
          {step === 1 && (
            <StepConcern selected={concern} onSelect={setConcern} onNext={() => next()} />
          )}
          {step === 2 && (
            <StepSensory
              reduceAnimations={reduceAnimations}
              calmPalette={calmPalette}
              fewerCelebrations={fewerCelebrations}
              plainMode={plainMode}
              onReduceAnimations={setReduceAnimations}
              onCalmPalette={setCalmPalette}
              onFewerCelebrations={setFewerCelebrations}
              onPlainMode={setPlainMode}
              onNext={() => next()}
            />
          )}
          {step === 3 && (
            <StepCommunication
              replyShape={replyShape}
              communicationDirectness={communicationDirectness}
              onReplyShape={setReplyShape}
              onDirectness={setCommunicationDirectness}
              onNext={() => next()}
            />
          )}
          {step === 4 && (
            <StepGoals selected={goals} onToggle={(k) => toggle(goals, setGoals, k)} onNext={() => next()} />
          )}
          {step === 5 && (
            <StepMoods selected={moods} onToggle={(k) => toggle(moods, setMoods, k)} onNext={() => next()} />
          )}
          {step === 6 && (
            <StepMoments selected={moments} onToggle={(k) => toggle(moments, setMoments, k)} onNext={() => next()} />
          )}
          {step === 7 && (
            <StepNotifications value={notif} onChange={setNotif} onNext={() => next()} />
          )}
          {step === 8 && (
            <StepPrivacy checked={privacyOk} onChange={setPrivacyOk} onNext={() => next()} />
          )}
          {step === 9 && (
            <StepPremium onSkip={() => next()} onExplore={() => navigate("/pricing")} />
          )}
          {step === 10 && (
            <StepFinish saving={saving} onStart={finish} onLater={() => navigate("/", { replace: true })} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

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
        <button type="button" onClick={onNext} className="btn btn-primary press haptic-press" style={{ fontSize: 15 }}>Klinkt goed</button>
      </div>
    </div>
  );
}

function StepGoals({ selected, onToggle, onNext }) {
  return (
    <div className="flex flex-col flex-1">
      <div style={{ paddingTop: 8, paddingBottom: 16 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>WAT BRENGT JE HIER</p>
        <h1 className="font-display" style={{ fontSize: 34, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
          Waar wil je ruimte voor?
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8 }}>Meerdere antwoorden mag. Geen verkeerde keuze.</p>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, flex: 1, alignContent: "flex-start" }}>
        {GOAL_CHIPS.map((g) => {
          const active = selected.includes(g);
          return (
            <button
              key={g}
              type="button"
              onClick={() => onToggle(g)}
              className="press haptic-press"
              style={{
                padding: "10px 14px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 500,
                background: active ? "rgba(232,131,74,0.10)" : "var(--surface)",
                border: active ? "1.5px solid #E8834A" : "1px solid var(--border)",
                color: active ? "#F2EDE3" : "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              {g}
            </button>
          );
        })}
      </div>
      <div style={{ paddingTop: 24 }}>
        <button type="button" onClick={onNext} disabled={selected.length === 0} className="btn btn-primary press haptic-press" style={{ fontSize: 15 }}>Zo wil ik starten</button>
      </div>
    </div>
  );
}

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
            <button key={m} type="button" onClick={() => onToggle(m)} className="press haptic-press"
              style={{ padding: "14px 12px", background: active ? "rgba(232,131,74,0.06)" : "var(--surface)", border: active ? "1.5px solid #E8834A" : "1px solid var(--border)", borderRadius: 14, fontSize: 14, fontWeight: 500, color: active ? "#F2EDE3" : "var(--text)", cursor: "pointer", textAlign: "center", transition: "all 0.15s ease" }}>
              {m}
            </button>
          );
        })}
      </div>
      <div style={{ paddingTop: 24 }}>
        <button type="button" onClick={onNext} disabled={selected.length === 0} className="btn btn-primary press haptic-press" style={{ fontSize: 15 }}>Dit klopt</button>
      </div>
    </div>
  );
}

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
            <button key={key} type="button" onClick={() => onToggle(key)} className="press haptic-press"
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
        <button type="button" onClick={onNext} className="btn btn-primary press haptic-press" style={{ fontSize: 15 }}>Zo doe ik het</button>
      </div>
    </div>
  );
}

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
            <button key={key} type="button" onClick={() => onSelect(key)} className="press haptic-press"
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
        <button type="button" onClick={onNext} disabled={!selected} className="btn btn-primary press haptic-press" style={{ fontSize: 15 }}>Verder</button>
      </div>
    </div>
  );
}

function StepSensory({
  reduceAnimations,
  calmPalette,
  fewerCelebrations,
  plainMode,
  onReduceAnimations,
  onCalmPalette,
  onFewerCelebrations,
  onPlainMode,
  onNext,
}) {
  return (
    <div className="flex flex-col flex-1">
      <div style={{ paddingTop: 8, paddingBottom: 16 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>ZINTUIGEN</p>
        <h1 className="font-display" style={{ fontSize: 34, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
          Wat voelt voor jou rustiger?
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.5 }}>
          Alles optioneel. Geen medische claims — alleen wat jij prettig vindt op scherm.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <ToggleRow
          icon={Activity}
          checked={reduceAnimations}
          onChange={onReduceAnimations}
          title="Minder beweging"
          sub="Minder schuiven en pulseren. We volgen ook je systeeminstelling als die dat vraagt."
        />
        <ToggleRow
          icon={Palette}
          checked={calmPalette}
          onChange={onCalmPalette}
          title="Zachtere kleuren"
          sub="Iets minder fel oranje — rustiger voor de ogen."
        />
        <ToggleRow
          icon={MinusCircle}
          checked={fewerCelebrations}
          onChange={onFewerCelebrations}
          title="Minder ‘feest’ in de app"
          sub="Minder feestelijke micro-feedback — gewoon kalm."
        />
        <ToggleRow
          icon={LayoutTemplate}
          checked={plainMode}
          onChange={onPlainMode}
          title="Plain mode"
          sub="Extra sober: minder gloed rond de orb en minder ‘glans’."
        />
      </div>

      <div style={{ paddingTop: 24 }}>
        <button type="button" onClick={onNext} className="btn btn-primary press haptic-press" style={{ fontSize: 15 }}>
          Dit klopt voor mij
        </button>
      </div>
    </div>
  );
}

function ToggleRow({ icon: Icon, checked, onChange, title, sub }) {
  return (
    <label
      className="surface flex gap-3 items-start cursor-pointer press"
      style={{ padding: "14px 16px", borderRadius: 14, border: "1px solid var(--border)" }}
    >
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ marginTop: 4 }} />
      <div>
        <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon size={16} style={{ color: "#E8834A" }} strokeWidth={1.5} /> {title}
        </p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.45 }}>{sub}</p>
      </div>
    </label>
  );
}

function StepCommunication({ replyShape, communicationDirectness, onReplyShape, onDirectness, onNext }) {
  const shapes = [
    { key: "short", label: "Korter", sub: "Luna houdt het compact." },
    { key: "structured", label: "Meer structuur", sub: "Iets meer houvast: korte blokken, soms een stap." },
  ];
  const tones = [
    { key: "softer", label: "Zachter", sub: "Extra warm, minder scherp geformuleerd." },
    { key: "direct", label: "Directer", sub: "Recht op het doel — nog steeds vriendelijk." },
  ];
  return (
    <div className="flex flex-col flex-1">
      <div style={{ paddingTop: 8, paddingBottom: 16 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>TAAL</p>
        <h1 className="font-display" style={{ fontSize: 34, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
          Hoe mag Luna praten?
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.5 }}>
          Je kiest wat nu past; later kun je dit aanpassen.
        </p>
      </div>

      <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: 10 }}>
        LENGTE & OPBOUW
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {shapes.map(({ key, label, sub }) => {
          const active = replyShape === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onReplyShape(key)}
              className="press haptic-press"
              style={{
                textAlign: "left",
                padding: "14px 16px",
                borderRadius: 14,
                border: active ? "1.5px solid #E8834A" : "1px solid var(--border)",
                background: active ? "rgba(232,131,74,0.06)" : "var(--surface)",
                cursor: "pointer",
              }}
            >
              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{label}</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{sub}</p>
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: 10 }}>
        TOON
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {tones.map(({ key, label, sub }) => {
          const active = communicationDirectness === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onDirectness(key)}
              className="press haptic-press"
              style={{
                textAlign: "left",
                padding: "14px 16px",
                borderRadius: 14,
                border: active ? "1.5px solid #E8834A" : "1px solid var(--border)",
                background: active ? "rgba(232,131,74,0.06)" : "var(--surface)",
                cursor: "pointer",
              }}
            >
              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{label}</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{sub}</p>
            </button>
          );
        })}
      </div>

      <div style={{ paddingTop: 24 }}>
        <button type="button" onClick={onNext} className="btn btn-primary press haptic-press" style={{ fontSize: 15 }}>
          Zo wil ik het horen
        </button>
      </div>
    </div>
  );
}

function StepNotifications({ value, onChange, onNext }) {
  return (
    <div className="flex flex-col flex-1">
      <div style={{ paddingTop: 8, paddingBottom: 24 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>HERINNERING</p>
        <h1 className="font-display" style={{ fontSize: 34, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>Een zachte nudge?</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8 }}>Lokaal op dit apparaat — geen push zonder jouw toestemming later in het OS.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {NOTIFICATION_PREFS.map(({ key, label }) => {
          const active = value === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className="press haptic-press surface"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "16px 18px",
                borderRadius: 16,
                border: active ? "1.5px solid #E8834A" : "1px solid var(--border)",
                background: active ? "rgba(232,131,74,0.06)" : "var(--surface)",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <Bell size={18} style={{ color: "#E8834A" }} strokeWidth={1.5} />
              <span style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>{label}</span>
            </button>
          );
        })}
      </div>
      <div style={{ paddingTop: 24 }}>
        <button type="button" onClick={onNext} className="btn btn-primary press haptic-press" style={{ fontSize: 15 }}>Bewaar voorkeur</button>
      </div>
    </div>
  );
}

function StepPrivacy({ checked, onChange, onNext }) {
  return (
    <div className="flex flex-col flex-1">
      <div style={{ paddingTop: 8, paddingBottom: 24 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>PRIVACY</p>
        <h1 className="font-display" style={{ fontSize: 34, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>Transparantie</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.55 }}>
          Luna is geen crisishulp en geen vervanging voor therapie. Je data hoort bij jou — zie ook ons privacybeleid.
        </p>
      </div>
      <label className="surface flex gap-3 items-start cursor-pointer press" style={{ padding: "18px 16px", borderRadius: 16, border: "1px solid var(--border)" }}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ marginTop: 4 }} />
        <div>
          <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", display: "flex", alignItems: "center", gap: 8 }}>
            <Shield size={16} style={{ color: "#E8834A" }} strokeWidth={1.5} /> Ik begrijp de grenzen
          </p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6, lineHeight: 1.5 }}>
            Geen medisch advies, geen noodlijn. Bij acute crisis: 106 / Zelfmoordlijn 0800 32 123.
          </p>
        </div>
      </label>
      <div style={{ marginTop: "auto", paddingTop: 32 }}>
        <button type="button" onClick={onNext} disabled={!checked} className="btn btn-primary press haptic-press" style={{ fontSize: 15 }}>Akkoord — verder</button>
      </div>
    </div>
  );
}

function StepPremium({ onSkip, onExplore }) {
  return (
    <div className="flex flex-col flex-1 items-center text-center" style={{ paddingTop: 24 }}>
      <Gem size={36} style={{ color: "#E8834A", marginBottom: 16 }} strokeWidth={1.25} />
      <h1 className="font-display" style={{ fontSize: 32, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
        Luna Plus (optioneel)
      </h1>
      <p style={{ fontSize: 15, color: "var(--text-muted)", marginTop: 12, lineHeight: 1.6, maxWidth: 320 }}>
        Onbeperkt praten, diepere inzichten, export, geheugenbeheer en exclusieve skills. €9,99/maand — altijd opzegbaar.
      </p>
      <div style={{ marginTop: "auto", width: "100%", paddingTop: 40, display: "flex", flexDirection: "column", gap: 12 }}>
        <button type="button" onClick={onExplore} className="btn btn-primary press haptic-press" style={{ fontSize: 15 }}>Bekijk Plus</button>
        <button type="button" onClick={onSkip} className="btn btn-ghost" style={{ fontSize: 14, color: "var(--text-muted)" }}>Niet nu — verder</button>
      </div>
    </div>
  );
}

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
        <button type="button" onClick={onStart} disabled={saving} className="btn btn-primary press haptic-press" style={{ fontSize: 15, marginBottom: 16 }}>
          {saving ? "Even geduld…" : "Start gesprek"}
        </button>
        <button type="button" onClick={onLater} className="btn btn-ghost" style={{ fontSize: 14, color: "var(--text-muted)" }}>
          Bekijk eerst de app
        </button>
      </div>
    </div>
  );
}
