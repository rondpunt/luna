import { Check } from "lucide-react";
import { t } from "@/lib/i18n";
import PaywallHook from "@/components/nora/PaywallHook";

export default function Pricing() {
  return (
    <div
      className="min-h-screen px-5 py-8"
      style={{ background: "linear-gradient(180deg, #f4f9f5 0%, #ecf5ee 100%)" }}
    >
      <div className="mx-auto max-w-md space-y-6 lg:max-w-3xl">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#5b7a66]">
            {t.pricing.eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[#1a3326]">{t.pricing.title}</h1>
          <p className="mt-3 text-sm text-[#365a44]">{t.pricing.intro}</p>
        </div>

        <PaywallHook />

        <div className="grid gap-3 lg:grid-cols-3">
          {t.pricing.tiers.map((tier) => (
            <div
              key={tier.key}
              className="rounded-3xl p-5"
              style={{
                background: tier.featured ? "#e9f5ec" : "white",
                border: tier.featured ? "1px solid #3f8a55" : "1px solid rgba(63,138,85,0.18)",
              }}
            >
              <p className="text-base font-semibold text-[#1a3326]">{tier.name}</p>
              <p className="mt-2 text-3xl font-semibold text-[#1a3326]">
                {tier.price}
                <span className="text-sm font-normal text-[#5b7a66]">{tier.per}</span>
              </p>
              <p className="mt-1 text-xs text-[#5b7a66]">{tier.note}</p>
              <ul className="mt-4 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#1a3326]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#3f8a55]" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className="mt-5 w-full rounded-2xl py-3 text-sm font-semibold transition-all"
                style={{
                  background: tier.featured
                    ? "linear-gradient(135deg, #5cb47a 0%, #3f8a55 100%)"
                    : "white",
                  color: tier.featured ? "white" : "#1a3326",
                  border: tier.featured ? "none" : "1px solid rgba(63,138,85,0.20)",
                  boxShadow: tier.featured ? "0 6px 20px rgba(63,138,85,0.30)" : "none",
                }}
              >
                {tier.key === "free" ? t.pricing.chooseFree : t.pricing.choose(tier.name)}
              </button>
            </div>
          ))}
        </div>

        <div
          className="rounded-3xl bg-white p-5"
          style={{ border: "1px solid rgba(63,138,85,0.18)" }}
        >
          <p className="text-sm font-semibold text-[#1a3326]">{t.pricing.importantTitle}</p>
          <p className="mt-2 text-sm leading-6 text-[#5b7a66]">{t.pricing.importantBody}</p>
        </div>
      </div>
    </div>
  );
}