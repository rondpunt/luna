import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";

/* ──────────────────────────────────────────
   Premium 5-step onboarding
   - Swipe gestures (touch)
   - Engagement hooks: moods + moments
   - Saves to UserPreferences at finish
   ────────────────────────────────────────── */

const MOODS = [
  { key: "heavy",      emoji: "😔", label: "Zwaar"        },
  { key: "tense",      emoji: "😰", label: "Gespannen"    },
  { key: "numb",       emoji: "😶", label: "Verdoofd"     },
  { key: "frustrated", emoji: "😤", label: "Gefrustreerd" },
  { key: "okay",       emoji: "🙂", label: "Oké"          },
];

const MOMENTS = [
  { key: "morning",     emoji: "🌅", label: "'s Ochtends starten"           },
  { key: "overwhelmed", emoji: "🌀", label: "Als ik me overweldigd voel"   },
  { key: "evening",     emoji: "🌙", label: "'s Avonds reflecteren"         },
  { key: "anytime",     emoji: "💭", label: "Zomaar, als ik wil praten"     },
];

const TOTAL_STEPS = 5;

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [moods, setMoods] = useState([]);
  const [moments, setMoments] = useState([]);
  const [saving, setSaving] = useState(false);

  /* swipe */
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0 && step < TOTAL_STEPS - 1) setStep(step + 1);
      if (dx > 0 && step > 0) setStep(step - 1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

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
    } catch { /* silent */ }
    navigate("/chat");
  };

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: "var(--bg)",
        paddingTop: "calc(20px + env(safe-area-inset-top, 0px))",
        paddingBottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Soft accent backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh]"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 0%, rgba(194,90,50,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Back button */}
      <div className="px-5 relative z-10 h-10 flex items-center">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex h-10 w-10 -ml-2 items-center justify-center rounded-full btn-press"
            style={{ color: "var(--text-2)" }}
          >
            <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-5 relative z-10">
        <div className="max-w-sm mx-auto w-full flex-1 flex flex-col fade-in" key={step}>
          {step === 0 && <StepWelcome onNext={() => setStep(1)} />}
          {step === 1 && <StepValue   onNext={() => setStep(2)} />}
          {step === 2 && (
            <StepMoods
              selected={moods}
              onToggle={(k) => toggle(moods, setMoods, k)}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <StepMoments
              selected={moments}
              onToggle={(k) => toggle(moments, setMoments, k)}
              onNext={() => setStep(4)}
            />
          )}
          {step === 4 && (
            <StepFinish
              saving={saving}
              onStart={finish}
              onLater={() => navigate("/")}
            />
          )}
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-6 relative z-10">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            aria-label={`Stap ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === step ? 22 : 6,
              height: 6,
              background: i === step
                ? "#C25A32"
                : i < step
                ? "rgba(194,90,50,0.45)"
                : "rgba(255,255,255,0.10)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   STEP 1 — Welkom
   ────────────────────────────────────────── */

function StepWelcome({ onNext }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <div className="mb-10">
        <BigOrb intensity="normal" />
      </div>
      <h1
        className="text-[34px] font-bold leading-[1.1] mb-4 max-w-[320px]"
        style={{ color: "var(--text)", letterSpacing: "-0.7px" }}
      >
        Hallo, ik ben Luna.
      </h1>
      <p
        className="text-[16px] leading-[1.55] mb-10 max-w-[300px]"
        style={{ color: "var(--text-2)" }}
      >
        Jouw persoonlijke ruimte om te voelen, te denken en te groeien.
      </p>
      <PrimaryButton onClick={onNext}>Begin</PrimaryButton>
    </div>
  );
}

/* ──────────────────────────────────────────
   STEP 2 — Waardepropositie
   ────────────────────────────────────────── */

