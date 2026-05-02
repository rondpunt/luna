import { Link } from "react-router-dom";
import { Shield, Clock, MessageCircle } from "lucide-react";

const PERKS = [
  { icon: MessageCircle, text: "Altijd beschikbaar, dag en nacht" },
  { icon: Shield, text: "Privé — geen reclame, geen datadeling" },
  { icon: Clock, text: "Geen wachtlijst, geen formulieren" },
];

export default function Landing() {
  return (
    <div className="min-h-dvh flex flex-col px-5 py-8" style={{ background: "#000" }}>
      {/* Logo */}
      <div className="flex items-center gap-2 mb-14">
        <div
          className="h-8 w-8 rounded-[10px] flex items-center justify-center text-[14px] font-bold text-white"
          style={{ background: "linear-gradient(135deg, #ee9670, #c25a32)" }}
        >
          N
        </div>
        <span className="text-[17px] font-semibold" style={{ color: "#fff" }}>Nora</span>
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col justify-center">
        <p
          className="text-[13px] font-semibold uppercase tracking-wider mb-4"
          style={{ color: "rgba(235,235,245,0.40)" }}
        >
          Emotionele steun · Belgisch-Nederlands
        </p>
        <h1
          className="text-[40px] font-bold leading-[1.1] mb-4"
          style={{ color: "#fff", letterSpacing: "-0.8px" }}
        >
          Voel je gehoord,<br />wanneer je het<br />nodig hebt.
        </h1>
        <p
          className="text-[17px] leading-6 mb-10"
          style={{ color: "rgba(235,235,245,0.55)" }}
        >
          Nora luistert. Geen oordeel, geen haast.
        </p>

        <div className="space-y-3.5 mb-10">
          {PERKS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "rgba(194,90,50,0.20)" }}
              >
                <Icon className="h-4 w-4" style={{ color: "#C25A32" }} />
              </div>
              <span className="text-[15px]" style={{ color: "rgba(235,235,245,0.85)" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs — iOS big button style */}
      <div className="space-y-3 max-w-sm mx-auto w-full">
        <Link
          to="/onboarding"
          className="block w-full rounded-2xl py-4 text-center text-[17px] font-semibold text-white"
          style={{
            background: "linear-gradient(135deg, #ee9670, #c25a32)",
            boxShadow: "0 8px 24px rgba(194,90,50,0.35)",
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
        <p
          className="text-center text-[12px] leading-5 px-4 pt-1"
          style={{ color: "rgba(235,235,245,0.28)" }}
        >
          Nora is geen noodhulp. Bij acuut gevaar bel 112.
        </p>
      </div>
    </div>
  );
}