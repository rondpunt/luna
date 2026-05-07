import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="fade-in px-5" style={{ paddingTop: "calc(28px + env(safe-area-inset-top, 0px))", paddingBottom: 40, minHeight: "100dvh", background: "var(--bg)" }}>
      <button onClick={() => navigate(-1)} className="press" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", padding: "4px 0", marginBottom: 24 }}>
        <ArrowLeft size={18} strokeWidth={1.5} />
        <span style={{ fontSize: 14 }}>Terug</span>
      </button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.05 }}>
          Privacybeleid.
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 32 }}>
          Helder en zonder kleine lettertjes.
        </p>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 20, background: "rgba(107,173,138,0.08)", border: "1px solid rgba(107,173,138,0.2)", borderRadius: 20, marginBottom: 24 }}>
          <Shield size={20} style={{ color: "#6BAD8A", flexShrink: 0, marginTop: 2 }} strokeWidth={2} />
          <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6 }}>
            Jouw data is van jou. Wij verkopen geen gegevens, tonen geen advertenties en delen niets met derden zonder jouw expliciete toestemming.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { title: "Welke data we verzamelen", body: "Alleen wat nodig is om Luna te laten werken: je e-mail, je chatberichten (zodat Luna context heeft), je dagboek-invoer en check-ins." },
            { title: "Hoe de AI werkt", body: "Jouw berichten worden verwerkt door taalmodellen om Luna's antwoorden te genereren. Ze worden NIET gebruikt om deze modellen openbaar te trainen." },
            { title: "Verwijderen van data", body: "Als je je account wist, wissen wij álles onmiddellijk en onherroepelijk uit onze database." },
          ].map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 20, padding: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}