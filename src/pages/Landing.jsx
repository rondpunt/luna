import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Zap, Wind } from "lucide-react";
import JunieLogo from "@/components/brand/JunieLogo";

const FEATURES = [
  { label: "Praat vrijuit",  icon: MessageCircle, color: "#6A9AD9" },
  { label: "Reflex",         icon: Zap,           color: "#F0C674" },
  { label: "Brain Dump",     icon: Wind,          color: "#7BC096" },
];

export default function Landing() {
  const navigate = useNavigate();
  const handleLogin = () => base44.auth.redirectToLogin(window.location.origin + "/home");

  return (
    <div className="min-h-dvh flex flex-col items-center relative overflow-hidden px-6"
      style={{ background: "#FFFBF7" }}>
      {/* Junie rainbow ambient */}
      <div className="fixed inset-0 -z-10">
        <div className="junie-blob" style={{ top: -100, right: -60, width: 320, height: 320, background: "#F0925E", opacity: 0.45 }} />
        <div className="junie-blob" style={{ top: 200, left: -80, width: 280, height: 280, background: "#6A9AD9", opacity: 0.35 }} />
        <div className="junie-blob" style={{ bottom: 100, right: 20, width: 240, height: 240, background: "#7BC096", opacity: 0.32 }} />
        <div className="junie-blob" style={{ bottom: -60, left: "30%", width: 260, height: 260, background: "#EC6F6F", opacity: 0.3 }} />
      </div>

      <div className="w-full max-w-[480px] flex flex-col items-center">
        <div style={{ flex: "0 0 14vh" }} />

        {/* Junie logo */}
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="float-y"
        >
          <JunieLogo variant="full" size={120} showTagline={true} />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display-bold text-center"
          style={{ fontSize: 36, color: "#2D2A3A", letterSpacing: "-0.025em", lineHeight: 1.1, marginTop: 36 }}
        >
          Een warme plek voor<br/>
          <span style={{
            background: "linear-gradient(135deg, #6A9AD9, #7BC096, #F0C674, #EC6F6F)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            jouw gedachten
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
          style={{ fontSize: 16, color: "#5A546B", marginTop: 14, lineHeight: 1.6, maxWidth: 300 }}
        >
          Junie luistert. Geen oordeel, gewoon een vriendelijk gesprek wanneer jij dat nodig hebt.
        </motion.p>

        {/* Feature pills with icons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", gap: 8, marginTop: 32, flexWrap: "wrap", justifyContent: "center" }}
        >
          {FEATURES.map(({ label, icon: Icon, color }) => (
            <div key={label} style={{
              padding: "8px 14px", borderRadius: 20,
              background: "#FFFFFF",
              border: `1.5px solid ${color}38`,
              display: "flex", alignItems: "center", gap: 7,
              boxShadow: `0 2px 8px ${color}22`,
            }}>
              <Icon size={13} style={{ color }} strokeWidth={2.2} />
              <span style={{ fontSize: 12.5, color: "#5A546B", fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </motion.div>

        <div style={{ flex: 1, minHeight: 40 }} />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
          style={{ maxWidth: 320, paddingBottom: "calc(40px + env(safe-area-inset-bottom, 0px))" }}
        >
          <button
            onClick={() => navigate("/onboarding")}
            className="btn btn-primary press"
            style={{ fontSize: 16, fontWeight: 600 }}
          >
            Begin gratis
            <ArrowRight size={16} strokeWidth={2.4} />
          </button>

          <button
            onClick={handleLogin}
            className="btn btn-ghost press"
            style={{ fontSize: 15, marginTop: 10, gap: 10 }}
          >
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#FFFFFF", color: "#11131A", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0, border: "1.5px solid #F0E6D8" }}>G</span>
            Verder met Google of e-mail
          </button>
        </motion.div>
      </div>
    </div>
  );
}