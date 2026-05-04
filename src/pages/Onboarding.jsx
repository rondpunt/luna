import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";

/* ──────────────────────────────────────────
   Premium 5-step onboarding — chat only.
   Inline SVG visuals per step. No external assets.
   Save-logic untouched (UserPreferences + auth.updateMe).
   ────────────────────────────────────────── */

const STEPS = [
  {
    eyebrow: "Welkom",
    title: "Goed dat je er bent.",
    body: "Luna is een rustige plek om te vertellen wat er speelt. Geen oordeel, geen haast — alleen een gesprek wanneer jij het nodig hebt.",
  },
  {
    eyebrow: "Even voorstellen",
    title: "Hoe mag Luna je noemen?",
    body: "Je voornaam, een bijnaam, of iets wat goed voelt. Je hoeft niets te delen wat je niet wil.",
  },
  {
    eyebrow: "Wat brengt je hier",
    title: "Waar wil je rond werken?",
    body: "Kies wat resoneert. Niets is verplicht — je kan dit later altijd aanpassen.",
  },
  {
    eyebrow: "Toon van Luna",
    title: "Hoe wil je dat ze klinkt?",
    body: "Luna stemt zich op jou af. Kies wat nu goed voelt.",
  },
  {
    eyebrow: "Privé en veilig",
    title: "Jouw verhaal blijft van jou.",
    body: "Alles staat versleuteld op je account. Luna is een AI-gezel, geen therapeut. Je kan alles wissen wanneer je wil.",
  },
];

const GOALS = [
  "Stress", "Angst", "Slaap", "Relaties", "Focus",
  "Werk", "Eenzaamheid", "Zelfbeeld", "Verlies", "Rust",
  "Energie", "Verbinding", "Iets anders",
];

