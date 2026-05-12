import { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function SkillsInfoTooltip() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        aria-label="Wat zijn skills?"
        className="press"
        style={{
          width: 28, height: 28, borderRadius: "50%",
          background: "rgba(242,237,228,0.05)",
          border: "1px solid rgba(242,237,228,0.10)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", flexShrink: 0,
        }}
      >
        <HelpCircle size={14} style={{ color: "var(--text-muted)" }} strokeWidth={1.7} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60]"
              style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
            />
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="fixed z-[70] left-1/2 -translate-x-1/2"
              style={{
                top: "30vh", width: "calc(100% - 40px)", maxWidth: 360,
                background: "linear-gradient(160deg, #1F1828, #15101D)",
                border: "1px solid rgba(212,175,137,0.22)",
                borderRadius: 24,
                padding: 24,
                boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
              }}
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Sluiten"
                style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={16} strokeWidth={1.5} />
              </button>

              <p className="eyebrow" style={{ marginBottom: 8 }}>WAT ZIJN SKILLS?</p>
              <h3 className="font-display" style={{ fontSize: 22, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 12, lineHeight: 1.2 }}>
                Concrete <span className="font-display-italic" style={{ color: "#D4AF89" }}>handvatten.</span>
              </h3>
              <p style={{ fontSize: 13.5, color: "var(--text-soft)", lineHeight: 1.6 }}>
                Korte, beproefde technieken uit Dialectische Gedragstherapie (DBT). Voor momenten dat een gesprek te veel is en je gewoon iets nodig hebt om te doen.
              </p>
              <p style={{ fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.55, marginTop: 12 }}>
                Geen vervanging voor therapie — wel echte tools die werken.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}