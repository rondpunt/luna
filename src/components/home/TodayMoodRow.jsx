import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Smile } from "lucide-react";

const MOODS = [
  { label: "Moe",       emoji: "😔", score: 3 },
  { label: "Onrustig",  emoji: "😰", score: 4 },
  { label: "Vlak",      emoji: "😐", score: 5 },
  { label: "Hoopvol",   emoji: "🙂", score: 7 },
  { label: "Overladen", emoji: "🤯", score: 2 },
];

/**
 * "Vandaag — stemming registreren" row.
 * Tonen we ENKEL als er vandaag nog geen check-in is.
 * Tap op emoji slaat CheckIn op + navigeert naar chat.
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
    <div className="card px-5 py-4">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: "rgba(194,90,50,0.12)" }}
        >
          <Smile className="h-[18px] w-[18px]" style={{ color: "#C25A32" }} strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-medium leading-tight" style={{ color: "var(--text)" }}>Hoe voel je je nu?</p>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--text-3)" }}>Eén tik volstaat</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {MOODS.map((m) => {
          const active = picked === m.label;
          return (
            <button
              key={m.label}
              onClick={() => handlePick(m)}
              className="chip btn-press"
              style={{
                background: active ? "rgba(194,90,50,0.14)" : "var(--bg-elevated)",
                border: `1px solid ${active ? "rgba(194,90,50,0.45)" : "var(--line-subtle)"}`,
                color: active ? "#C25A32" : "var(--text-2)",
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