const TONES = [
  { key: "gentle",     label: "Zacht",      desc: "Warm, geduldig, rustig" },
  { key: "direct",     label: "Direct",     desc: "Eerlijk en helder" },
  { key: "practical",  label: "Praktisch",  desc: "Concrete stappen" },
  { key: "reflective", label: "Reflectief", desc: "Vragen die je laten denken" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep]       = useState(0);
  const [name, setName]       = useState("");
  const [goals, setGoals]     = useState([]);
  const [tone, setTone]       = useState("gentle");
  const [consent, setConsent] = useState(false);
  const [saving, setSaving]   = useState(false);

  const toggleGoal = (g) =>
    setGoals((p) => (p.includes(g) ? p.filter((x) => x !== g) : [...p, g]));

  const canNext = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return goals.length > 0;
    if (step === 4) return consent;
    return true;
  };

  const next = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    setSaving(true);
    try {
      const user = await base44.auth.me();
      if (user) {
        await base44.entities.UserPreferences.create({
          userId: user.id,
          goals,
          aiResponseStyle: tone,
        }).catch(() => {});
        await base44.auth.updateMe({ full_name: name.trim() }).catch(() => {});
      }
    } catch { /* silent */ }
    navigate("/");
  };

  const current = STEPS[step];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "var(--bg)",
        paddingTop: "calc(20px + env(safe-area-inset-top, 0px))",
        paddingBottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      {/* Soft accent gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[55vh]"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 0%, rgba(194,90,50,0.10) 0%, transparent 70%)",
        }}
      />

      {/* Progress */}
      <div className="px-5 mb-7 relative z-10">
        <div className="flex gap-1.5 max-w-sm mx-auto w-full">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="h-[3px] rounded-full transition-all duration-500 ease-out"
              style={{
                flex: i === step ? 4 : 1,
                background:
                  i < step
                    ? "#C25A32"
                    : i === step
                    ? "linear-gradient(90deg, #C25A32 0%, rgba(194,90,50,0.30) 100%)"
                    : "rgba(255,255,255,0.06)",
              }}
            />
          ))}
        </div>
        <p
          className="text-center text-[11px] mt-3 font-medium tabular-nums"
          style={{ color: "var(--text-3)", letterSpacing: "0.3px" }}
        >
          {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-5 relative z-10">
        <div className="max-w-sm mx-auto w-full flex-1 flex flex-col">

          {/* Visual */}
          <div className="flex justify-center mb-7">
            <StepVisual step={step} />
          </div>

          {/* Copy */}
          <div className="fade-in" key={step}>
            <p
              className="text-[11.5px] font-semibold uppercase mb-3"
              style={{ color: "#C25A32", letterSpacing: "1.2px" }}
            >
              {current.eyebrow}
            </p>
            <h1
              className="text-[28px] font-bold leading-[1.15] mb-3"
              style={{ color: "var(--text)", letterSpacing: "-0.5px" }}
            >
              {current.title}
            </h1>
            <p
              className="text-[15px] leading-[1.6] mb-7"
              style={{ color: "var(--text-2)" }}
            >
              {current.body}
            </p>
          </div>

          {/* Step inputs */}
          <div className="fade-in" key={`input-${step}`}>
            {step === 1 && (
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && canNext() && next()}
                placeholder="Bv. Sarah"
                className="w-full rounded-[16px] px-5 py-4 text-[17px] outline-none transition-colors"
                style={{
                  background: "var(--bg-card)",
                  border: `1px solid ${name.trim() ? "rgba(194,90,50,0.40)" : "var(--line)"}`,
                  color: "var(--text)",
                }}
              />
            )}

            {step === 2 && (
              <div className="flex flex-wrap gap-2">
                {GOALS.map((g) => {
                  const active = goals.includes(g);
                  return (
                    <button
                      key={g}
                      onClick={() => toggleGoal(g)}
                      className="chip btn-press"
                      style={{
                        background: active ? "rgba(194,90,50,0.14)" : "var(--bg-card)",
                        border: `1px solid ${active ? "rgba(194,90,50,0.45)" : "var(--line-subtle)"}`,
                        color: active ? "#C25A32" : "var(--text-2)",
                      }}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-2">
                {TONES.map(({ key, label, desc }) => {
                  const active = tone === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setTone(key)}
                      className="flex w-full items-center justify-between rounded-[16px] px-4 py-4 text-left transition-all btn-press"
                      style={{
                        background: active ? "rgba(194,90,50,0.10)" : "var(--bg-card)",
                        border: `1px solid ${active ? "rgba(194,90,50,0.40)" : "var(--line-subtle)"}`,
                      }}
                    >
                      <div className="min-w-0">
                        <p
                          className="text-[15px] font-semibold leading-tight"
                          style={{ color: active ? "#C25A32" : "var(--text)" }}
                        >
                          {label}
                        </p>
                        <p className="text-[12.5px] mt-1" style={{ color: "var(--text-3)" }}>
                          {desc}
                        </p>
                      </div>
                      {active && (
                        <div
                          className="flex h-6 w-6 items-center justify-center rounded-full shrink-0"
                          style={{ background: "#C25A32" }}
                        >
                          <Check className="h-[13px] w-[13px] text-white" strokeWidth={2.8} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3">
                <label
                  className="flex cursor-pointer items-start gap-3 rounded-[16px] px-4 py-4 btn-press"
                  style={{
                    background: consent ? "rgba(194,90,50,0.08)" : "var(--bg-card)",
                    border: `1px solid ${consent ? "rgba(194,90,50,0.35)" : "var(--line-subtle)"}`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[#C25A32] shrink-0"
                  />
                  <span className="text-[14px] leading-[1.55]" style={{ color: "var(--text)" }}>
                    Ik ga akkoord met het privacybeleid en begrijp dat Luna een AI-gezel is, geen therapeut.
                  </span>
                </label>
                <p
                  className="text-[11.5px] text-center px-4 leading-[1.5]"
                  style={{ color: "var(--text-4)" }}
                >
                  Bij acute nood: bel 112 of de zelfmoordlijn 1813.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-5 mt-8 relative z-10">
        <div className="flex items-center gap-3 max-w-sm mx-auto w-full">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex h-[52px] w-[52px] items-center justify-center rounded-[16px] btn-press"
              style={{ background: "var(--bg-card)", border: "1px solid var(--line-subtle)" }}
            >
              <ArrowLeft className="h-[18px] w-[18px]" style={{ color: "var(--text-2)" }} strokeWidth={2} />
            </button>
          ) : (
            <div className="w-[52px]" />
          )}
          <button
            onClick={next}
            disabled={!canNext() || saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-[16px] h-[52px] text-[15.5px] font-semibold text-white transition-all btn-press disabled:opacity-35"
            style={{
              background: "#C25A32",
              boxShadow:
                canNext() && !saving
                  ? "0 1px 0 rgba(255,255,255,0.10) inset, 0 6px 20px rgba(194,90,50,0.30)"
                  : "none",
            }}
          >
            {saving ? "Even…" : step === STEPS.length - 1 ? "Open Luna" : "Volgende"}
            {!saving && <ArrowRight className="h-[16px] w-[16px]" strokeWidth={2.4} />}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Per-step inline visuals (CSS + SVG only)
   ────────────────────────────────────────── */

function StepVisual({ step }) {
  if (step === 0) return <OrbVisual />;
  if (step === 1) return <NameVisual />;
  if (step === 2) return <GoalsVisual />;
  if (step === 3) return <ToneVisual />;
  if (step === 4) return <ShieldVisual />;
  return null;
}

/* Step 0 — breathing orb (premium presence) */
function OrbVisual() {
  return (
    <div className="relative h-[140px] w-[140px] flex items-center justify-center">
      <div
        className="absolute inset-0 rounded-full orb-breathe"
        style={{
          background: "radial-gradient(circle at 35% 32%, #ee9670 0%, #c25a32 50%, #7a2d14 100%)",
        }}
      />
      <div
        className="absolute inset-[-14px] rounded-full"
        style={{
          border: "1px solid rgba(194,90,50,0.18)",
          animation: "orbBreath 3.8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute inset-[-32px] rounded-full"
        style={{
          border: "1px solid rgba(194,90,50,0.08)",
          animation: "orbBreath 3.8s ease-in-out infinite reverse",
        }}
      />
    </div>
  );
}

/* Step 1 — chat-bubble met cursor */
function NameVisual() {
  return (
    <div className="relative h-[140px] w-[220px] flex items-center justify-center">
      <div
        className="absolute left-0 top-2 h-9 w-9 rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 32%, #ee9670 0%, #c25a32 55%, #7a2d14 100%)",
          boxShadow: "0 0 16px 4px rgba(194,90,50,0.22)",
        }}
      />
      <div
        className="absolute left-12 top-1 rounded-[16px] rounded-bl-[6px] px-3.5 py-2.5 text-[13px]"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--line)",
          color: "var(--text-2)",
        }}
      >
        Hoi 👋
      </div>
      <div
        className="absolute right-0 bottom-2 rounded-[16px] rounded-br-[6px] px-3.5 py-2.5 text-[13px] flex items-center gap-1"
        style={{
          background: "#C25A32",
          color: "#fff",
          boxShadow: "0 4px 14px rgba(194,90,50,0.30)",
        }}
      >
        <span style={{ opacity: 0.85 }}>Ik ben</span>
        <span
          className="inline-block w-[2px] h-[14px] ml-0.5"
          style={{
            background: "#fff",
            animation: "presencePulse 1s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}

/* Step 2 — drijvende thema-tags */
function GoalsVisual() {
  const tags = [
    { label: "Rust",      x: -76, y: -22, accent: true,  delay: "0s"   },
    { label: "Slaap",     x:  20, y: -38, accent: false, delay: "0.3s" },
    { label: "Werk",      x:  64, y:  10, accent: false, delay: "0.6s" },
    { label: "Verbinding",x: -38, y:  30, accent: true,  delay: "0.9s" },
    { label: "Focus",     x:  30, y:  44, accent: false, delay: "1.2s" },
  ];
  return (
    <div className="relative h-[140px] w-[240px]">
      {tags.map((t) => (
        <span
          key={t.label}
          className="absolute chip"
          style={{
            left: "50%",
            top: "50%",
            transform: `translate(calc(-50% + ${t.x}px), calc(-50% + ${t.y}px))`,
            background: t.accent ? "rgba(194,90,50,0.14)" : "var(--bg-card)",
            border: `1px solid ${t.accent ? "rgba(194,90,50,0.45)" : "var(--line)"}`,
            color: t.accent ? "#C25A32" : "var(--text-2)",
            animation: "fadeUp 0.6s ease-out both",
            animationDelay: t.delay,
          }}
        >
          {t.label}
        </span>
      ))}
    </div>
  );
}

/* Step 3 — toon-balk equalizer */
function ToneVisual() {
  const bars = [16, 28, 44, 36, 52, 32, 22, 40, 24];
  return (
    <div className="flex items-end justify-center gap-1.5 h-[140px] w-[220px]">
      {bars.map((h, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: 5,
            height: h,
            background: i % 3 === 0
              ? "linear-gradient(180deg, #ee9670 0%, #C25A32 100%)"
              : "rgba(194,90,50,0.30)",
            animation: `presencePulse ${1.2 + (i % 4) * 0.18}s ease-in-out infinite`,
            animationDelay: `${i * 0.07}s`,
            boxShadow: i % 3 === 0 ? "0 0 8px rgba(194,90,50,0.40)" : "none",
          }}
        />
      ))}
    </div>
  );
}

/* Step 4 — schild met slot */
function ShieldVisual() {
  return (
    <div className="relative h-[140px] w-[140px] flex items-center justify-center">
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(194,90,50,0.16) 0%, transparent 65%)",
        }}
      />
      <svg width="92" height="108" viewBox="0 0 92 108" fill="none">
        <defs>
          <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ee9670" />
            <stop offset="100%" stopColor="#C25A32" />
          </linearGradient>
        </defs>
        <path
          d="M46 4 L84 18 V52 C84 76 68 96 46 104 C24 96 8 76 8 52 V18 Z"
          fill="url(#shieldGrad)"
          opacity="0.14"
          stroke="rgba(194,90,50,0.45)"
          strokeWidth="1.5"
        />
        <path
          d="M46 14 L74 24 V52 C74 70 62 86 46 92 C30 86 18 70 18 52 V24 Z"
          fill="none"
          stroke="url(#shieldGrad)"
          strokeWidth="1.8"
          opacity="0.7"
        />
        {/* lock body */}
        <rect x="36" y="50" width="20" height="18" rx="3.5" fill="url(#shieldGrad)" />
        {/* shackle */}
        <path
          d="M40 50 V44 C40 40.6863 42.6863 38 46 38 C49.3137 38 52 40.6863 52 44 V50"
          stroke="url(#shieldGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        {/* keyhole */}
        <circle cx="46" cy="58" r="2" fill="rgba(0,0,0,0.45)" />
        <rect x="45.2" y="58" width="1.6" height="5" fill="rgba(0,0,0,0.45)" />
      </svg>
    </div>
  );
}