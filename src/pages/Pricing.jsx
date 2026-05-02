import { Link } from "react-router-dom";
import { Check, ChevronLeft } from "lucide-react";

const TIERS = [
  {
    key: "free",
    name: "Gratis",
    price: "€0",
    per: "",
    note: "Om rustig te starten",
    features: ["5 gesprekken per dag", "Basis dagboek", "Dagelijkse check-in"],
    featured: false,
  },
  {
    key: "plus",
    name: "Luna Plus",
    price: "€9,99",
    per: "/mnd",
    note: "Voor dagelijkse steun",
    features: ["Onbeperkt babbelen", "Geheugen over gesprekken", "Volledig dagboek", "Gespreksmappen", "Wekelijkse inzichten"],
    featured: true,
  },
  {
    key: "pro",
    name: "Luna Pro",
    price: "€19,99",
    per: "/mnd",
    note: "Diepere reflectie",
    features: ["Alles van Plus", "Langetermijngeheugen", "Patroonanalyse", "Gepersonaliseerde routines"],
    featured: false,
  },
];

export default function Pricing() {
  return (
    <div
      className="min-h-screen px-4 py-6 space-y-5"
      style={{ background: "var(--bg)", paddingTop: "env(safe-area-inset-top, 44px)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Link to="/profile" className="flex items-center gap-1 btn-press" style={{ color: "#C25A32" }}>
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          <span className="text-[16px] font-medium">Profiel</span>
        </Link>
      </div>

      <div>
        <h1 className="text-[30px] font-bold" style={{ color: "var(--text)", letterSpacing: "-0.5px" }}>Abonnementen</h1>
        <p className="text-[16px] mt-1" style={{ color: "var(--text-2)" }}>Kies wat bij jou past.</p>
      </div>

      <div className="space-y-3">
        {TIERS.map((tier) => (
          <div
            key={tier.key}
            className="rounded-2xl p-5"
            style={{
              background: tier.featured ? "rgba(194,90,50,0.10)" : "var(--bg-card)",
              border: `1px solid ${tier.featured ? "rgba(194,90,50,0.40)" : "var(--line)"}`,
            }}
          >
            {tier.featured && (
              <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: "#C25A32" }}>
                Meest gekozen
              </p>
            )}
            <div className="flex items-baseline justify-between mb-1">
              <p className="text-[19px] font-bold" style={{ color: "var(--text)" }}>{tier.name}</p>
              <p className="text-[28px] font-bold" style={{ color: "var(--text)", letterSpacing: "-0.5px" }}>
                {tier.price}
                <span className="text-[14px] font-normal" style={{ color: "var(--text-2)" }}>{tier.per}</span>
              </p>
            </div>
            <p className="text-[13px] mb-4" style={{ color: "var(--text-2)" }}>{tier.note}</p>
            <div className="space-y-2 mb-5">
              {tier.features.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <Check className="h-4 w-4 shrink-0" style={{ color: "#C25A32" }} strokeWidth={2.5} />
                  <span className="text-[14px]" style={{ color: "var(--text)" }}>{f}</span>
                </div>
              ))}
            </div>
            <button
              className="w-full rounded-[14px] py-3.5 text-[16px] font-semibold text-white btn-press"
              style={{
                background: tier.featured
                  ? "linear-gradient(135deg, #ee9670, #c25a32)"
                  : "var(--bg-elevated)",
                border: tier.featured ? "none" : "1px solid var(--line)",
              }}
            >
              {tier.key === "free" ? "Gratis starten" : `${tier.name} kiezen`}
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-2xl px-4 py-4 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}>
        <p className="text-[12px] leading-5" style={{ color: "var(--text-3)" }}>
          Luna is geen therapeut of medische zorg. Opzegbaar wanneer je wil.
        </p>
      </div>
    </div>
  );
}