import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X, Wind, Sparkles, BookOpen, Zap } from "lucide-react";
import { haptic } from "@/lib/haptics";

const TOOLS = [
  { key: "skills",    label: "Skills",      desc: "Concrete tools voor zware momenten", icon: Sparkles, to: "/skills",     color: "#F0C674" },
  { key: "braindump", label: "Brain Dump",  desc: "Gooi alles eruit — krijg structuur", icon: Wind,     to: "/brain-dump", color: "#7BC096" },
  { key: "reflex",    label: "Reflex",      desc: "Advies bij een lastige situatie",    icon: Zap,      to: "/reflex",     color: "#6A9AD9" },
  { key: "diary",     label: "Dagboek",     desc: "Korte dagelijkse check-in",          icon: BookOpen, to: "/diary",      color: "#9B7FC4" },
];

export default function ToolsMenuSheet({ open, onClose }) {
  const navigate = useNavigate();

  const go = (to) => {
    haptic.soft();
    onClose?.();
    setTimeout(() => navigate(to), 120);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60]"
            style={{ background: "rgba(45,42,58,0.40)", backdropFilter: "blur(10px)" }}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 360 }}
            className="fixed bottom-0 left-0 right-0 z-[70]"
            style={{
              background: "#FFFFFF",
              borderRadius: "32px 32px 0 0",
              padding: "20px 22px calc(36px + env(safe-area-inset-bottom, 0px))",
              maxWidth: 480, margin: "0 auto",
              border: "1px solid var(--border)",
              borderBottom: "none",
              boxShadow: "0 -20px 60px rgba(45, 42, 58, 0.18)",
            }}
          >
            <div style={{ width: 38, height: 4, borderRadius: 2, background: "#F0E6D8", margin: "0 auto 18px" }} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <p className="eyebrow" style={{ marginBottom: 4 }}>TOOLS</p>
                <h3 className="font-display-bold" style={{ fontSize: 22, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                  Wat heb je <span style={{
                    background: "linear-gradient(135deg, #F0925E, #EC6F6F)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>nu</span> nodig?
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Sluiten"
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "#FFF8F0", border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                }}
              >
                <X size={16} style={{ color: "var(--text-soft)" }} strokeWidth={2} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {TOOLS.map(({ key, label, desc, icon: Icon, to, color }) => (
                <button
                  key={key}
                  onClick={() => go(to)}
                  className="press"
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 16px",
                    background: "#FFFFFF",
                    border: `1.5px solid ${color}38`,
                    borderRadius: 18,
                    textAlign: "left", cursor: "pointer", width: "100%",
                    transition: "all 0.16s ease",
                    boxShadow: `0 2px 8px ${color}1A`,
                  }}
                >
                  <div
                    style={{
                      width: 44, height: 44, borderRadius: 14,
                      background: color, boxShadow: `0 4px 12px ${color}55`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}
                  >
                    <Icon size={20} style={{ color: "#FFFFFF" }} strokeWidth={2.2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>{label}</p>
                    <p style={{ fontSize: 12.5, color: "var(--text-soft)", lineHeight: 1.45 }}>{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}