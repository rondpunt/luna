import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Zap, Wind, ArrowUpRight } from "lucide-react";

const MODES = [
  {
    key: "chat",
    label: "Gesprek",
    desc: "Praat vrijuit. 66 luistert zonder oordeel.",
    icon: MessageCircle,
    to: "/chat",
    gradient: "linear-gradient(155deg, #2A1F38 0%, #1A1424 100%)",
    accent: "#D4AF89",
  },
  {
    key: "reflex",
    label: "Reflex",
    desc: "Wat zeg of doe ik nu? Twee zinnen, geen therapie.",
    icon: Zap,
    to: "/reflex",
    gradient: "linear-gradient(155deg, #2D2218 0%, #1C1610 100%)",
    accent: "#E8C9A3",
  },
  {
    key: "dump",
    label: "Brain Dump",
    desc: "Gooi alles eruit. 66 structureert het.",
    icon: Wind,
    to: "/chat?mode=brain_dump",
    gradient: "linear-gradient(155deg, #1F2030 0%, #131421 100%)",
    accent: "#9FAAC9",
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
        {MODES.map(({ key, label, desc, icon: ModeIcon, to, gradient, accent }, i) => (
          <motion.button
            key={key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => navigate(to)}
            className="press"
            style={{
              flex: "0 0 224px", scrollSnapAlign: "start",
              padding: "22px 20px 24px", borderRadius: 26,
              background: gradient,
              border: `1px solid ${accent}22`,
              textAlign: "left", cursor: "pointer",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              minHeight: 172, position: "relative", overflow: "hidden",
              boxShadow: `0 14px 36px ${accent}12`,
            }}
          >
            <div style={{
              position: "absolute", top: -30, right: -30,
              width: 120, height: 120, borderRadius: "50%",
              background: `radial-gradient(circle, ${accent}1A, transparent 70%)`,
              pointerEvents: "none",
            }} />
            <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{
                width: 42, height: 42, borderRadius: 13,
                background: `${accent}1A`, border: `1px solid ${accent}33`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <ModeIcon size={18} style={{ color: accent }} strokeWidth={1.7} />
              </div>
              <ArrowUpRight size={16} style={{ color: "var(--text-muted)" }} strokeWidth={1.5} />
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <p className="font-display" style={{ fontSize: 24, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 6, lineHeight: 1.1 }}>
                {label}
              </p>
              <p style={{ fontSize: 12.5, color: "var(--text-soft)", lineHeight: 1.5 }}>{desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}