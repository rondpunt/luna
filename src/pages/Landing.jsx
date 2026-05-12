import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const FEATURES = [
  { label: "Praat vrijuit", desc: "Geen oordeel. Geen suggesties tenzij je wilt." },
  { label: "Reflex", desc: "Concreet advies bij moeilijke situaties." },
  { label: "Brain Dump", desc: "Gooi het eruit. 66 structureert." },
];

export default function Landing() {
  const navigate = useNavigate();
  const handleLogin = () => base44.auth.redirectToLogin(window.location.origin + "/home");

  return (
    <div className="min-h-dvh flex flex-col items-center relative overflow-hidden px-6"
      style={{ background: "#080810" }}>
      {/* Ambient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 90% 60% at 50% -5%, rgba(232,131,74,0.09), transparent 65%)",
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 60% 50% at 80% 60%, rgba(164,107,168,0.04), transparent 65%)",
        }} />
      </div>

      <div className="w-full max-w-[480px] flex flex-col items-center">
        <div style={{ flex: "0 0 22vh" }} />

        {/* 66 wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display"
          style={{ fontSize: 128, color: "#E8834A", letterSpacing: "-0.04em", lineHeight: 1, filter: "drop-shadow(0 0 32px rgba(232,131,74,0.25))" }}
        >
          66
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-center"
          style={{ fontSize: 44, color: "#F0EBE1", letterSpacing: "-0.025em", lineHeight: 1.05, marginTop: 32 }}
        >
          Een plek om door<br/>het zware te komen.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
          style={{ fontSize: 17, color: "#7A7268", marginTop: 14, lineHeight: 1.6, maxWidth: 280 }}
        >
          Een rustige plek om te voelen, te denken, te zijn.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", gap: 8, marginTop: 32, flexWrap: "wrap", justifyContent: "center" }}
        >
          {FEATURES.map((f) => (
            <div key={f.label} style={{
              padding: "8px 14px", borderRadius: 20,
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.055)",
              display: "flex", alignItems: "center", gap: 7,
            }}>
              <span style={{ fontSize: 12, color: "#7A7268", fontWeight: 500 }}>{f.label}</span>
            </div>
          ))}
        </motion.div>

        <div style={{ flex: 1, minHeight: 40 }} />

        {/* CTA group */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
          style={{ maxWidth: 320, paddingBottom: "calc(48px + env(safe-area-inset-bottom, 0px))" }}
        >
          <button
            onClick={() => navigate("/onboarding")}
            className="btn btn-primary press"
            style={{ fontSize: 16, fontWeight: 500 }}
          >
            Begin gratis
            <ArrowRight size={16} strokeWidth={2} />
          </button>

          <button
            onClick={handleLogin}
            className="btn btn-ghost press"
            style={{ fontSize: 15, marginTop: 10, gap: 10 }}
          >
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#F0EBE1", color: "#11131A", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>G</span>
            Verder met Google of e-mail
          </button>

          <div style={{ marginTop: 20, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Sparkles size={13} style={{ color: "#E8834A" }} strokeWidth={1.8} />
            <button
              onClick={() => navigate("/pricing")}
              style={{ fontSize: 13, color: "#7A7268", background: "none", border: "none", cursor: "pointer" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#E8834A"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#7A7268"}
            >
              Bekijk 66 Plus
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}