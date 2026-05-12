import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Zap, Wind, ArrowUpRight } from "lucide-react";

const MODES = [
  {
    key: "chat",
    label: "Open gesprek",
    desc: "Praat vrijuit. 66 luistert zonder oordeel.",
    icon: MessageCircle,
    to: "/chat",
    gradient: "linear-gradient(145deg, #2D1A0E 0%, #1A0E08 100%)",
    accent: "#E8834A",
  },
  {
    key: "reflex",
    label: "Reflex",
    desc: "Wat zeg of doe ik nu? Twee zinnen, geen therapie.",
    icon: Zap,
    to: "/reflex",
    gradient: "linear-gradient(145deg, #2D2418 0%, #1A1610 100%)",
    accent: "#E8B14A",
  },
  {
    key: "dump",
    label: "Brain Dump",
    desc: "Gooi alles eruit. 66 structureert het.",
    icon: Wind,
    to: "/chat?mode=brain_dump",
    gradient: "linear-gradient(145deg, #1A1D2E 0%, #0E1018 100%)",
    accent: "#7B9FE8",
  },
];

export default function ModeCarousel() {
  const navigate = useNavigate();
  return (
    <div style={{ marginLeft: -20, marginRight: -20 }}>
      <div style={{
        display: "flex", gap: 12, overflowX: "auto", scrollSnapType: "x mandatory",
        padding: "0 20px 4px", scrollbarWidth: "none",
      }}>
        {MODES.map(({ key, label, desc, icon: Icon, to, gradient, accent }, i) => (
          <motion.button
            key={key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => navigate(to)}
            className="press"
            style={{
              flex: "0 0 220px", scrollSnapAlign: "start",
              padding: "22px 20px 24px", borderRadius: 24,
              background: gradient,
              border: `1px solid ${accent}22`,
              textAlign: "left", cursor: "pointer",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              minHeight: 168, position: "relative", overflow: "hidden",
              boxShadow: `0 12px 32px ${accent}14`,
            }}
          >
            <div style={{
              position: "absolute", top: -30, right: -30,
              width: 110, height: 110, borderRadius: "50%",
              background: `radial-gradient(circle, ${accent}1F, transparent 70%)`,
              pointerEvents: "none",
            }} />
            <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: `${accent}1A`, border: `1px solid ${accent}33`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={18} style={{ color: accent }} strokeWidth={1.8} />
              </div>
              <ArrowUpRight size={16} style={{ color: "var(--text-muted)" }} strokeWidth={1.5} />
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <p className="font-display" style={{ fontSize: 22, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 6, lineHeight: 1.1 }}>
                {label}
              </p>
              <p style={{ fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.45 }}>{desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}