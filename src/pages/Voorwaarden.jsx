import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Voorwaarden() {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-dvh px-6 fade-in"
      style={{ paddingTop: "calc(24px + env(safe-area-inset-top, 0px))", paddingBottom: 48, background: "#0B0B14", maxWidth: 480, margin: "0 auto" }}
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
        Algemene voorwaarden.
      </h1>
      <p style={{ fontSize: 13, color: "var(--text-faint)", marginBottom: 40 }}>Laatste update: mei 2025</p>
      {[
        { title: "Gebruik van de app", body: "Luna is bedoeld als een tool voor emotionele ondersteuning. Luna is geen medisch hulpmiddel, geen therapeut, en geen vervanging voor professionele geestelijke gezondheidszorg." },
        { title: "Geen medisch advies", body: "Niets in Luna mag worden beschouwd als medisch, psychologisch of therapeutisch advies. Bij psychiatrische noodgevallen, bel 112 of ga naar de dichtstbijzijnde spoedafdeling." },
        { title: "Abonnement", body: "Luna Plus kost €9,99 per maand. Je kan maandelijks opzeggen. Na opzegging heb je toegang tot het einde van de betaalperiode." },
        { title: "Minimumleeftijd", body: "Luna is beschikbaar voor gebruikers van 16 jaar en ouder." },
        { title: "Beschikbaarheid", body: "We streven naar maximale uptime maar kunnen geen garanties geven. We zijn niet aansprakelijk voor schade door tijdelijke onbeschikbaarheid." },
      ].map(({ title, body }) => (
        <div key={title} style={{ marginBottom: 32 }}>
          <h2 className="font-display" style={{ fontSize: 22, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 8 }}>{title}</h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.6 }}>{body}</p>
        </div>
      ))}
    </div>
  );
}
