import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X, Wind, Sparkles, BookOpen, Zap } from "lucide-react";
import { haptic } from "@/lib/haptics";

const TOOLS = [
  { key: "skills",    label: "Skills",      desc: "Concrete tools voor zware momenten", icon: Sparkles, to: "/skills",     color: "#D4AF89" },
  { key: "braindump", label: "Brain Dump",  desc: "Gooi alles eruit — krijg structuur", icon: Wind,     to: "/brain-dump", color: "#9FAAC9" },
  { key: "reflex",    label: "Reflex",      desc: "Advies bij een lastige situatie",    icon: Zap,      to: "/reflex",     color: "#B89572" },
  { key: "diary",     label: "Dagboek",     desc: "Korte dagelijkse check-in",          icon: BookOpen, to: "/diary",      color: "#8A9482" },
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
            style={{ background: "rgba(0,0,0,0.62)", backdropFilter: "blur(14px)" }}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 360 }}
            className="fixed bottom-0 left-0 right-0 z-[70]"
            style={{
              background: "linear-gradient(180deg, #1B1525, #15101D)",
              borderRadius: "32px 32px 0 0",
              padding: "20px 22px calc(36px + env(safe-area-inset-bottom, 0px))",
              maxWidth: 480, margin: "0 auto",
              border: "1px solid rgba(242,237,228,0.07)",
              borderBottom: "none",
              boxShadow: "0 -30px 80px rgba(0,0,0,0.55)",
            }}
          >
            <div style={{ width: 38, height: 4, borderRadius: 2, background: "rgba(242,237,228,0.14)", margin: "0 auto 18px" }} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <p className="eyebrow" style={{ marginBottom: 4 }}>TOOLS</p>
                <h3 className="font-display" style={{ fontSize: 24, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                  Wat heb je <span className="font-display-italic" style={{ color: "#D4AF89" }}>nu</span> nodig?
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Sluiten"
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(242,237,228,0.04)", border: "1px solid rgba(242,237,228,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                }}
              >
                <X size={16} style={{ color: "var(--text-muted)" }} strokeWidth={1.6} />
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
                    background: "rgba(242,237,228,0.025)",
                    border: "1px solid rgba(242,237,228,0.06)",
                    borderRadius: 18,
                    textAlign: "left", cursor: "pointer", width: "100%",
                    transition: "all 0.16s ease",
                  }}
                >
                  <div
                    style={{
                      width: 42, height: 42, borderRadius: 13,
                      background: `${color}1F`, border: `1px solid ${color}38`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}
                  >
                    <Icon size={18} style={{ color }} strokeWidth={1.7} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>{label}</p>
                    <p style={{ fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.45 }}>{desc}</p>
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