import { differenceInCalendarDays, parseISO } from "date-fns";

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

function computeStreak(checkIns) {
  if (!checkIns?.length) return 1;
  const dates = [...new Set(checkIns.map((c) => c.date).filter(Boolean))]
    .sort()
    .reverse();
  if (dates.length === 0) return 1;

  const today = new Date();
  const firstGap = differenceInCalendarDays(today, parseISO(dates[0]));
  if (firstGap > 1) return 1;

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const gap = differenceInCalendarDays(parseISO(dates[i - 1]), parseISO(dates[i]));
    if (gap === 1) streak++;
    else break;
  }
  return streak;
}