const VALUE_PROPS = [
  { emoji: "🤍", title: "Altijd beschikbaar", desc: "Geen afspraken, geen wachttijden" },
  { emoji: "🔒", title: "Volledig privé",     desc: "End-to-end, alleen jij en Luna" },
  { emoji: "🧠", title: "Leert jou kennen",   desc: "Onthoudt wat voor jou belangrijk is" },
];

function StepValue({ onNext }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="pt-4 pb-7">
        <p className="text-[11.5px] font-semibold uppercase mb-3" style={{ color: "#C25A32", letterSpacing: "1.2px" }}>
          Waarom Luna
        </p>
        <h1 className="text-[26px] font-bold leading-[1.18]" style={{ color: "var(--text)", letterSpacing: "-0.4px" }}>
          Een rustige plek, voor jou alleen.
        </h1>
      </div>

      <div className="space-y-3 flex-1">
        {VALUE_PROPS.map((v, i) => (
          <div
            key={v.title}
            className="flex items-start gap-4 px-4 py-4 rounded-[18px]"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--line-subtle)",
              animation: "fadeUp 0.5s ease-out both",
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-[22px]"
              style={{ background: "rgba(194,90,50,0.10)" }}
            >
              {v.emoji}
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="text-[15.5px] font-semibold leading-tight" style={{ color: "var(--text)", letterSpacing: "-0.2px" }}>
                {v.title}
              </p>
              <p className="text-[13px] mt-1 leading-[1.5]" style={{ color: "var(--text-2)" }}>
                {v.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8">
        <PrimaryButton onClick={onNext}>Klinkt goed</PrimaryButton>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   STEP 3 — Hoe voel jij je meestal?
   ────────────────────────────────────────── */

function StepMoods({ selected, onToggle, onNext }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="pt-4 pb-6">
        <p className="text-[11.5px] font-semibold uppercase mb-3" style={{ color: "#C25A32", letterSpacing: "1.2px" }}>
          Even afstemmen
        </p>
        <h1 className="text-[26px] font-bold leading-[1.18]" style={{ color: "var(--text)", letterSpacing: "-0.4px" }}>
          Hoe voel jij je meestal?
        </h1>
        <p className="text-[14px] mt-2.5 leading-[1.5]" style={{ color: "var(--text-3)" }}>
          Kies wat past. Meerdere mag.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 flex-1">
        {MOODS.map((m, i) => {
          const active = selected.includes(m.key);
          const isLast = i === MOODS.length - 1;
          return (
            <button
              key={m.key}
              onClick={() => onToggle(m.key)}
              className={`flex flex-col items-center justify-center gap-2 py-5 rounded-[18px] btn-press transition-all ${
                isLast ? "col-span-2" : ""
              }`}
              style={{
                background: active ? "rgba(194,90,50,0.12)" : "var(--bg-card)",
                border: `1px solid ${active ? "rgba(194,90,50,0.45)" : "var(--line-subtle)"}`,
                minHeight: 96,
              }}
            >
              <span className="text-[28px] leading-none">{m.emoji}</span>
              <span
                className="text-[14px] font-semibold"
                style={{ color: active ? "#C25A32" : "var(--text)" }}
              >
                {m.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="pt-7">
        <PrimaryButton onClick={onNext} disabled={selected.length === 0}>
          Dit klopt
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   STEP 4 — Wanneer wil jij Luna gebruiken?
   ────────────────────────────────────────── */

function StepMoments({ selected, onToggle, onNext }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="pt-4 pb-6">
        <p className="text-[11.5px] font-semibold uppercase mb-3" style={{ color: "#C25A32", letterSpacing: "1.2px" }}>
          Jouw ritme
        </p>
        <h1 className="text-[26px] font-bold leading-[1.18]" style={{ color: "var(--text)", letterSpacing: "-0.4px" }}>
          Wanneer wil jij Luna gebruiken?
        </h1>
        <p className="text-[14px] mt-2.5 leading-[1.5]" style={{ color: "var(--text-3)" }}>
          Meerdere mag. Ze is er telkens jij wil.
        </p>
      </div>

      <div className="space-y-2.5 flex-1">
        {MOMENTS.map((m) => {
          const active = selected.includes(m.key);
          return (
            <button
              key={m.key}
              onClick={() => onToggle(m.key)}
              className="flex w-full items-center gap-4 px-4 py-4 rounded-[18px] text-left btn-press transition-all"
              style={{
                background: active ? "rgba(194,90,50,0.10)" : "var(--bg-card)",
                border: `1px solid ${active ? "rgba(194,90,50,0.40)" : "var(--line-subtle)"}`,
              }}
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-[22px]"
                style={{ background: active ? "rgba(194,90,50,0.16)" : "rgba(255,255,255,0.04)" }}
              >
                {m.emoji}
              </div>
              <span
                className="flex-1 text-[15px] font-medium"
                style={{ color: active ? "#C25A32" : "var(--text)" }}
              >
                {m.label}
              </span>
              {active && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full shrink-0" style={{ background: "#C25A32" }}>
                  <Check className="h-[13px] w-[13px] text-white" strokeWidth={2.8} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="pt-7">
        <PrimaryButton onClick={onNext} disabled={selected.length === 0}>
          Zo doe ik het
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   STEP 5 — Klaar
   ────────────────────────────────────────── */

function StepFinish({ saving, onStart, onLater }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <div className="mb-10">
        <BigOrb intensity="strong" />
      </div>
      <h1
        className="text-[32px] font-bold leading-[1.1] mb-4 max-w-[320px]"
        style={{ color: "var(--text)", letterSpacing: "-0.6px" }}
      >
        Luna is er voor jou.
      </h1>
      <p
        className="text-[16px] leading-[1.55] mb-10 max-w-[300px]"
        style={{ color: "var(--text-2)" }}
      >
        Vandaag, morgen, altijd. Geen oordeel. Alleen jij.
      </p>
      <PrimaryButton onClick={onStart} disabled={saving}>
        {saving ? "Even…" : "Start gesprek"}
      </PrimaryButton>
      <button
        onClick={onLater}
        className="mt-5 text-[13.5px] font-medium btn-press"
        style={{ color: "var(--text-3)" }}
      >
        Bekijk eerst de app
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────
   Shared bits
   ────────────────────────────────────────── */

function PrimaryButton({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full h-[54px] rounded-[16px] text-[16px] font-semibold text-white btn-press transition-all disabled:opacity-35"
      style={{
        background: "#C25A32",
        boxShadow: !disabled
          ? "0 1px 0 rgba(255,255,255,0.10) inset, 0 8px 24px rgba(194,90,50,0.32)"
          : "none",
        letterSpacing: "-0.1px",
      }}
    >
      {children}
    </button>
  );
}

function BigOrb({ intensity }) {
  const strong = intensity === "strong";
  return (
    <div className="relative h-[160px] w-[160px] flex items-center justify-center">
      <div
        aria-hidden
        className="absolute inset-[-40px] rounded-full"
        style={{
          background: strong
            ? "radial-gradient(circle, rgba(194,90,50,0.28) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(194,90,50,0.18) 0%, transparent 70%)",
          animation: "orbBreath 3.8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute inset-[-18px] rounded-full"
        style={{
          border: `1px solid rgba(194,90,50,${strong ? 0.28 : 0.16})`,
          animation: "orbBreath 4.2s ease-in-out infinite reverse",
        }}
      />
      <div
        className="h-[120px] w-[120px] rounded-full orb-breathe"
        style={{
          background: "radial-gradient(circle at 35% 32%, #ee9670 0%, #c25a32 50%, #7a2d14 100%)",
          boxShadow: strong
            ? "0 0 60px 18px rgba(194,90,50,0.45)"
            : "0 0 40px 10px rgba(194,90,50,0.30)",
        }}
      />
    </div>
  );
}