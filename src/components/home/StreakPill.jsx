import { computeStreak } from "@/lib/streak";

/**
 * StreakPill — toont aaneengesloten dagen met een check-in.
 * Pure UI component, leest alleen uit meegegeven checkIns.
 */
export default function StreakPill({ checkIns = [] }) {
  const streak = computeStreak(checkIns);
  const label = streak <= 1 ? "Dag 1" : `${streak} dagen op rij`;

  return (
    <span
      className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full"
      style={{
        background: "rgba(194,90,50,0.10)",
        border: "1px solid rgba(194,90,50,0.28)",
      }}
    >
      <span className="text-[13px] leading-none">🔥</span>
      <span
        className="text-[12px] font-semibold tabular-nums"
        style={{ color: "#C25A32", letterSpacing: "-0.1px" }}
      >
        {label}
      </span>
    </span>
  );
}