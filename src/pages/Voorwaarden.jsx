import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Voorwaarden() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <header className="flex items-center gap-3 px-6 py-4">
        <Link to="/profiel">
          <ArrowLeft className="w-5 h-5" style={{ color: "var(--text-primary-luna)" }} />
        </Link>
        <span className="font-semibold" style={{ color: "var(--text-primary-luna)" }}>
          Voorwaarden
        </span>
      </header>

      <main className="px-6 pb-12 max-w-lg mx-auto space-y-6">
        <p className="text-xs" style={{ color: "var(--text-muted-luna)" }}>
          Laatst bijgewerkt: april 2026
        </p>

        <div className="space-y-5 text-sm leading-relaxed" style={{ color: "var(--text-secondary-luna)" }}>
          <section>
            <h2 className="font-semibold mb-2" style={{ color: "var(--text-primary-luna)" }}>Wat Luna niet kan</h2>
            <p>Luna stelt geen diagnoses, geeft geen medicatie-advies, vervangt geen therapeut of arts, en voert geen klinische beoordelingen uit. Luna is een AI voor emotioneel welzijn en gezelschap, geen medisch hulpmiddel.</p>
          </section>

          <section>
            <h2 className="font-semibold mb-2" style={{ color: "var(--text-primary-luna)" }}>Bij acuut gevaar</h2>
            <p>Bel 112 of Zelfmoordlijn 1813 (24/7, gratis, anoniem). Voor minderjarigen: Awel 102.</p>
          </section>

          <section>
            <h2 className="font-semibold mb-2" style={{ color: "var(--text-primary-luna)" }}>AI-gebruik</h2>
            <p>Luna is een AI-systeem. Je praat met een taalmodel, geen mens. We doen ons best om Luna veilig te maken maar fouten kunnen voorkomen.</p>
          </section>

          <section>
            <h2 className="font-semibold mb-2" style={{ color: "var(--text-primary-luna)" }}>Leeftijd</h2>
            <p>Luna is bedoeld voor personen van 16 jaar en ouder.</p>
          </section>

          <section>
            <h2 className="font-semibold mb-2" style={{ color: "var(--text-primary-luna)" }}>Gebruik</h2>
            <p>Gebruik Luna voor jezelf, niet om anderen te schaden.</p>
          </section>

          <section>
            <h2 className="font-semibold mb-2" style={{ color: "var(--text-primary-luna)" }}>Toepasselijk recht</h2>
            <p>Belgisch recht. Bevoegde rechtbank: Nederlandstalige rechtbank van Brussel.</p>
          </section>
        </div>
      </main>
    </div>
  );
}