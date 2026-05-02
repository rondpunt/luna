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
    name: "Plus",
    price: "€9,99",
    per: "/mnd",
    note: "Voor dagelijkse steun",
    features: ["Onbeperkt babbelen", "Geheugen", "Volledig dagboek", "Wekelijkse inzichten"],
    featured: true,
  },
  {
    key: "pro",
    name: "Pro",
    price: "€19,99",
    per: "/mnd",
    note: "Diepere reflectie",
    features: ["Alles van Plus", "Langetermijn geheugen", "Patronenanalyse", "Routines"],
    featured: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen px-4 py-6 space-y-6" style={{ background: "#000", paddingTop: "env(safe-area-inset-top, 44px)" }}>
      {/* Back nav */}
      <div className="flex items-center gap-2 mb-2">
        <Link to="/profile" className="flex items-center gap-1" style={{ color: "#FF6B3D" }}>
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          <span className="text-[17px] font-medium">Profiel</span>
        </Link>
      </div>

      <h1 className="text-[34px] font-bold text-white">Abonnementen</h1>

      <div className="space-y-3">
        {TIERS.map((tier) => (
          <div
            key={tier.key}
            className="rounded-2xl p-5"
            style={{
              background: tier.featured ? "rgba(255,107,61,0.12)" : "#1C1C1E",
              border: tier.featured ? "0.5px solid rgba(255,107,61,0.55)" : "0.5px solid rgba(84,84,88,0.45)",
            }}
          >
            {tier.featured && (
              <p className="text-[13px] font-bold uppercase tracking-wider mb-3" style={{ color: "#FF6B3D" }}>
                Meest gekozen
              </p>
            )}
            <div className="flex items-baseline justify-between mb-1">
              <p className="text-[20px] font-bold text-white">{tier.name}</p>
              <p className="text-[28px] font-bold text-white">
                {tier.price}
                <span className="text-[15px] font-normal" style={{ color: "rgba(235,235,245,0.50)" }}>{tier.per}</span>
              </p>
            </div>
            <p className="text-[13px] mb-4" style={{ color: "rgba(235,235,245,0.50)" }}>{tier.note}</p>
            <div className="space-y-2 mb-5">
              {tier.features.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <Check className="h-4 w-4 shrink-0" style={{ color: "#FF6B3D" }} strokeWidth={2.5} />
                  <span className="text-[15px] text-white">{f}</span>
                </div>
              ))}
            </div>
            <button
              className="w-full rounded-[14px] py-3.5 text-[17px] font-semibold text-white"
              style={{
                background: tier.featured
                  ? "linear-gradient(135deg, #FF8C60, #FF6B3D)"
                  : "rgba(120,120,128,0.24)",
              }}
            >
              {tier.key === "free" ? "Gratis starten" : `${tier.name} kiezen`}
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-2xl px-4 py-4 text-center" style={{ background: "#1C1C1E" }}>
        <p className="text-[13px] leading-5" style={{ color: "rgba(235,235,245,0.45)" }}>
          Nora is geen noodhulp en geen medische zorg. Opzegbaar op elk moment.
        </p>
      </div>
    </div>
  );
}