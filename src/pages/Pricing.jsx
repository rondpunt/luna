import { Link } from "react-router-dom";
import { Check, ChevronLeft, Gem } from "lucide-react";

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
    name: "Plus",
    price: "€9,99",
    per: "/maand",
    note: "Voor dagelijkse steun",
    features: ["Onbeperkt babbelen", "Geheugen over gesprekken", "Volledig dagboek", "Wekelijkse inzichten"],
    featured: true,
  },
  {
    key: "pro",
    name: "Pro",
    price: "€19,99",
    per: "/maand",
    note: "Voor diepere reflectie",
    features: ["Alles van Plus", "Diepe patronenanalyse", "Lange-termijn geheugen", "Routines"],
    featured: false,
  },
];

export default function Pricing() {
  return (
    <div className="px-5 pt-6 pb-10 space-y-6" style={{ background: "#000", minHeight: "100vh" }}>
      <div className="flex items-center gap-3">
        <Link to="/profile" className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "#1c1c1e" }}>
          <ChevronLeft className="h-5 w-5 text-white" />
        </Link>
        <h1 className="text-xl font-bold text-white">Abonnementen</h1>
      </div>

      <div className="text-center py-2">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl mb-3" style={{ background: "rgba(194,90,50,0.20)" }}>
          <Gem className="h-7 w-7 text-[#c25a32]" />
        </div>
        <p className="text-base font-semibold text-white">Premium steun, duidelijk geprijsd</p>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.50)" }}>Opzegbaar wanneer je wil. Geen verborgen kosten.</p>
      </div>

      <div className="space-y-3">
        {TIERS.map((tier) => (
          <div
            key={tier.key}
            className="rounded-2xl p-5"
            style={{
              background: tier.featured ? "rgba(194,90,50,0.15)" : "#1c1c1e",
              border: tier.featured ? "1px solid #c25a32" : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {tier.featured && (
              <p className="text-xs font-bold uppercase tracking-widest text-[#c25a32] mb-3">Meest gekozen</p>
            )}
            <div className="flex items-baseline justify-between mb-3">
              <p className="text-base font-bold text-white">{tier.name}</p>
              <p className="text-2xl font-bold text-white">
                {tier.price}
                <span className="text-sm font-normal" style={{ color: "rgba(255,255,255,0.50)" }}>{tier.per}</span>
              </p>
            </div>
            <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>{tier.note}</p>
            <ul className="space-y-2 mb-4">
              {tier.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-white">
                  <Check className="h-4 w-4 text-[#c25a32] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all"
              style={{
                background: tier.featured
                  ? "linear-gradient(135deg, #ee9670, #c25a32)"
                  : "#2c2c2e",
              }}
            >
              {tier.key === "free" ? "Gratis starten" : `${tier.name} kiezen`}
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-2xl px-4 py-4 text-center" style={{ background: "#1c1c1e" }}>
        <p className="text-xs leading-5" style={{ color: "rgba(255,255,255,0.45)" }}>
          Nora is geen noodhulp en geen medische zorg.
        </p>
      </div>
    </div>
  );
}