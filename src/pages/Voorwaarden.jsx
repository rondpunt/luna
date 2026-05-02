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
    <div className="min-h-dvh px-4 pt-0 pb-10" style={{ background: "#000" }}>
      <div
        className="sticky top-0 z-10 flex items-center gap-3 py-3 mb-6"
        style={{
          background: "rgba(0,0,0,0.88)",
          backdropFilter: "saturate(180%) blur(20px)",
          borderBottom: "0.5px solid rgba(84,84,88,0.65)",
        }}
      >
        <Link to="/profile" className="flex items-center gap-1 text-[17px] font-medium" style={{ color: "#C25A32" }}>
          <ChevronLeft className="h-[22px] w-[22px]" strokeWidth={2.5} />
          Profiel
        </Link>
        <span className="flex-1 text-center text-[17px] font-semibold" style={{ color: "#fff" }}>Voorwaarden</span>
        <div className="w-16" />
      </div>

      <div className="ios-list">
        {BLOCKS.map(({ 0: title, 1: body }) => (
          <div key={title} className="ios-list-row flex-col items-start gap-1 py-4">
            <p className="text-[15px] font-semibold" style={{ color: "#fff" }}>{title}</p>
            <p className="text-[13px] leading-5" style={{ color: "rgba(235,235,245,0.55)" }}>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}