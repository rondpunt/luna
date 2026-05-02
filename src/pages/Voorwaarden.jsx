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
    <div className="min-h-screen px-4 py-6 space-y-6" style={{ background: "#000", paddingTop: "env(safe-area-inset-top, 44px)" }}>
      <div className="flex items-center gap-2">
        <Link to="/profile" className="flex items-center gap-1" style={{ color: "#FF6B3D" }}>
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          <span className="text-[17px] font-medium">Profiel</span>
        </Link>
      </div>

      <h1 className="text-[34px] font-bold text-white">Voorwaarden</h1>
      <p className="text-[17px] leading-[1.5]" style={{ color: "rgba(235,235,245,0.55)" }}>Wat Nora wel en niet is — in gewone taal.</p>

      <div className="overflow-hidden rounded-2xl" style={{ background: "#1C1C1E" }}>
        {BLOCKS.map(([title, body], i) => (
          <div key={title} className="px-4 py-4" style={{ borderTop: i > 0 ? "0.5px solid rgba(84,84,88,0.45)" : "none" }}>
            <p className="text-[15px] font-semibold text-white mb-1">{title}</p>
            <p className="text-[15px] leading-[1.5]" style={{ color: "rgba(235,235,245,0.55)" }}>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}