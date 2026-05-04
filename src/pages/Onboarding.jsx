import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Lock, Sparkles, Sunrise, Wind, Moon, MessageCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Orb } from "@/components/luna/Orb";

const TOTAL_STEPS = 4;

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

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [moods, setMoods] = useState([]);
  const [moments, setMoments] = useState([]);
  const [saving, setSaving] = useState(false);

  const toggle = (arr, setArr, key) =>
    setArr(arr.includes(key) ? arr.filter((x) => x !== key) : [...arr, key]);

  const finish = async () => {
    setSaving(true);
    try {
      const user = await base44.auth.me();
      if (user) {
        await base44.entities.UserPreferences.create({
          userId: user.id,
          primary_moods: moods,
          preferred_moments: moments,
        }).catch(() => {});
      }
    } catch {}
    navigate("/chat");
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
      {/* Header: back + progress */}
      <div
        className="flex items-center px-6 mb-2"
        style={{ height: 44 }}
      >
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
            <div
              key={i}
              style={{
                width: 32,
                height: 3,
                borderRadius: 2,
                background: i <= step ? "#E8834A" : "rgba(255,255,255,0.10)",
                transition: "background 0.3s ease",
              }}
            />
          ))}
        </div>

        <div style={{ width: 30 }} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 fade-in" key={step}>
        {step === 0 && (
          <StepWhy onNext={() => setStep(1)} />
        )}
        {step === 1 && (
          <StepMoods
            selected={moods}
            onToggle={(k) => toggle(moods, setMoods, k)}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <StepMoments
            selected={moments}
            onToggle={(k) => toggle(moments, setMoments, k)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <StepFinish saving={saving} onStart={finish} onLater={() => navigate("/")} />
        )}
      </div>
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
        <h1
          className="font-display"
          style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05, maxWidth: 320 }}
        >
          Een rustige plek, voor jou alleen.
        </h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {FEATURES.map(({ icon: Icon, title, sub }) => (
          <div
            key={title}
            className="surface"
            style={{ padding: "18px 20px", display: "flex", gap: 14, alignItems: "center" }}
          >
            <div
              style={{
                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                background: "rgba(232,131,74,0.08)",
                border: "1px solid rgba(232,131,74,0.22)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
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
        <button onClick={onNext} className="btn btn-primary press" style={{ fontSize: 15 }}>
          Klinkt goed
        </button>
      </div>
    </div>
  );
}

/* ── Step 2 — Hoe voel je je? ── */
function StepMoods({ selected, onToggle, onNext }) {
  return (
    <div className="flex flex-col flex-1">
      <div style={{ paddingTop: 8, paddingBottom: 8 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>EVEN AANKOMEN</p>
        <h1
          className="font-display"
          style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}
        >
          Hoe voel je je nu?
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8 }}>
          Tik wat past. Meerdere mag.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          flex: 1,
          paddingTop: 24,
          alignContent: "start",
        }}
      >
        {MOODS.map((m) => {
          const active = selected.includes(m);
          return (
            <button
              key={m}
              onClick={() => onToggle(m)}
              className="press"
              style={{
                padding: "14px 12px",
                background: active ? "rgba(232,131,74,0.06)" : "var(--surface)",
                border: active ? "1.5px solid #E8834A" : "1px solid var(--border)",
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 500,
                color: active ? "#F2EDE3" : "var(--text)",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.15s ease",
              }}
            >
              {m}
            </button>
          );
        })}
      </div>

      <div style={{ paddingTop: 24 }}>
        <button
          onClick={onNext}
          disabled={selected.length === 0}
          className="btn btn-primary press"
          style={{ fontSize: 15 }}
        >
          Dit klopt
        </button>
      </div>
    </div>
  );
}

/* ── Step 3 — Wanneer? ── */
function StepMoments({ selected, onToggle, onNext }) {
  return (
    <div className="flex flex-col flex-1">
      <div style={{ paddingTop: 8, paddingBottom: 24 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>JOUW RITME</p>
        <h1
          className="font-display"
          style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}
        >
          Wanneer wil je Luna gebruiken?
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8 }}>
          Geen verplichting. Ze is er als jij dat wil.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {MOMENTS.map(({ key, icon: Icon, label }) => {
          const active = selected.includes(key);
          return (
            <button
              key={key}
              onClick={() => onToggle(key)}
              className="press"
              style={{
                height: 64,
                display: "flex",
                alignItems: "center",
                padding: "14px 18px",
                gap: 14,
                background: active ? "rgba(232,131,74,0.06)" : "var(--surface)",
                border: active ? "1.5px solid #E8834A" : "1px solid var(--border)",
                borderRadius: 16,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div
                style={{
                  width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                  background: "rgba(232,131,74,0.08)",
                  border: "1px solid rgba(232,131,74,0.22)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Icon size={15} style={{ color: "#E8834A" }} strokeWidth={1.5} />
              </div>
              <span style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>{label}</span>
            </button>
          );
        })}
      </div>

      <div style={{ paddingTop: 24 }}>
        <button onClick={onNext} className="btn btn-primary press" style={{ fontSize: 15 }}>
          Zo doe ik het
        </button>
      </div>
    </div>
  );
}

/* ── Step 4 — Luna is er ── */
function StepFinish({ saving, onStart, onLater }) {
  return (
    <div className="flex flex-col flex-1 items-center">
      <div style={{ marginTop: 80, marginBottom: 40, display: "flex", justifyContent: "center" }}>
        <Orb size="lg" />
      </div>

      <h1
        className="font-display text-center"
        style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}
      >
        Luna is er voor jou.
      </h1>

      <p
        style={{
          fontSize: 16, color: "var(--text-muted)", marginTop: 12,
          textAlign: "center", maxWidth: 280, lineHeight: 1.55,
        }}
      >
        Vandaag, morgen, altijd. Geen oordeel. Alleen jij.
      </p>

      <div className="w-full" style={{ marginTop: "auto", paddingTop: 40 }}>
        <button
          onClick={onStart}
          disabled={saving}
          className="btn btn-primary press"
          style={{ fontSize: 15 }}
        >
          Start gesprek
        </button>

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <button
            onClick={onLater}
            style={{
              fontSize: 14, color: "var(--text-muted)",
              background: "none", border: "none", cursor: "pointer",
            }}
          >
            Bekijk eerst de app
          </button>
        </div>
      </div>
    </div>
  );
}
