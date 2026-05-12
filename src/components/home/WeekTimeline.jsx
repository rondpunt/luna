import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format, subDays } from "date-fns";
import { nl } from "date-fns/locale";
import { ChevronRight } from "lucide-react";

const MOOD_COLORS = {
  1: "#C94040", 2: "#C94040", 3: "#D4A86B", 4: "#D4A86B",
  5: "#8A8278", 6: "#8A8278", 7: "#6BAD8A", 8: "#6BAD8A",
  9: "#E8834A", 10: "#E8834A",
};

export default function WeekTimeline({ checkIns }) {
  const navigate = useNavigate();
  if (!checkIns?.length) return null;

  const byDate = {};
  checkIns.forEach((c) => {
    const d = c.date || (c.created_date || "").split("T")[0];
    if (d && !byDate[d]) byDate[d] = c;
  });

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = subDays(new Date(), i);
    const key = format(d, "yyyy-MM-dd");
    days.push({
      date: d,
      key,
      letter: format(d, "EEEEEE", { locale: nl }).charAt(0).toUpperCase(),
      checkin: byDate[key],
    });
  }

  if (days.filter((d) => d.checkin).length < 2) return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => navigate("/profiel")}
      className="press"
      style={{
        width: "100%", padding: "22px 22px 24px", borderRadius: 24,
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.06)",
        cursor: "pointer", textAlign: "left",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <p className="eyebrow-muted" style={{ marginBottom: 4 }}>JE WEEK</p>
          <p className="font-display" style={{ fontSize: 22, color: "var(--text)", letterSpacing: "-0.02em" }}>
            7 dagen terug
          </p>
        </div>
        <ChevronRight size={18} style={{ color: "var(--text-faint)" }} strokeWidth={1.5} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 6, height: 64 }}>
        {days.map((d, i) => {
          const score = d.checkin?.score;
          const h = score ? Math.max(8, (score / 10) * 48) : 4;
          const col = score ? MOOD_COLORS[score] : "rgba(255,255,255,0.06)";
          const isToday = i === 6;
          return (
            <div key={d.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <motion.div
                initial={{ scaleY: 0, originY: 1 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.4 + i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  width: "100%", maxWidth: 16, height: h, borderRadius: 8,
                  background: col,
                  boxShadow: score ? `0 4px 12px ${col}40` : "none",
                  opacity: score ? 1 : 0.4,
                }}
              />
              <span style={{
                fontSize: 11, fontWeight: isToday ? 600 : 400,
                color: isToday ? "#E8834A" : "var(--text-faint)",
                letterSpacing: "0.05em",
              }}>{d.letter}</span>
            </div>
          );
        })}
      </div>
    </motion.button>
  );
}