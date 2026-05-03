import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";

const STEPS = [
  {
    eyebrow: "Welkom",
    title: "Goed dat je er bent.",
    body: "Luna is een rustige, privé plek om te vertellen wat er speelt. Geen oordeel, geen haast.",
  },
  {
    eyebrow: "Hoe heet je?",
    title: "Hoe mag ik je noemen?",
    body: "Je voornaam of een bijnaam. Je hoeft niks te delen wat je niet wil.",
  },
  {
    eyebrow: "Wat brengt je hier?",
    title: "Waar wil je rond werken?",
    body: "Kies wat bij je past. Je kunt dit later aanpassen.",
  },
  {
    eyebrow: "Welke toon?",
    title: "Hoe wil je dat ik klink?",
    body: "Luna past haar toon aan op wat jij nodig hebt.",
  },
  {
    eyebrow: "Privacy",
    title: "Jouw verhaal blijft van jou.",
    body: "Alles staat privé op je account. Luna is een AI-gezel, geen therapeut. Wis alles wanneer je wil via het Privacycentrum.",
  },
];

const GOALS = [
  "Stress", "Angst", "Slaap", "Relaties", "Focus",
  "Werk", "Eenzaamheid", "Zelfbeeld", "Verlies", "Rust",
  "Energie", "Verbinding", "Iets anders",
];

const TONES = [
  { key: "gentle",     label: "Zacht",      desc: "Warm, geduldig, rustig" },
  { key: "direct",     label: "Direct",     desc: "Eerlijk en helder, zonder hard te zijn" },
  { key: "practical",  label: "Praktisch",  desc: "Concrete stappen en acties" },
  { key: "reflective", label: "Reflectief", desc: "Vragen die je laten nadenken" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep]     = useState(0);
  const [name, setName]     = useState("");
  const [goals, setGoals]   = useState([]);
  const [tone, setTone]     = useState("gentle");
  const [consent, setConsent] = useState(false);

  const toggleGoal = (g) => setGoals((p) => p.includes(g) ? p.filter((x) => x !== g) : [...p, g]);

  const canNext = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return goals.length > 0;
    if (step === 4) return consent;
    return true;
  };

  const next = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      // Save preferences
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
    }
  };

  const current = STEPS[step];

  return (
    <div className="min-h-screen flex flex-col px-5 py-6" style={{ background: "var(--bg)", paddingTop: "env(safe-area-inset-top, 44px)" }}>

      {/* Progress dots */}
      <div className="flex gap-2 mb-10">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full transition-all duration-300"
            style={{ flex: i === step ? 3 : 1, background: i <= step ? "#C25A32" : "rgba(255,255,255,0.10)" }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 max-w-sm mx-auto w-full">
        <p className="text-[12px] font-semibold mb-3" style={{ color: "rgba(194,90,50,0.70)", letterSpacing: "-0.1px" }}>
          {current.eyebrow}
        </p>
        <h1 className="text-[26px] font-bold leading-[1.15] mb-3" style={{ color: "var(--text)", letterSpacing: "-0.4px" }}>
          {current.title}
        </h1>
        <p className="text-[15px] leading-[1.55] mb-8" style={{ color: "var(--text-2)" }}>
          {current.body}
        </p>

        {step === 1 && (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && canNext() && next()}
            placeholder="Bv. Sarah"
            className="w-full rounded-2xl px-4 py-4 text-[17px] outline-none"
            style={{ background: "var(--bg-card)", border: "1px solid var(--line)", color: "var(--text)" }}
          />
        )}

        {step === 2 && (
          <div className="flex flex-wrap gap-2">
            {GOALS.map((g) => (
              <button
                key={g}
                onClick={() => toggleGoal(g)}
                className="chip btn-press"
                style={{
                  background: goals.includes(g) ? "rgba(194,90,50,0.14)" : "var(--bg-card)",
                  border: `1px solid ${goals.includes(g) ? "rgba(194,90,50,0.45)" : "var(--line-subtle)"}`,
                  color: goals.includes(g) ? "#C25A32" : "var(--text-2)",
                }}
              >
                {g}
              </button>
            ))}
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
                  className="flex w-full items-center justify-between rounded-[18px] px-4 py-4 text-left transition-all btn-press"
                  style={{
                    background: active ? "rgba(194,90,50,0.10)" : "var(--bg-card)",
                    border: `1px solid ${active ? "rgba(194,90,50,0.40)" : "var(--line-subtle)"}`,
                  }}
                >
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold leading-tight" style={{ color: active ? "#C25A32" : "var(--text)" }}>{label}</p>
                    <p className="text-[12.5px] mt-1" style={{ color: "var(--text-3)" }}>{desc}</p>
                  </div>
                  {active && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full shrink-0" style={{ background: "#C25A32" }}>
                      <Check className="h-[14px] w-[14px] text-white" strokeWidth={2.5} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {step === 4 && (
          <label
            className="flex cursor-pointer items-start gap-3 rounded-[18px] px-4 py-4 btn-press"
            style={{ background: "var(--bg-card)", border: "1px solid var(--line-subtle)" }}
          >
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#C25A32] shrink-0"
            />
            <span className="text-[14.5px] leading-[1.5]" style={{ color: "var(--text)" }}>
              Ik ga akkoord met het privacybeleid en begrijp dat Luna een AI-gezel is, geen therapeut.
            </span>
          </label>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 mt-8 max-w-sm mx-auto w-full">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex h-12 w-12 items-center justify-center rounded-[16px] btn-press"
            style={{ background: "var(--bg-card)", border: "1px solid var(--line-subtle)" }}
          >
            <ArrowLeft className="h-[16px] w-[16px]" style={{ color: "var(--text-2)" }} />
          </button>
        )}
        <button
          onClick={next}
          disabled={!canNext()}
          className="flex flex-1 items-center justify-center gap-2 rounded-[16px] h-12 text-[15px] font-semibold text-white transition-all btn-press disabled:opacity-35"
          style={{ background: "#C25A32" }}
        >
          {step === STEPS.length - 1 ? "Luna openen" : "Volgende"}
          <ArrowRight className="h-[16px] w-[16px]" />
        </button>
      </div>
    </div>
  );
}