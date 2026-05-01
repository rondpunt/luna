import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Voorwaarden() {
  return (
    <div className="min-h-screen py-8 px-6" style={{ backgroundColor: "var(--luna-bg-base)" }}>
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <ArrowLeft className="w-4 h-4" style={{ color: "var(--luna-text-muted)" }} />
          <span className="text-sm" style={{ color: "var(--luna-text-muted)" }}>Terug</span>
        </Link>

        <h1 className="text-2xl font-semibold mb-2" style={{ color: "var(--luna-text-primary)" }}>
          Algemene Voorwaarden
        </h1>
        <p className="text-xs mb-8" style={{ color: "var(--luna-text-muted)" }}>
          Laatst bijgewerkt: mei 2026
        </p>

        <div className="space-y-6 text-sm leading-relaxed" style={{ color: "var(--luna-text-secondary)" }}>
          <Section title="Wat Luna niet kan">
            Luna stelt geen diagnoses, geeft geen medicatie-advies, biedt geen crisis-interventie en verricht geen klinische beoordelingen. Luna is een gezel, geen therapeut.
          </Section>

          <Section title="Bij acuut gevaar">
            Bel 112 of Zelfmoordlijn 1813 (24/7, gratis, anoniem). Voor minderjarigen: Awel 102. Voor Brussel-Frans: 0800 32 123, Télé-Accueil 107.
          </Section>

          <Section title="AI-gebruik">
            Luna is een AI-systeem. Je praat met een taalmodel, geen mens. We doen ons best om Luna veilig te maken maar fouten kunnen voorkomen.
          </Section>

          <Section title="Leeftijd">
            Luna is bedoeld voor gebruikers van 16 jaar en ouder.
          </Section>

          <Section title="Gebruik">
            Gebruik Luna voor jezelf. Niet om anderen te schaden.
          </Section>

          <Section title="Prijzen">
            Personal Pro kost €9,99/maand of €79/jaar. Geen verborgen kosten. 14 dagen terugbetaling.
          </Section>

          <Section title="Toepasselijk recht">
            Belgisch recht. Bevoegde rechtbank: Nederlandstalige rechtbank van Brussel.
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-base font-semibold mb-2" style={{ color: "var(--luna-text-primary)" }}>
        {title}
      </h2>
      <p>{children}</p>
    </div>
  );
}