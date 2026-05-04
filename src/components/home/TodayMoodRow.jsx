import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const MOODS = [
  { label: "Moe",       emoji: "😔", score: 3 },
  { label: "Onrustig",  emoji: "😰", score: 4 },
  { label: "Vlak",      emoji: "😐", score: 5 },
  { label: "Hoopvol",   emoji: "🙂", score: 7 },
  { label: "Overladen", emoji: "🤯", score: 2 },
];

/**
 * "Hoe voel je je nu?" — één tik = check-in opgeslagen + naar chat.
 * Premium, kalme layout, geen icon-tile clutter.
 */
export default function TodayMoodRow({ todayDate, onLogged }) {
  const navigate = useNavigate();
  const [picked, setPicked] = useState(null);

  const handlePick = async (m) => {
    if (picked) return;
    setPicked(m.label);
    base44.entities.CheckIn
      .create({ score: m.score, date: todayDate })
      .catch(() => {})
      .finally(() => onLogged?.());
    navigate("/chat");
  };

  return (
    <div className="card px-5 py-5">
      <p className="text-[15.5px] font-semibold leading-tight" style={{ color: "var(--text)", letterSpacing: "-0.15px" }}>
        Hoe voel je je nu?
      </p>
      <p className="text-[12.5px] mt-1" style={{ color: "var(--text-3)" }}>
        Eén tik volstaat
      </p>

      <div className="flex flex-wrap gap-2 mt-4">
        {MOODS.map((m) => {
          const active = picked === m.label;
          return (
            <button
              key={m.label}
              onClick={() => handlePick(m)}
              className="chip btn-press"
              style={{
                background: active ? "var(--accent-soft)" : "var(--bg-elevated)",
                border: `1px solid ${active ? "var(--accent-line)" : "var(--line-subtle)"}`,
                color: active ? "var(--accent)" : "var(--text-2)",
              }}
            >
              <span>{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}