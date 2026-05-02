import { Link } from "react-router-dom";
import { Shield, Clock, MessageCircle } from "lucide-react";

const PERKS = [
  { icon: MessageCircle, text: "Altijd beschikbaar, dag en nacht" },
  { icon: Shield, text: "Privé — geen reclame, geen datadeling" },
  { icon: Clock, text: "Geen wachtlijst, geen formulieren" },
];

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col px-6 py-10" style={{ background: "#000" }}>
      {/* Logo */}
      <div className="flex items-center gap-2 mb-16">
        <div
          className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ background: "linear-gradient(135deg, #ee9670, #c25a32)" }}
        >
          N
        </div>
        <span className="text-base font-semibold text-white">Nora</span>
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col justify-center max-w-sm">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.40)" }}>
          Emotionele steun · Belgisch-Nederlands
        </p>
        <h1 className="text-4xl font-bold text-white leading-tight mb-4">
          Voel je gehoord,<br />wanneer je het<br />nodig hebt.
        </h1>
        <p className="text-base leading-6 mb-10" style={{ color: "rgba(255,255,255,0.55)" }}>
          Nora luistert. Geen oordeel, geen haast. Een rustige plek om je gedachten kwijt te kunnen.
        </p>

        <div className="space-y-3 mb-10">
          {PERKS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(194,90,50,0.20)" }}>
                <Icon className="h-4 w-4 text-[#c25a32]" />
              </div>
              <span className="text-sm text-white">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="space-y-3 max-w-sm">
        <Link
          to="/onboarding"
          className="block w-full rounded-2xl py-4 text-center text-base font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #ee9670, #c25a32)", boxShadow: "0 8px 24px rgba(194,90,50,0.35)" }}
        >
          Gratis beginnen
        </Link>
        <Link
          to="/pricing"
          className="block w-full rounded-2xl py-4 text-center text-sm font-medium"
          style={{ background: "#1c1c1e", color: "rgba(255,255,255,0.70)" }}
        >
          Bekijk abonnementen
        </Link>
        <p className="text-center text-xs leading-5 px-4" style={{ color: "rgba(255,255,255,0.30)" }}>
          Nora is geen noodhulp. Bij acuut gevaar bel 112.
        </p>
      </div>
    </div>
  );
}