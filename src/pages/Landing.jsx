import { Link } from "react-router-dom";
import { Shield, Zap, Lock } from "lucide-react";

const PERKS = [
  { icon: Zap,    label: "Altijd beschikbaar",    sub: "Dag en nacht, geen wachtlijst",        color: "#F5A623" },
  { icon: Lock,   label: "Volledig privé",         sub: "Geen reclame, geen datadeling",        color: "#34C77B" },
  { icon: Shield, label: "Belgisch · EU-servers",  sub: "GDPR-conform, data blijft in Europa",  color: "#4A9EFF" },
];

export default function Landing() {
  return (
    <div
      className="min-h-screen flex flex-col px-5"
      style={{
        background: "var(--bg)",
        paddingTop: "env(safe-area-inset-top, 44px)",
        paddingBottom: "env(safe-area-inset-bottom, 34px)",
      }}
    >
      {/* Nav */}
      <div className="flex items-center justify-between py-5">
        <div className="flex items-center gap-2.5">
          <div
            className="h-8 w-8 rounded-full"
            style={{
              background: "radial-gradient(circle at 35% 35%, #ee9670 0%, #c25a32 55%, #7a2d14 100%)",
              boxShadow: "0 0 16px 4px rgba(194,90,50,0.30)",
            }}
          />
          <span className="text-[17px] font-semibold tracking-tight" style={{ color: "var(--text)", letterSpacing: "-0.2px" }}>Luna</span>
        </div>
        <Link to="/pricing" className="text-[14px] font-semibold" style={{ color: "#C25A32" }}>Abonnementen</Link>
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col justify-center py-8">
        <div
          className="h-20 w-20 rounded-[26px] mb-8"
          style={{
            background: "radial-gradient(circle at 35% 35%, #ee9670 0%, #c25a32 55%, #7a2d14 100%)",
            boxShadow: "0 16px 56px rgba(194,90,50,0.40)",
          }}
        />

        <p className="text-[13px] font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(194,90,50,0.70)" }}>
          Emotionele steun · Belgisch-Vlaams
        </p>
        <h1 className="text-[38px] font-bold leading-[1.08] mb-5" style={{ color: "var(--text)", letterSpacing: "-1px" }}>
          Voel je gehoord,<br />wanneer je het<br />nodig hebt.
        </h1>
        <p className="text-[17px] leading-[1.6] mb-10" style={{ color: "var(--text-2)" }}>
          Luna luistert. Geen oordeel, geen haast. Een rustige AI-gezel voor als het zwaar is.
        </p>

        {/* Perks */}
        <div className="list-group mb-8">
          {PERKS.map(({ icon: Icon, label, sub, color }, i) => (
            <div key={label} className="list-row gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: `${color}18` }}>
                <Icon className="h-[18px] w-[18px]" style={{ color }} strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>{label}</p>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--text-2)" }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="space-y-3 pb-4">
        <Link
          to="/onboarding"
          className="block w-full rounded-2xl py-4 text-center text-[17px] font-semibold text-white btn-press"
          style={{
            background: "linear-gradient(135deg, #ee9670, #c25a32)",
            boxShadow: "0 8px 28px rgba(194,90,50,0.35)",
          }}
        >
          Gratis beginnen
        </Link>
        <Link
          to="/pricing"
          className="block w-full rounded-2xl py-4 text-center text-[16px] font-medium btn-press"
          style={{ background: "var(--bg-card)", border: "1px solid var(--line)", color: "var(--text-2)" }}
        >
          Bekijk abonnementen
        </Link>
        <p className="text-center text-[12px] leading-5 px-4" style={{ color: "var(--text-3)" }}>
          Luna is geen noodhulp en geen therapeut. Bij acuut gevaar: bel 112 of 1813.
        </p>
      </div>
    </div>
  );
}