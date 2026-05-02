import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const sections = [
  {
    title: "Wat we verzamelen",
    text: "E-mailadres (bij registratie), chatberichten, stemmingscores en gebruik-statistieken. Anoniem gebruik is mogelijk zonder e-mailadres.",
  },
  {
    title: "Wettelijke basis (GDPR)",
    text: "Toestemming voor chatgegevens. Gerechtvaardigd belang voor technische logbestanden. Contractuele noodzaak voor accountgegevens.",
  },
  {
    title: "Beveiliging",
    text: "EU-servers. Encryptie in rust en in transit. Toegang afgeschermd per account via RLS. Ondersteuningstoegang enkel via gedocumenteerde break-glass procedure.",
  },
  {
    title: "Bewaartermijn",
    text: "Chatberichten: tot jij ze wist of je account verwijdert. Technische logs: max 90 dagen.",
  },
  {
    title: "Jouw rechten",
    text: "Inzage, correctie, wissing, overdraagbaarheid. Stuur een mail naar hello@luna.app.",
  },
  {
    title: "Cookies",
    text: "Alleen functionele cookies voor sessies. Geen tracking, geen advertenties.",
  },
  {
    title: "Crisisdetectie",
    text: "Luna detecteert bepaalde zoekwoorden om steunbronnen te tonen. Dit is geen medische monitoring. Ga bij acute nood naar 0800 32 123 of 112.",
  },
];

export default function Privacy() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "radial-gradient(ellipse at 80% -10%, rgba(180,120,20,0.12), transparent 50%), radial-gradient(ellipse at 50% -5%, rgba(79,70,229,0.10), transparent 45%), #080d1e",
      }}
    >
      <header className="flex items-center gap-3 px-5 py-4">
        <Link to="/profiel">
          <ArrowLeft className="w-5 h-5" style={{ color: "rgba(255,255,255,0.55)" }} />
        </Link>
        <span
          className="font-semibold text-sm"
          style={{ color: "rgba(255,255,255,0.88)", fontFamily: "'DM Sans', sans-serif" }}
        >
          Privacybeleid
        </span>
      </header>

      <main className="px-5 pb-12 max-w-lg mx-auto">
        <p className="text-xs mb-6" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans', sans-serif" }}>
          Laatst bijgewerkt: mei 2026
        </p>
        <div className="space-y-6">
          {sections.map(({ title, text }) => (
            <div key={title}>
              <h2
                className="text-sm font-semibold mb-1.5"
                style={{ color: "rgba(255,255,255,0.88)", fontFamily: "'DM Sans', sans-serif" }}
              >
                {title}
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.50)", fontFamily: "'DM Sans', sans-serif" }}
              >
                {text}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}