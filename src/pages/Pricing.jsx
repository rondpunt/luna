import { useNavigate } from "react-router-dom";
import { Check, Sparkles, ArrowLeft, Zap } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Orb } from "@/components/luna/Orb";
import { motion } from "framer-motion";

const FREE_FEATURES = [
  "10 berichten per dag",
  "Dagelijkse check-ins",
  "Diary card",
  "Luna's aanwezigheid",
];

const PRO_FEATURES = [
  "Onbeperkt berichten",
  "Volledige gespreksgeschiedenis",
  "Voortgangsgrafiek (alle data)",
  "Geheugen over gesprekken heen",
  "AI-duiding bij zelftesten",
  "PDF-export voor therapie",
  "Prioriteit bij nieuwe functies",
];

export default function Pricing() {
  const navigate = useNavigate();
  const handleLogin = () => base44.auth.redirectToLogin(window.location.origin + "/pricing");

  return (
    <div className="min-h-dvh" style={{ background: "#080810", position: "relative", overflow: "hidden" }}>
      {/* Ambient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(232,131,74,0.07), transparent 60%)",
        }} />
      </div>

      <div className="mx-auto px-5" style={{ maxWidth: 480, paddingTop: "calc(24px + env(safe-area-inset-top, 0px))", paddingBottom: 48 }}>
        {/* Back */}
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", padding: "4px 0", marginBottom: 32 }}>
          <ArrowLeft size={17} strokeWidth={1.5} />
          <span style={{ fontSize: 14 }}>Terug</span>
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center" style={{ marginBottom: 40 }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <Orb size="md" />
          </div>
          <h1 className="font-display" style={{ fontSize: 40, color: "var(--text)", letterSpacing: "-0.025em", lineHeight: 1 }}>
            Luna Plus.
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-muted)", marginTop: 10 }}>Voor wie hier vaker wil zijn.</p>
        </motion.div>

        {/* Free card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.055)",
            borderRadius: 22, padding: "22px 22px 20px", marginBottom: 12,
          }}
        >
          <p className="eyebrow-muted" style={{ marginBottom: 10 }}>GRATIS</p>
          <p className="font-display" style={{ fontSize: 38, color: "var(--text)", letterSpacing: "-0.03em" }}>€0</p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4, marginBottom: 18 }}>Altijd gratis. Geen creditcard.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {FREE_FEATURES.map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Check size={10} style={{ color: "var(--text-muted)" }} strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{f}</span>
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/")} className="btn btn-ghost press" style={{ fontSize: 14, height: 44 }}>Blijf gratis</button>
        </motion.div>

        {/* Plus card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: "linear-gradient(145deg, rgba(232,131,74,0.09), rgba(232,131,74,0.03))",
            border: "1px solid rgba(232,131,74,0.25)",
            borderRadius: 22, padding: "22px 22px 20px", marginBottom: 24,
            position: "relative", overflow: "hidden",
          }}
        >
          {/* Glow */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,131,74,0.15), transparent 70%)", pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <p className="eyebrow" style={{ marginBottom: 0 }}>LUNA PLUS</p>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#E8834A", background: "rgba(232,131,74,0.10)", border: "1px solid rgba(232,131,74,0.22)", padding: "3px 10px", borderRadius: 999 }}>
              Aanbevolen
            </span>
          </div>
          <p className="font-display" style={{ fontSize: 38, color: "var(--text)", letterSpacing: "-0.03em" }}>€9,99</p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4, marginBottom: 18 }}>Per maand. Maandelijks opzegbaar.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
            {PRO_FEATURES.map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(232,131,74,0.12)", border: "1px solid rgba(232,131,74,0.28)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Check size={10} style={{ color: "#E8834A" }} strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: 14, color: "var(--text)" }}>{f}</span>
              </div>
            ))}
          </div>

          <button className="btn btn-primary press" style={{ fontSize: 15, marginBottom: 10 }} onClick={handleLogin}>
            <Zap size={15} strokeWidth={2} />
            Start met Luna Plus
          </button>
          <button onClick={handleLogin} className="btn btn-ghost press" style={{ fontSize: 15, gap: 10 }}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#F0EBE1", color: "#11131A", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>G</span>
            Verder met Google of e-mail
          </button>
          <p style={{ fontSize: 12, color: "var(--text-faint)", textAlign: "center", marginTop: 10 }}>
            Eerst aanmelden, daarna activeer je de checkout.
          </p>
        </motion.div>

        <p style={{ fontSize: 13, color: "var(--text-faint)", textAlign: "center", lineHeight: 1.6 }}>
          Luna is geen vervanging voor professionele hulp.<br />
          Bij crisis: bel 1813 of 106.
        </p>
      </div>
    </div>
  );
}