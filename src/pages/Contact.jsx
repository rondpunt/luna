import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="fade-in px-5" style={{ paddingTop: "calc(28px + env(safe-area-inset-top, 0px))", paddingBottom: 40, minHeight: "100dvh", background: "var(--bg)" }}>
      <button onClick={() => navigate(-1)} className="press" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", padding: "4px 0", marginBottom: 24 }}>
        <ArrowLeft size={18} strokeWidth={1.5} />
        <span style={{ fontSize: 14 }}>Terug</span>
      </button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.05 }}>
          Contact.
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 32, lineHeight: 1.6 }}>
          Vragen, feedback of een probleem melden? We lezen alles.
        </p>

        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 24, display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(232,131,74,0.1)", border: "1px solid rgba(232,131,74,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Mail size={18} style={{ color: "#E8834A" }} strokeWidth={1.8} />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>E-mail</p>
            <a href="mailto:hallo@luna-app.be" style={{ fontSize: 14, color: "#E8834A", textDecoration: "none" }}>
              hallo@luna-app.be
            </a>
          </div>
        </div>

        <p style={{ fontSize: 13, color: "var(--text-faint)", textAlign: "center", marginBottom: 40 }}>
          We proberen binnen 48 uur te antwoorden.
        </p>

        <div style={{ padding: "20px", background: "rgba(201,64,64,0.06)", border: "1px solid rgba(201,64,64,0.2)", borderRadius: 20 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <AlertTriangle size={18} style={{ color: "var(--crisis)", marginTop: 2, flexShrink: 0 }} strokeWidth={2} />
            <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6 }}>
              <span style={{ color: "var(--crisis)", fontWeight: 600 }}>Nood of crisis?</span> Luna is geen crisislijn. <br/>Bel 1813 (Zelfmoordlijn) of 106 (Tele-Onthaal). Bij direct gevaar: bel 112.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}