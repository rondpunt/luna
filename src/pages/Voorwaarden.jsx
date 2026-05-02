import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const BLOCKS = [
  ["Geen therapeut", "Nora is een AI-gezel voor emotionele steun — geen therapeut, dokter of crisislijn."],
  ["Geen diagnose", "Nora stelt geen diagnoses en biedt geen medische of psychiatrische behandeling."],
  ["Veiligheid", "Bij direct gevaar contacteer je lokale noodhulp (112) of een vertrouwenspersoon."],
  ["Voor volwassenen", "Ontworpen als emotionele steun voor volwassenen (+18)."],
  ["Jouw verantwoordelijkheid", "Je beslist zelf wat je deelt. Nora slaat enkel op wat jij ingeeft."],
];

export default function Voorwaarden() {
  return (
    <div className="px-5 pt-6 pb-10 space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/profile" className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "#1c1c1e" }}>
          <ChevronLeft className="h-5 w-5 text-white" />
        </Link>
        <h1 className="text-xl font-bold text-white">Voorwaarden</h1>
      </div>

      <p className="text-sm leading-6" style={{ color: "rgba(255,255,255,0.55)" }}>
        Wat Nora wel en niet is — in gewone taal.
      </p>

      <div className="space-y-3">
        {BLOCKS.map(([title, body]) => (
          <div key={title} className="rounded-2xl px-4 py-4" style={{ background: "#1c1c1e" }}>
            <p className="text-sm font-semibold text-white mb-1">{title}</p>
            <p className="text-sm leading-5" style={{ color: "rgba(255,255,255,0.55)" }}>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}