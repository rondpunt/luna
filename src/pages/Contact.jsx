import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
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

        <div style={{ background: "rgba(242,237,228,0.025)", border: "1px solid rgba(242,237,228,0.06)", borderRadius: 20, padding: 24, display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(212,175,137,0.12)", border: "1px solid rgba(212,175,137,0.24)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Mail size={18} style={{ color: "#D4AF89" }} strokeWidth={1.8} />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>E-mail</p>
            <a href="mailto:hallo@66-app.be" style={{ fontSize: 14, color: "#D4AF89", textDecoration: "none" }}>
              hallo@66-app.be
            </a>
          </div>
        </div>

        <p style={{ fontSize: 13, color: "var(--text-faint)", textAlign: "center", marginBottom: 40 }}>
          We proberen binnen 48 uur te antwoorden.
        </p>
      </motion.div>
    </div>
  );
}