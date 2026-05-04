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
          className="orb-breathe h-[72px] w-[72px] rounded-full mb-8"
          style={{
            background: "radial-gradient(circle at 35% 35%, #ee9670 0%, #c25a32 55%, #7a2d14 100%)",
            boxShadow: "0 0 36px 10px rgba(194,90,50,0.28)",
          }}
        />

        <p className="text-[12.5px] font-semibold mb-3" style={{ color: "rgba(194,90,50,0.75)", letterSpacing: "-0.1px" }}>
          Emotionele steun · Belgisch-Vlaams
        </p>
        <h1 className="text-[36px] font-bold leading-[1.08] mb-4" style={{ color: "var(--text)", letterSpacing: "-0.9px" }}>
          Voel je gehoord,<br />wanneer je het<br />nodig hebt.
        </h1>
        <p className="text-[16px] leading-[1.55] mb-10" style={{ color: "var(--text-2)" }}>
          Luna luistert. Geen oordeel, geen haast. Een rustige AI-gezel voor als het zwaar is.
        </p>

        {/* Perks */}
        <div className="list-group mb-8">
          {PERKS.map(({ icon: Icon, label, sub, color }) => (
            <div key={label} className="list-row gap-3" style={{ minHeight: 64 }}>
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: `${color}14` }}
              >
                <Icon className="h-[18px] w-[18px]" style={{ color }} strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14.5px] font-semibold leading-tight" style={{ color: "var(--text)" }}>{label}</p>
                <p className="text-[12.5px] mt-1" style={{ color: "var(--text-3)" }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="space-y-2.5 pb-4">
        <Link
          to="/onboarding"
          className="block w-full rounded-[16px] h-[52px] flex items-center justify-center text-[16px] font-semibold text-white btn-press"
          style={{
            background: "#C25A32",
            boxShadow: "0 1px 0 rgba(255,255,255,0.10) inset, 0 6px 20px rgba(194,90,50,0.28)",
          }}
        >
          Gratis beginnen
        </Link>
        <Link
          to="/pricing"
          className="block w-full rounded-[16px] h-[52px] flex items-center justify-center text-[15px] font-medium btn-press"
          style={{ background: "var(--bg-card)", border: "1px solid var(--line-subtle)", color: "var(--text-2)" }}
        >
          Bekijk abonnementen
        </Link>
        <p className="text-center text-[11.5px] leading-[1.5] px-4 pt-2" style={{ color: "var(--text-3)" }}>
          Luna is geen noodhulp en geen therapeut. Bij acuut gevaar: bel 112.
        </p>
      </div>
    </div>
  );
}