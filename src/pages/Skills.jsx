import { useNavigate } from "react-router-dom";
import { SKILL_MODULES, LUNA_PLUS_SKILL_KEYS } from "@/lib/dbt-skills";
import { ChevronRight, Lock } from "lucide-react";
import { usePremium } from "@/hooks/usePremium";

export default function Skills() {
  const navigate = useNavigate();
  const { isPlus } = usePremium();

  return (
    <div className="fade-in px-6" style={{ paddingTop: "calc(32px + env(safe-area-inset-top, 0px))", paddingBottom: 40 }}>
      <div style={{ marginBottom: 32 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>DBT SKILLS</p>
        <h1 className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
          Skills.
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-muted)", marginTop: 6 }}>
          Concrete tools. Geen geleuter.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {SKILL_MODULES.map((mod) => (
          <div key={mod.key}>
            {/* Module header */}
            <p className="eyebrow-muted" style={{ marginBottom: 10, paddingLeft: 4 }}>
              {mod.title.toUpperCase()}
            </p>
            {/* Skill cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
              {mod.skills.map((skill) => {
                const locked = !isPlus && LUNA_PLUS_SKILL_KEYS.includes(skill.key);
                return (
                  <button
                    key={skill.key}
                    type="button"
                    onClick={() => navigate(`/skills/${skill.key}`)}
                    className="surface press haptic-press"
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", textAlign: "left", cursor: "pointer", border: "1px solid var(--border)", borderRadius: 16, width: "100%", background: "var(--surface)" }}
                  >
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 3, display: "flex", alignItems: "center", gap: 8 }}>
                        {skill.title}
                        {locked && (
                          <span className="eyebrow-muted" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10 }}>
                            <Lock size={12} strokeWidth={2} style={{ color: "#E8834A" }} /> PLUS
                          </span>
                        )}
                      </p>
                      <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{skill.short}</p>
                    </div>
                    <ChevronRight size={16} strokeWidth={1.5} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Context note */}
      <div className="surface" style={{ padding: "16px 20px", marginTop: 8 }}>
        <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
          Deze skills komen uit Dialectische Gedragstherapie (DBT) — ontwikkeld door Marsha Linehan, specifiek voor intense emoties. Ze zijn geen vervanging voor therapie, maar ze werken.
        </p>
      </div>
    </div>
  );
}
