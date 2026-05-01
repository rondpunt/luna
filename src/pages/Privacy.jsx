import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen py-8 px-6" style={{ backgroundColor: "var(--luna-bg-base)" }}>
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <ArrowLeft className="w-4 h-4" style={{ color: "var(--luna-text-muted)" }} />
          <span className="text-sm" style={{ color: "var(--luna-text-muted)" }}>Terug</span>
        </Link>

        <h1 className="text-2xl font-semibold mb-2" style={{ color: "var(--luna-text-primary)" }}>
          Privacybeleid
        </h1>
        <p className="text-xs mb-8" style={{ color: "var(--luna-text-muted)" }}>
          Laatst bijgewerkt: mei 2026 · Leestijd: 5 min
        </p>

        <div className="space-y-6 text-sm leading-relaxed" style={{ color: "var(--luna-text-secondary)" }}>
          <Section title="Wie zijn wij">
            Luna is een product gericht op emotioneel welzijn. Luna is geen zorgaanbieder en biedt geen diagnoses of behandelingen aan. Contact: hello@luna.app.
          </Section>

          <Section title="Wettelijke basis">
            We verwerken je gegevens op basis van de uitvoering van de overeenkomst (Art. 6.1.b GDPR). Voor crisis-detectie beroepen we ons op gerechtvaardigd belang (Art. 6.1.f) en vitaal belang (Art. 9.2.c) waar van toepassing.
          </Section>

          <Section title="Welke data">
            Account-data (e-mail indien account), berichten (vrije tekst), check-in scores, en technische logs. Bij anoniem gebruik: alleen een toestel-ID.
          </Section>

          <Section title="Geen verkoop, geen AI-training">
            We verkopen je data niet aan derden. We gebruiken je gesprekken niet om AI-modellen te trainen.
          </Section>

          <Section title="Servers">
            Alle data wordt opgeslagen op EU-servers met encryptie in rust en in transit.
          </Section>

          <Section title="Bewaartermijn">
            Data wordt bewaard zolang je account actief is. Na verwijdering: volledig gewist binnen 30 dagen, inclusief uit backups.
          </Section>

          <Section title="Jouw rechten">
            Je hebt recht op toegang, rectificatie, wissen, dataportabiliteit en bezwaar. Je kunt een klacht indienen bij de Belgische GBA. Gebruik Profiel → Je data om te exporteren of te wissen.
          </Section>

          <Section title="Cookies">
            Luna gebruikt alleen functionele cookies (auth-sessie). Geen tracking, geen analytics-cookies.
          </Section>

          <Section title="Crisis-detectie">
            Bij signalen van acute nood toont Luna een steunkaart. We sturen geen automatische berichten naar derden, hulpdiensten of contactpersonen.
          </Section>

          <Section title="Contact">
            hello@luna.app
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