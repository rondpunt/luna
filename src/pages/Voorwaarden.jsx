import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const sections = [
  { title: "Wat Luna niet kan", text: "Luna stelt geen diagnoses, geeft geen medicatie-advies, vervangt geen therapeut of arts, en voert geen klinische beoordelingen uit. Luna is een AI voor emotioneel welzijn en gezelschap, geen medisch hulpmiddel." },
  { title: "Bij acuut gevaar", text: "Bel 112 of Zelfmoordlijn 0800 32 123 (24/7, gratis, anoniem). Voor minderjarigen: Awel 102." },
  { title: "AI-gebruik", text: "Luna is een AI-systeem. Je praat met een taalmodel, geen mens. We doen ons best om Luna veilig te maken maar fouten kunnen voorkomen." },
  { title: "Leeftijd", text: "Luna is bedoeld voor personen van 16 jaar en ouder." },
  { title: "Gebruik", text: "Gebruik Luna voor jezelf, niet om anderen te schaden." },
  { title: "Toepasselijk recht", text: "Belgisch recht. Bevoegde rechtbank: Nederlandstalige rechtbank van Brussel." },
];

export default function Voorwaarden() {
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
          Voorwaarden
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