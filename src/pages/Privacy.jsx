import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const BLOCKS = [
  ["Wat bewaren we?", "Gesprekken, dagboeknotities, check-ins en herinneringen die je expliciet bewaart. Nooit meer dan nodig."],
  ["Waarom?", "Om Luna te laten werken, steun persoonlijker te maken en continuïteit te bieden doorheen de tijd."],
  ["Jouw controle", "Je kunt data exporteren, geheugen uitzetten, herinneringen wissen en je account volledig verwijderen — altijd."],
  ["Geen noodhulp", "Luna is geen crisisinterventie, geen medische zorg en geen vervanging voor een professionele hulpverlener."],
  ["EU-servers", "Alle data wordt opgeslagen op servers binnen de Europese Unie, conform de GDPR."],
];

export default function Privacy() {
  return (
    <div className="min-h-screen px-4 py-6 space-y-6" style={{ background: "var(--bg)", paddingTop: "env(safe-area-inset-top, 44px)" }}>
      <div className="flex items-center gap-2">
        <Link to="/profile" className="flex items-center gap-1 btn-press" style={{ color: "#C25A32" }}>
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          <span className="text-[16px] font-medium">Profiel</span>
        </Link>
      </div>

      <h1 className="text-[30px] font-bold" style={{ color: "var(--text)", letterSpacing: "-0.5px" }}>Privacybeleid</h1>
      <p className="text-[16px] leading-[1.6]" style={{ color: "var(--text-2)" }}>
        Klare taal over wat Luna bewaart en waarom.
      </p>

      <div className="list-group">
        {BLOCKS.map(([title, body], i) => (
          <div key={title} className="list-row flex-col items-start gap-1.5 py-4">
            <p className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>{title}</p>
            <p className="text-[14px] leading-[1.55]" style={{ color: "var(--text-2)" }}>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}