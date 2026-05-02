import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { t } from "@/lib/i18n";
import NoraLogo from "@/components/nora/NoraLogo";
import PaywallHook from "@/components/nora/PaywallHook";

const steps = t.onboarding.steps;

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [goals, setGoals] = useState([]);
  const [tone, setTone] = useState("gentle");
  const [consent, setConsent] = useState(false);
  const [showHook, setShowHook] = useState(false);

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else setShowHook(true);
  };
  const back = () => step > 0 && setStep(step - 1);

  const toggleGoal = (g) =>
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const canNext = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return goals.length > 0;
    if (step === 4) return consent;
    return true;
  };

  if (showHook) {
    return (
      <div
        className="min-h-screen px-5 py-8"
        style={{ background: "linear-gradient(180deg, #f4f9f5 0%, #ecf5ee 100%)" }}
      >
        <div className="mx-auto max-w-md space-y-6">
          <div className="flex items-center justify-center gap-3 pt-4">
            <NoraLogo className="h-10 w-10" />
            <p className="text-lg font-semibold text-[#1a3326]">Nora</p>
          </div>
          <PaywallHook onSkip={() => navigate("/")} />
          <button
            onClick={() => navigate("/")}
            className="block w-full text-center text-xs font-medium text-[#5b7a66]"
          >
            {t.paywallHook.skip}
          </button>
        </div>
      </div>
    );
  }

  const current = steps[step];

  return (
    <div
      className="min-h-screen px-5 py-8"
      style={{ background: "linear-gradient(180deg, #f4f9f5 0%, #ecf5ee 100%)" }}
    >
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col">
        {/* Progress dots */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === step ? 28 : 8,
                background: i <= step ? "#3f8a55" : "rgba(63,138,85,0.18)",
              }}
            />
          ))}
        </div>

        {/* Logo + eyebrow */}
        <div className="mb-6 flex flex-col items-center text-center">
          <NoraLogo className="mb-4 h-14 w-14" />
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#5b7a66]">
            {current.eyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-[#1a3326]">{current.title}</h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#365a44]">{current.body}</p>
        </div>

        {/* Step content */}
        <div className="flex-1">
          {step === 1 && (
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.onboarding.namePlaceholder}
              className="w-full rounded-2xl border border-[rgba(63,138,85,0.20)] bg-white px-4 py-4 text-base outline-none focus:border-[#3f8a55]"
            />
          )}

          {step === 2 && (
            <div className="flex flex-wrap gap-2">
              {t.onboarding.goals.map((g) => {
                const active = goals.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => toggleGoal(g)}
                    className="rounded-full px-4 py-2 text-sm font-medium transition-all"
                    style={{
                      background: active ? "#3f8a55" : "white",
                      color: active ? "white" : "#1a3326",
                      border: active ? "1px solid #3f8a55" : "1px solid rgba(63,138,85,0.20)",
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
              {t.onboarding.tones.map(({ key, label, desc }) => {
                const active = tone === key;
                return (
                  <button
                    key={key}
                    onClick={() => setTone(key)}
                    className="flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left transition-all"
                    style={{
                      background: active ? "#e9f5ec" : "white",
                      border: active ? "1px solid #3f8a55" : "1px solid rgba(63,138,85,0.20)",
                    }}
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#1a3326]">{label}</p>
                      <p className="text-xs text-[#5b7a66]">{desc}</p>
                    </div>
                    {active && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3f8a55]">
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
                className="flex cursor-pointer items-start gap-3 rounded-2xl bg-white px-4 py-4"
                style={{ border: "1px solid rgba(63,138,85,0.20)" }}
              >
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#3f8a55]"
                />
                <span className="text-sm text-[#1a3326]">{t.onboarding.consent}</span>
              </label>
              <div className="rounded-2xl border border-[rgba(218,77,77,0.20)] bg-[rgba(218,77,77,0.05)] px-4 py-3 text-xs leading-5 text-[#a23a3a]">
                {t.onboarding.safety}
              </div>
            </div>
          )}
        </div>

        {/* Nav buttons */}
        <div className="mt-6 flex items-center gap-3">
          {step > 0 && (
            <button
              onClick={back}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white"
              style={{ border: "1px solid rgba(63,138,85,0.20)" }}
            >
              <ArrowLeft className="h-4 w-4 text-[#1a3326]" />
            </button>
          )}
          <button
            onClick={next}
            disabled={!canNext()}
            className="flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white transition-all disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, #5cb47a 0%, #3f8a55 100%)",
              boxShadow: "0 6px 20px rgba(63,138,85,0.30)",
            }}
          >
            {step === steps.length - 1 ? t.onboarding.finish : t.cta.next}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}