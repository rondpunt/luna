import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const BLOCKS = [
  ["Wat bewaren we?", "Babbels, dagboeknotities, check-ins en optionele herinneringen die je expliciet bewaart. Nooit meer dan nodig."],
  ["Waarom?", "Om de app te laten werken, je steun persoonlijker te maken en continuïteit te bieden over de tijd."],
  ["Jouw controle", "Je kunt data exporteren, geheugen uitzetten, herinneringen wissen en je account volledig verwijderen — altijd."],
  ["Geen noodhulp", "Nora is geen crisisinterventie, geen medische zorg en geen vervanger voor een professionele hulpverlener."],
  ["EU-servers", "Alle data wordt opgeslagen op servers binnen de Europese Unie, conform de GDPR."],
];

export default function Privacy() {
  return (
    <div className="px-5 pt-6 pb-10 space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/profile" className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "#1c1c1e" }}>
          <ChevronLeft className="h-5 w-5 text-white" />
        </Link>
        <h1 className="text-xl font-bold text-white">Privacybeleid</h1>
      </div>

      <p className="text-sm leading-6" style={{ color: "rgba(255,255,255,0.55)" }}>
        Heldere taal over wat Nora bewaart en waarom.
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