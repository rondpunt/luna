import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-dvh px-6 fade-in"
      style={{
        paddingTop: "calc(24px + env(safe-area-inset-top, 0px))",
        paddingBottom: 48,
        background: "#0B0B14",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      <div className="fixed inset-0 -z-10" style={{ background: "#0B0B14" }} />

      <button
        onClick={() => navigate(-1)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "4px 0", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}
      >
        <ArrowLeft size={20} strokeWidth={1.5} />
        <span style={{ fontSize: 14 }}>Terug</span>
      </button>

      <h1 className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 8 }}>
        Privacybeleid.
      </h1>
      <p style={{ fontSize: 13, color: "var(--text-faint)", marginBottom: 40 }}>
        Laatste update: mei 2025
      </p>

      {[
        {
          title: "Wie we zijn",
          body: "Luna is een AI-begeleidingsapp voor mentale welzijn, ontwikkeld in België. We zijn verantwoordelijk voor je gegevens onder de GDPR (Algemene Verordening Gegevensbescherming).",
        },
        {
          title: "Welke gegevens we bewaren",
          body: "We bewaren je e-mailadres, je gesprekken met Luna, je dagelijkse check-ins en stemmingsscores, en je onboardingvoorkeuren. We bewaren nooit medische dossiers, betaalgegevens (die gaan direct via Stripe), of locatiedata.",
        },
        {
          title: "Geen tracking. Geen advertenties.",
          body: "We gebruiken geen tracking pixels, geen cookies van derden, geen advertentienetwerken. Je data wordt nooit verkocht of gedeeld met derden.",
        },
        {
          title: "End-to-end versleuteling",
          body: "Al je gesprekken worden versleuteld opgeslagen. Niemand buiten Luna's beveiligde infrastructuur kan je berichten lezen — wij ook niet.",
        },
        {
          title: "Jouw GDPR-rechten",
          body: "Je hebt het recht op inzage (wat bewaren we van jou?), correctie (fout data laten aanpassen), verwijdering (alles wissen — 'Right to Disappear'), beperking van verwerking, en overdraagbaarheid van je data. Stuur een e-mail naar privacy@luna-app.be om deze rechten uit te oefenen, of gebruik de knoppen in je profiel.",
        },
        {
          title: "Bewaartermijn",
          body: "Je data blijft bewaard zolang je een actief account hebt. Na accountverwijdering worden alle gegevens binnen 30 dagen definitief gewist van onze servers.",
        },
        {
          title: "Contact",
          body: "Vragen over privacy? Stuur ons een e-mail op privacy@luna-app.be. We antwoorden binnen 5 werkdagen.",
        },
      ].map(({ title, body }) => (
        <div key={title} style={{ marginBottom: 32 }}>
          <h2 className="font-display" style={{ fontSize: 22, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 8 }}>
            {title}
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.6 }}>
            {body}
          </p>
        </div>
      ))}
    </div>
  );
}
