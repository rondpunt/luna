import { useNavigate } from "react-router-dom";
import { SKILL_MODULES } from "@/lib/dbt-skills";
import CrisisButton from "@/components/luna/CrisisButton";
import { ChevronRight } from "lucide-react";

export default function Skills() {
  const navigate = useNavigate();

  return (
    <div className="fade-in px-6" style={{ paddingTop: "calc(32px + env(safe-area-inset-top, 0px))", paddingBottom: 40 }}>
      <CrisisButton />

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
              {mod.skills.map((skill) => (
                <button
                  key={skill.key}
                  onClick={() => navigate(`/skills/${skill.key}`)}
                  className="surface press"
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", textAlign: "left", cursor: "pointer", border: "1px solid var(--border)", borderRadius: 16, width: "100%", background: "var(--surface)" }}
                >
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>
                      {skill.title}
                    </p>
                    <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{skill.short}</p>
                  </div>
                  <ChevronRight size={16} strokeWidth={1.5} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
                </button>
              ))}
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
