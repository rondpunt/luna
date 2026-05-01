import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <header className="flex items-center gap-3 px-6 py-4">
        <Link to="/profiel">
          <ArrowLeft className="w-5 h-5" style={{ color: "var(--text-primary-luna)" }} />
        </Link>
        <span className="font-semibold" style={{ color: "var(--text-primary-luna)" }}>
          Privacybeleid
        </span>
      </header>

      <main className="px-6 pb-12 max-w-lg mx-auto space-y-6">
        <p className="text-xs" style={{ color: "var(--text-muted-luna)" }}>
          Leestijd: ~3 min · Laatst bijgewerkt: april 2026
        </p>

        <div className="space-y-5 text-sm leading-relaxed" style={{ color: "var(--text-secondary-luna)" }}>
          <section>
            <h2 className="font-semibold mb-2" style={{ color: "var(--text-primary-luna)" }}>Wie zijn wij</h2>
            <p>Luna is een app voor emotioneel welzijn. Contacteer ons via hello@luna.app.</p>
          </section>

          <section>
            <h2 className="font-semibold mb-2" style={{ color: "var(--text-primary-luna)" }}>Wettelijke basis</h2>
            <p>Uitvoering overeenkomst (Art. 6.1.b GDPR) voor de chatfunctie. Gerechtvaardigd belang (Art. 6.1.f) voor veiligheids- en crisisdetectie.</p>
          </section>

          <section>
            <h2 className="font-semibold mb-2" style={{ color: "var(--text-primary-luna)" }}>Welke data</h2>
            <p>Account-data (email indien account), berichten (vrije tekst), check-in scores, technische logs. Geen verkoop aan derden. Geen gebruik voor AI-training.</p>
          </section>

          <section>
            <h2 className="font-semibold mb-2" style={{ color: "var(--text-primary-luna)" }}>Servers</h2>
            <p>EU-servers, encryptie in rust en in transit, GDPR-conform.</p>
          </section>

          <section>
            <h2 className="font-semibold mb-2" style={{ color: "var(--text-primary-luna)" }}>Bewaartermijn</h2>
            <p>Zolang account actief. 30 dagen na verwijdering volledig uit backups.</p>
          </section>

          <section>
            <h2 className="font-semibold mb-2" style={{ color: "var(--text-primary-luna)" }}>Jouw rechten</h2>
            <p>Toegang, rectificatie, wissen, dataportabiliteit, bezwaar, klacht bij Belgische GBA (Gegevensbeschermingsautoriteit).</p>
          </section>

          <section>
            <h2 className="font-semibold mb-2" style={{ color: "var(--text-primary-luna)" }}>Cookies</h2>
            <p>Alleen functionele cookies (auth session). Geen tracking, geen analytics cookies.</p>
          </section>

          <section>
            <h2 className="font-semibold mb-2" style={{ color: "var(--text-primary-luna)" }}>Crisis-detectie</h2>
            <p>Bij signalen van acute nood toont Luna een steunkaart. We sturen geen automatische berichten naar derden, hulpdiensten of contactpersonen.</p>
          </section>

          <section>
            <h2 className="font-semibold mb-2" style={{ color: "var(--text-primary-luna)" }}>Contact</h2>
            <p>hello@luna.app</p>
          </section>
        </div>
      </main>
    </div>
  );
}