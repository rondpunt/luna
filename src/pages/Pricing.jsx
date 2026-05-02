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
    per: "/mnd",
    note: "Voor dagelijkse steun",
    features: ["Onbeperkt babbelen", "Geheugen over gesprekken", "Volledig dagboek", "Wekelijkse inzichten"],
    featured: true,
  },
  {
    key: "pro",
    name: "Pro",
    price: "€19,99",
    per: "/mnd",
    note: "Voor diepere reflectie",
    features: ["Alles van Plus", "Diepe patronenanalyse", "Lange-termijn geheugen", "Routines"],
    featured: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-dvh px-4 pt-0 pb-10" style={{ background: "#000" }}>
      {/* Nav header */}
      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-0 py-3 mb-4"
        style={{
          background: "rgba(0,0,0,0.88)",
          backdropFilter: "saturate(180%) blur(20px)",
          borderBottom: "0.5px solid rgba(84,84,88,0.65)",
        }}
      >
        <Link
          to="/profile"
          className="flex items-center gap-1 text-[17px] font-medium"
          style={{ color: "#C25A32" }}
        >
          <ChevronLeft className="h-[22px] w-[22px]" strokeWidth={2.5} />
          Terug
        </Link>
        <span className="flex-1 text-center text-[17px] font-semibold" style={{ color: "#fff" }}>
          Abonnementen
        </span>
        <div className="w-16" />
      </div>

      {/* Hero */}
      <div className="text-center py-4 px-4 mb-4">
        <div
          className="inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-3"
          style={{ background: "rgba(194,90,50,0.20)" }}
        >
          <Gem className="h-7 w-7" style={{ color: "#C25A32" }} />
        </div>
        <p className="text-[20px] font-bold" style={{ color: "#fff" }}>Premium steun</p>
        <p className="text-[15px] mt-1" style={{ color: "rgba(235,235,245,0.50)" }}>
          Opzegbaar wanneer je wil. Geen verborgen kosten.
        </p>
      </div>

      {/* Tiers */}
      <div className="space-y-3">
        {TIERS.map((tier) => (
          <div
            key={tier.key}
            className="rounded-2xl p-5"
            style={{
              background: tier.featured ? "rgba(194,90,50,0.14)" : "#1C1C1E",
              border: tier.featured ? "0.5px solid #C25A32" : "0.5px solid rgba(84,84,88,0.65)",
            }}
          >
            {tier.featured && (
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#C25A32] mb-3">⭐ Meest gekozen</p>
            )}
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-[17px] font-semibold" style={{ color: "#fff" }}>{tier.name}</p>
              <p className="text-[28px] font-bold" style={{ color: "#fff", letterSpacing: "-0.5px" }}>
                {tier.price}
                <span className="text-[15px] font-normal" style={{ color: "rgba(235,235,245,0.45)" }}>{tier.per}</span>
              </p>
            </div>
            <p className="text-[13px] mb-4" style={{ color: "rgba(235,235,245,0.45)" }}>{tier.note}</p>
            <ul className="space-y-2 mb-4">
              {tier.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 shrink-0" style={{ color: "#C25A32" }} />
                  <span className="text-[15px]" style={{ color: "rgba(235,235,245,0.85)" }}>{f}</span>
                </li>
              ))}
            </ul>
            <button
              className="w-full rounded-xl py-3 text-[15px] font-semibold text-white"
              style={{
                background: tier.featured
                  ? "linear-gradient(135deg, #ee9670, #c25a32)"
                  : "rgba(120,120,128,0.24)",
              }}
            >
              {tier.key === "free" ? "Gratis starten" : `${tier.name} kiezen`}
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-[12px] mt-6 px-4" style={{ color: "rgba(235,235,245,0.30)" }}>
        Nora is geen noodhulp en geen medische zorg.
      </p>
    </div>
  );
}