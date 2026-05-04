import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";

export default function Contact() {
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
        Contact.
      </h1>
      <p style={{ fontSize: 16, color: "var(--text-muted)", marginBottom: 40, lineHeight: 1.55 }}>
        Vragen, feedback of een probleem melden? We lezen alles.
      </p>

      <div className="surface" style={{ padding: 24, display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(232,131,74,0.08)", border: "1px solid rgba(232,131,74,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Mail size={18} style={{ color: "#E8834A" }} strokeWidth={1.5} />
        </div>
        <div>
          <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>E-mail</p>
          <a href="mailto:hallo@luna-app.be" style={{ fontSize: 14, color: "#E8834A", textDecoration: "none" }}>
            hallo@luna-app.be
          </a>
        </div>
      </div>

      <p style={{ fontSize: 13, color: "var(--text-faint)", marginTop: 24, textAlign: "center" }}>
        We antwoorden binnen 2 werkdagen.
      </p>

      <div style={{ marginTop: 48, padding: "20px", background: "var(--crisis-soft)", border: "1px solid var(--crisis-border)", borderRadius: 20 }}>
        <p style={{ fontSize: 13, color: "#D14D4D", lineHeight: 1.55 }}>
          <strong>Nood?</strong> Luna is geen crisislijn. Bel 1813 (Zelfmoordlijn) of 106 (Tele-Onthaal). Bij direct gevaar: bel 112.
        </p>
      </div>
    </div>
  );
}
