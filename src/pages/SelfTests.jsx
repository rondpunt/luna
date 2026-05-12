import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Sparkles, FileText, TrendingUp, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { useFeatureVisibility } from "@/hooks/useFeatureVisibility";

const TESTS = [
  { name: "PHQ-9", area: "Depressieve klachten", description: "Veelgebruikte screening voor depressieve symptomen in de voorbije twee weken.", url: "https://www.phqscreeners.com/select-screener" },
  { name: "GAD-7", area: "Angst", description: "Korte screening voor gegeneraliseerde angstklachten.", url: "https://www.phqscreeners.com/select-screener" },
  { name: "DASS-21", area: "Depressie, angst en stress", description: "Meet drie stressgerelateerde domeinen tegelijk, handig als klachten door elkaar lopen.", url: "https://maic.qld.gov.au/wp-content/uploads/2016/07/DASS-21.pdf" },
  { name: "K10", area: "Psychische spanning", description: "Algemene maat voor psychische belasting en distress.", url: "https://www.worksafe.qld.gov.au/__data/assets/pdf_file/0010/22240/kessler-psychological-distress-scale-k101.pdf" },
  { name: "ASRS v1.1", area: "ADHD bij volwassenen", description: "WHO-screening voor volwassen ADHD-symptomen.", url: "https://www.hcp.med.harvard.edu/ncs/ftpdir/adhd/6Q_ASRS_English.pdf" },
  { name: "PCL-5", area: "PTSS", description: "Screening voor posttraumatische stressklachten volgens DSM-5-symptomen.", url: "https://www.ptsd.va.gov/professional/assessment/adult-sr/ptsd-checklist.asp" },
];

export default function SelfTests() {
  const navigate = useNavigate();
  const { showPremium } = useFeatureVisibility();

  const handleLogin = () => base44.auth.redirectToLogin(window.location.href);

  return (
    <div className="fade-in px-5" style={{ paddingTop: "calc(28px + env(safe-area-inset-top, 0px))", paddingBottom: 40 }}>
      <button onClick={() => navigate(-1)} className="press" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 0", marginBottom: 24, display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)" }}>
        <ArrowLeft size={18} strokeWidth={1.5} />
        <span style={{ fontSize: 14 }}>Terug</span>
      </button>

      <div style={{ marginBottom: 28 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>ZELFTESTEN</p>
        <h1 className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
          Screenings, geen diagnoses.
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-muted)", marginTop: 10, lineHeight: 1.6 }}>
          Deze links helpen patronen herkennen. Bespreek opvallende scores altijd met een arts of psycholoog.
        </p>
      </div>

      {showPremium && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          style={{
            padding: 24, marginBottom: 24, borderRadius: 24,
            background: "linear-gradient(145deg, rgba(61,42,77,0.35), rgba(212,175,137,0.04))",
            border: "1px solid rgba(212,175,137,0.22)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(212,175,137,0.14)", border: "1px solid rgba(212,175,137,0.28)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Lock size={16} style={{ color: "#D4AF89" }} strokeWidth={2} />
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: 2 }}>UITGEBREID</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Extra functionaliteit</p>
            </div>
          </div>
          <h2 className="font-display" style={{ fontSize: 28, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 12 }}>
            Meer dan alleen een link.
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 20 }}>
            Scores opgeslagen, zachte AI-duiding, trends over tijd en een export voor je therapeut.
          </p>
          <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
            {[
              { icon: Sparkles, text: "AI-uitleg zonder diagnose-taal" },
              { icon: TrendingUp, text: "Verloop en patronen per test" },
              { icon: FileText, text: "PDF-bundel voor therapie" },
            ].map((item) => (
              <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text)", fontSize: 14 }}>
                <item.icon size={16} style={{ color: "#D4AF89", flexShrink: 0 }} strokeWidth={1.8} />
                {item.text}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={() => navigate("/pricing")} className="btn btn-primary press" style={{ height: 48, fontSize: 15 }}>Bekijk opties</button>
            <button onClick={handleLogin} className="btn btn-ghost press" style={{ height: 48, fontSize: 14, gap: 10 }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#F0EBE1", color: "#11131A", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12 }}>G</span>
              Verder met Google of e-mail
            </button>
          </div>
        </motion.div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {TESTS.map((test, idx) => (
          <motion.a
            key={test.name}
            href={test.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.05, duration: 0.4 }}
            className="press"
            style={{
              display: "flex", flexDirection: "column", gap: 8, padding: 20,
              background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 20, textDecoration: "none", transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.025)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="font-display" style={{ fontSize: 22, color: "var(--text)" }}>{test.name}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#A46BA8", background: "rgba(164,107,168,0.15)", padding: "2px 8px", borderRadius: 12 }}>{test.area}</span>
              </div>
              <ExternalLink size={16} style={{ color: "var(--text-faint)" }} strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{test.description}</p>
          </motion.a>
        ))}
      </div>
    </div>
  );
}