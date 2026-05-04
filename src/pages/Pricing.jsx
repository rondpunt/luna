import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Orb } from "@/components/luna/Orb";

const FREE_FEATURES = [
  "10 berichten per dag",
  "Dagelijkse check-ins",
  "Luna's aanwezigheid",
];

const PRO_FEATURES = [
  "Onbeperkt berichten",
  "Volledige gespreksgeschiedenis",
  "Voortgangsgrafiek (alle data)",
  "Geheugen over gesprekken heen",
  "Prioriteit bij nieuwe functies",
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-dvh px-6 fade-in"
      style={{
        paddingTop: "calc(48px + env(safe-area-inset-top, 0px))",
        paddingBottom: 48,
        background: "#0B0B14",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      {/* Ambient */}
      <div className="fixed inset-0 -z-10" style={{ background: "#0B0B14" }}>
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(232,131,74,0.08), transparent 60%)",
          opacity: 0.6,
        }} />
      </div>

      {/* Header */}
      <div className="text-center" style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <Orb size="md" />
        </div>
        <h1 className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em" }}>
          Luna Plus.
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-muted)", marginTop: 8 }}>
          Voor wie hier vaker wil zijn.
        </p>
      </div>

      {/* Free card */}
      <div className="surface" style={{ padding: 24, marginBottom: 16 }}>
        <p className="eyebrow-muted" style={{ marginBottom: 12 }}>GRATIS</p>
        <p className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em" }}>
          €0
        </p>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4, marginBottom: 20 }}>
          Altijd gratis. Geen creditcard.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {FREE_FEATURES.map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Check size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} strokeWidth={1.5} />
              <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{f}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate("/")}
          className="btn btn-ghost press"
          style={{ fontSize: 14 }}
        >
          Blijf gratis
        </button>
      </div>

      {/* Pro card */}
      <div
        style={{
          background: "rgba(232,131,74,0.05)",
          border: "1px solid rgba(232,131,74,0.25)",
          borderRadius: 24,
          padding: 24,
          marginBottom: 32,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <p className="eyebrow" style={{ marginBottom: 0 }}>LUNA PLUS</p>
          <span style={{
            fontSize: 11, fontWeight: 500, color: "#E8834A",
            background: "rgba(232,131,74,0.10)",
            border: "1px solid rgba(232,131,74,0.25)",
            padding: "3px 10px", borderRadius: 999,
          }}>
            Aanbevolen
          </span>
        </div>
        <p className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em" }}>
          €9,99
        </p>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4, marginBottom: 20 }}>
          Per maand. Maandelijks opzegbaar.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {PRO_FEATURES.map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Check size={16} style={{ color: "#E8834A", flexShrink: 0 }} strokeWidth={2} />
              <span style={{ fontSize: 14, color: "var(--text)" }}>{f}</span>
            </div>
          ))}
        </div>
        <button
          className="btn btn-primary press"
          style={{ fontSize: 15 }}
          onClick={() => alert("Stripe checkout — binnenkort beschikbaar.")}
        >
          Upgrade naar Luna Plus
        </button>
        <p style={{ fontSize: 12, color: "var(--text-faint)", textAlign: "center", marginTop: 8 }}>
          Veilig betalen via Stripe. Geen verrassingen.
        </p>
      </div>

      {/* Bottom note */}
      <p style={{ fontSize: 13, color: "var(--text-faint)", textAlign: "center" }}>
        Luna is geen vervanging voor professionele hulp.<br />
        Bij crisis: bel 1813 of 106.
      </p>
    </div>
  );
}
