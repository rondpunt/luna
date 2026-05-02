import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const BLOCKS = [
  ["Geen therapeut", "Luna is een AI-gezel voor emotionele steun — geen therapeut, dokter of crisislijn."],
  ["Geen diagnose", "Luna stelt geen diagnoses en biedt geen medische of psychiatrische behandeling."],
  ["Veiligheid", "Bij direct gevaar contacteer je de lokale noodhulp (112) of de Zelfmoordlijn (1813)."],
  ["Voor volwassenen", "Ontworpen als emotionele steun voor volwassenen (+18)."],
  ["Jouw verantwoordelijkheid", "Je beslist zelf wat je deelt. Luna slaat enkel op wat jij ingeeft."],
  ["AI, geen mens", "Luna is een AI-gezel. Achter Luna zit geen menselijke operator of therapeut."],
];

export default function Voorwaarden() {
  return (
    <div className="min-h-screen px-4 py-6 space-y-6" style={{ background: "var(--bg)", paddingTop: "env(safe-area-inset-top, 44px)" }}>
      <div className="flex items-center gap-2">
        <Link to="/profile" className="flex items-center gap-1 btn-press" style={{ color: "#C25A32" }}>
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          <span className="text-[16px] font-medium">Profiel</span>
        </Link>
      </div>

      <h1 className="text-[30px] font-bold" style={{ color: "var(--text)", letterSpacing: "-0.5px" }}>Gebruiksvoorwaarden</h1>
      <p className="text-[16px] leading-[1.6]" style={{ color: "var(--text-2)" }}>
        Wat Luna wel en niet is — in gewone taal.
      </p>

      <div className="list-group">
        {BLOCKS.map(([title, body]) => (
          <div key={title} className="list-row flex-col items-start gap-1.5 py-4">
            <p className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>{title}</p>
            <p className="text-[14px] leading-[1.55]" style={{ color: "var(--text-2)" }}>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}