import { differenceInCalendarDays, parseISO } from "date-fns";

/**
 * Bereken aaneengesloten dagen met een check-in t.o.v. vandaag.
 * Geeft 0 terug als er geen check-ins zijn of de laatste >1 dag geleden is.
 */
export function computeStreak(checkIns = []) {
  if (!checkIns?.length) return 0;

  const dates = [...new Set(checkIns.map((c) => c.date).filter(Boolean))]
    .sort()
    .reverse();
  if (dates.length === 0) return 0;

  const today = new Date();
  const firstGap = differenceInCalendarDays(today, parseISO(dates[0]));
  if (firstGap > 1) return 0;

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const gap = differenceInCalendarDays(parseISO(dates[i - 1]), parseISO(dates[i]));
    if (gap === 1) streak++;
    else break;
  }
  return streak;
}