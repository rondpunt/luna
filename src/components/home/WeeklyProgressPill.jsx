import { differenceInCalendarDays, parseISO } from "date-fns";

/**
 * WeeklyProgressPill — toont aantal check-ins van afgelopen 7 dagen.
 * Toont alleen vanaf 3 check-ins (per spec).
 */
export default function WeeklyProgressPill({ checkIns = [] }) {
  const today = new Date();
  const inLast7 = checkIns.filter((c) => {
    if (!c?.date) return false;
    try {
      return differenceInCalendarDays(today, parseISO(c.date)) <= 6;
    } catch {
      return false;
    }
  });
  const count = inLast7.length;
  if (count < 3) return null;

  return (
    <span
      className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full"
      style={{
        background: "rgba(52,199,123,0.10)",
        border: "1px solid rgba(52,199,123,0.28)",
      }}
    >
      <span
        className="text-[12px] font-semibold tabular-nums"
        style={{ color: "#34C77B", letterSpacing: "-0.1px" }}
      >
        Deze week: {count} check-in{count === 1 ? "" : "s"} ✓
      </span>
    </span>
  );
}