import { useNavigate } from "react-router-dom";
import { SKILL_MODULES } from "@/lib/dbt-skills";
import { ChevronRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import SkillsInfoTooltip from "@/components/skills/SkillsInfoTooltip";

const MODULE_COLORS = {
  distress: "#6B8FD4",
  emotion:  "#A46BA8",
  interpersonal: "#6BAD8A",
  mindfulness: "#D4A86B",
};

export default function Skills() {
  const navigate = useNavigate();

  return (
    <div className="fade-in px-5" style={{ paddingTop: "calc(28px + env(safe-area-inset-top, 0px))", paddingBottom: 8 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p className="eyebrow" style={{ marginBottom: 6 }}>HANDVATTEN</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1 className="font-display" style={{ fontSize: 34, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.0 }}>
            Skills.
          </h1>
          <SkillsInfoTooltip />
        </div>
        <p style={{ fontSize: 15, color: "var(--text-muted)", marginTop: 6 }}>Concrete tools voor zware momenten.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {SKILL_MODULES.map((mod, modIdx) => {
          const color = MODULE_COLORS[mod.key] || "#E8834A";
          return (
            <motion.div
              key={mod.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: modIdx * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
                <p className="eyebrow-muted" style={{ color }}>{mod.title.toUpperCase()}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {mod.skills.map((skill, idx) => (
                  <motion.button
                    key={skill.key}
                    onClick={() => navigate(`/skills/${skill.key}`)}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: modIdx * 0.07 + idx * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "16px 18px", textAlign: "left", cursor: "pointer",
                      background: "rgba(255,255,255,0.025)",
                      border: "1px solid rgba(255,255,255,0.055)",
                      borderRadius: 16, width: "100%",
                      transition: "background 0.12s, border-color 0.12s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.045)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.025)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.055)"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: `${color}12`, border: `1px solid ${color}28`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Zap size={14} style={{ color }} strokeWidth={1.8} />
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{skill.title}</p>
                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{skill.short}</p>
                      </div>
                    </div>
                    <ChevronRight size={15} strokeWidth={1.5} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer note */}
      <div style={{
        marginTop: 20, marginBottom: 8,
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.045)",
        borderRadius: 16, padding: "16px 18px",
      }}>
        <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65 }}>
          Deze skills komen uit Dialectische Gedragstherapie (DBT) — ontwikkeld door Marsha Linehan voor intense emoties. Ze zijn geen vervanging voor therapie.
        </p>
      </div>

      <div style={{ height: 16 }} />
    </div>
  );
}