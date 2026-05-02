import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

const STEPS = [
  { eyebrow: "Welkom", title: "Hoi, ik ben Nora.", body: "Een rustige, privé plek om te babbelen wanneer het zwaar is. Geen oordeel, geen haast." },
  { eyebrow: "Hoe heet je?", title: "Hoe mag ik je noemen?", body: "Je voornaam of een bijnaam — je hoeft niets te delen wat je niet wil." },
  { eyebrow: "Wat brengt je hier?", title: "Waar wil je rond werken?", body: "Kies wat resoneert. Je kunt dit later aanpassen." },
  { eyebrow: "Welke toon?", title: "Hoe wil je dat ik klink?", body: "Ik pas mijn antwoorden hierop aan." },
  { eyebrow: "Privacy", title: "Jouw verhaal blijft van jou.", body: "Berichten staan privé op je account. Je kunt alles wissen via het Privacycentrum." },
];

const GOALS = ["Stress", "Angst", "Slaap", "Relaties", "Focus", "Eenzaamheid", "Zelfbeeld", "Burn-out", "Verlies", "Iets anders"];
const TONES = [
  { key: "gentle", label: "Zacht", desc: "Warm en geduldig" },
  { key: "direct", label: "Direct", desc: "Eerlijk en helder" },
  { key: "practical", label: "Praktisch", desc: "Concrete stappen" },
  { key: "reflective", label: "Reflectief", desc: "Vragen die laten denken" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [goals, setGoals] = useState([]);
  const [tone, setTone] = useState("gentle");
  const [consent, setConsent] = useState(false);

  const toggleGoal = (g) => setGoals((p) => p.includes(g) ? p.filter((x) => x !== g) : [...p, g]);

  const canNext = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return goals.length > 0;
    if (step === 4) return consent;
    return true;
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else navigate("/");
  };

  const current = STEPS[step];

  return (
    <div className="min-h-screen flex flex-col px-5 py-8" style={{ background: "#000" }}>
      {/* Progress */}
      <div className="flex gap-1.5 mb-10">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full transition-all"
            style={{ flex: i === step ? 3 : 1, background: i <= step ? "#c25a32" : "rgba(255,255,255,0.12)" }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 max-w-sm mx-auto w-full">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
          {current.eyebrow}
        </p>
        <h1 className="text-2xl font-bold text-white mb-2">{current.title}</h1>
        <p className="text-sm leading-6 mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>{current.body}</p>

        {/* Step inputs */}
        {step === 1 && (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && canNext() && next()}
            placeholder="Bv. Niels"
            className="w-full rounded-2xl px-4 py-4 text-base text-white outline-none"
            style={{ background: "#1c1c1e", border: "1px solid rgba(255,255,255,0.12)" }}
          />
        )}

        {step === 2 && (
          <div className="flex flex-wrap gap-2">
            {GOALS.map((g) => (
              <button
                key={g}
                onClick={() => toggleGoal(g)}
                className="rounded-full px-4 py-2 text-sm font-medium transition-all"
                style={{
                  background: goals.includes(g) ? "#c25a32" : "#1c1c1e",
                  color: goals.includes(g) ? "#fff" : "rgba(255,255,255,0.65)",
                  border: `1px solid ${goals.includes(g) ? "#c25a32" : "rgba(255,255,255,0.12)"}`,
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
                  className="flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left transition-all"
                  style={{ background: active ? "rgba(194,90,50,0.20)" : "#1c1c1e", border: `1px solid ${active ? "#c25a32" : "rgba(255,255,255,0.08)"}` }}
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.50)" }}>{desc}</p>
                  </div>
                  {active && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: "#c25a32" }}>
                      <Check className="h-3.5 w-3.5 text-white" />
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
              className="flex cursor-pointer items-start gap-3 rounded-2xl px-4 py-4"
              style={{ background: "#1c1c1e", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#c25a32]"
              />
              <span className="text-sm text-white">Ik ga akkoord met het privacybeleid en de veiligheidsnotitie.</span>
            </label>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex items-center gap-3 mt-8 max-w-sm mx-auto w-full">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{ background: "#1c1c1e" }}
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
        )}
        <button
          onClick={next}
          disabled={!canNext()}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white transition-all disabled:opacity-35"
          style={{ background: "linear-gradient(135deg, #ee9670, #c25a32)" }}
        >
          {step === STEPS.length - 1 ? "Nora openen" : "Volgende"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}