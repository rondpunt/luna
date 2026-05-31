import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Zap, Wind, ArrowUpRight } from "lucide-react";

const MODES = [
  {
    key: "chat",
    label: "Gesprek",
    desc: "Praat vrijuit met Junie. Een vriendelijk oor.",
    icon: MessageCircle,
    to: "/chat",
    bg: "linear-gradient(160deg, #EEF3FB 0%, #FFFFFF 100%)",
    accent: "#6A9AD9",
  },
  {
    key: "reflex",
    label: "Reflex",
    desc: "Wat zeg of doe ik nu? Snel advies.",
    icon: Zap,
    to: "/reflex",
    bg: "linear-gradient(160deg, #FFF8E8 0%, #FFFFFF 100%)",
    accent: "#F0C674",
  },
  {
    key: "dump",
    label: "Brain Dump",
    desc: "Gooi alles eruit. Junie structureert.",
    icon: Wind,
    to: "/brain-dump",
    bg: "linear-gradient(160deg, #EEF8F1 0%, #FFFFFF 100%)",
    accent: "#7BC096",
  },
];

export default function ModeCarousel() {
  const navigate = useNavigate();
  return (
    <div style={{ marginLeft: -20, marginRight: -20 }}>
      <div style={{
        display: "flex", gap: 12, overflowX: "auto", scrollSnapType: "x mandatory",
        padding: "0 20px 6px", scrollbarWidth: "none",
      }}>
        {MODES.map(({ key, label, desc, icon: ModeIcon, to, bg, accent }, i) => (
          <motion.button
            key={key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => navigate(to)}
            className="press"
            style={{
              flex: "0 0 224px", scrollSnapAlign: "start",
              padding: "20px 20px 22px", borderRadius: 22,
              background: bg,
              border: `1.5px solid ${accent}38`,
              textAlign: "left", cursor: "pointer",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              minHeight: 168, position: "relative", overflow: "hidden",
              boxShadow: `0 8px 24px ${accent}1A, 0 1px 3px rgba(45,42,58,0.04)`,
            }}
          >
            <div style={{
              position: "absolute", top: -30, right: -30,
              width: 110, height: 110, borderRadius: "50%",
              background: `radial-gradient(circle, ${accent}38, transparent 70%)`,
              pointerEvents: "none", filter: "blur(8px)",
            }} />
            <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: accent, boxShadow: `0 4px 12px ${accent}48`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <ModeIcon size={20} style={{ color: "#FFFFFF" }} strokeWidth={2.2} />
              </div>
              <ArrowUpRight size={16} style={{ color: accent }} strokeWidth={2} />
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <p className="font-display-bold" style={{ fontSize: 22, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 6, lineHeight: 1.1 }}>
                {label}
              </p>
              <p style={{ fontSize: 12.5, color: "var(--text-soft)", lineHeight: 1.45 }}>{desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}