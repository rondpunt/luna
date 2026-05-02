import { Link } from "react-router-dom";
import { Shield, Zap, Lock } from "lucide-react";

const PERKS = [
  { icon: Zap, label: "Altijd beschikbaar", sub: "Dag en nacht, geen wachtlijst", color: "#FF9F0A" },
  { icon: Lock, label: "Volledig privé", sub: "Geen reclame, geen datadeling", color: "#30D158" },
  { icon: Shield, label: "Belgisch · EU-servers", sub: "GDPR-conform, data blijft in EU", color: "#0A84FF" },
];

export default function Landing() {
  return (
    <div
      className="min-h-screen flex flex-col px-5"
      style={{
        background: "#000",
        paddingTop: "env(safe-area-inset-top, 44px)",
        paddingBottom: "env(safe-area-inset-bottom, 34px)",
      }}
    >
      {/* Nav */}
      <div className="flex items-center justify-between py-5">
        <div className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #FF8C60, #FF6B3D)" }}
          >
            N
          </div>
          <span className="text-[17px] font-semibold text-white">Nora</span>
        </div>
        <Link to="/pricing" className="text-[15px] font-medium" style={{ color: "#FF6B3D" }}>Abonnementen</Link>
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col justify-center py-8">
        {/* Orb / logo */}
        <div
          className="h-24 w-24 rounded-[28px] flex items-center justify-center text-4xl font-black text-white mb-8"
          style={{
            background: "linear-gradient(135deg, #FF8C60 0%, #FF6B3D 50%, #C23A1A 100%)",
            boxShadow: "0 20px 60px rgba(255,107,61,0.40)",
          }}
        >
          N
        </div>

        <p className="text-[15px] font-semibold mb-3" style={{ color: "rgba(235,235,245,0.50)" }}>
          Emotionele steun · Belgisch-Nederlands
        </p>
        <h1 className="text-[40px] font-bold text-white leading-[1.1] mb-5">
          Voel je gehoord,<br />wanneer je het<br />nodig hebt.
        </h1>
        <p className="text-[17px] leading-[1.5] mb-10" style={{ color: "rgba(235,235,245,0.60)" }}>
          Nora luistert. Geen oordeel, geen haast. Een rustige AI-gezel voor als het zwaar is.
        </p>

        {/* Perks */}
        <div className="overflow-hidden rounded-2xl mb-8" style={{ background: "#1C1C1E" }}>
          {PERKS.map(({ icon: Icon, label, sub, color }, i) => (
            <div
              key={label}
              className="flex items-center gap-4 px-4 py-3.5"
              style={{ borderTop: i > 0 ? "0.5px solid rgba(84,84,88,0.45)" : "none" }}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]" style={{ background: `${color}25` }}>
                <Icon className="h-[18px] w-[18px]" style={{ color }} strokeWidth={2} />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-white leading-tight">{label}</p>
                <p className="text-[13px] mt-0.5" style={{ color: "rgba(235,235,245,0.50)" }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="space-y-3 pb-4">
        <Link
          to="/onboarding"
          className="block w-full rounded-2xl py-4 text-center text-[17px] font-semibold text-white"
          style={{
            background: "linear-gradient(135deg, #FF8C60, #FF6B3D)",
            boxShadow: "0 8px 24px rgba(255,107,61,0.40)",
          }}
        >
          Gratis beginnen
        </Link>
        <Link
          to="/pricing"
          className="block w-full rounded-2xl py-4 text-center text-[17px] font-medium"
          style={{ background: "#1C1C1E", color: "rgba(235,235,245,0.75)" }}
        >
          Bekijk abonnementen
        </Link>
        <p className="text-center text-[13px] leading-5 px-4" style={{ color: "rgba(235,235,245,0.30)" }}>
          Nora is geen noodhulp. Bij acuut gevaar bel 112.
        </p>
      </div>
    </div>
  );
}