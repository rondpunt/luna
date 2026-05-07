import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const TERMS = [
  { title: "1. Geen medisch advies", body: "Luna is een tool voor zelfhulp en zelfinzicht. Het is absoluut geen vervanging voor een arts, psycholoog of crisisdienst." },
  { title: "2. Privacy & Data", body: "We verkopen je data nooit. Jouw gesprekken en dagboeknotities zijn versleuteld en alleen voor jou (en Luna's AI-systeem) toegankelijk." },
  { title: "3. Aansprakelijkheid", body: "Het gebruik van Luna is op eigen risico. We kunnen niet aansprakelijk gesteld worden voor beslissingen die je neemt op basis van gesprekken met de app." },
  { title: "4. Leeftijd", body: "Je moet minimaal 16 jaar zijn om Luna te gebruiken, tenzij je toestemming hebt van een ouder/voogd." },
];

export default function Voorwaarden() {
  const navigate = useNavigate();

  return (
    <div className="fade-in px-5" style={{ paddingTop: "calc(28px + env(safe-area-inset-top, 0px))", paddingBottom: 40, minHeight: "100dvh", background: "var(--bg)" }}>
      <button onClick={() => navigate(-1)} className="press" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", padding: "4px 0", marginBottom: 24 }}>
        <ArrowLeft size={18} strokeWidth={1.5} />
        <span style={{ fontSize: 14 }}>Terug</span>
      </button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.05 }}>
          Voorwaarden.
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 32 }}>Laatst aangepast: Mei 2026</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {TERMS.map((term, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 20, padding: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>{term.title}</h3>
              <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>{term.body}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}