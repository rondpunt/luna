import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { differenceInDays, parseISO } from "date-fns";

const TRIAL_DAYS = 7;
const MIN_ACTIVE_MINUTES = 30;

/**
 * Centrale gate voor premium/paywall zichtbaarheid.
 * Premium/Plus mag alleen getoond worden als:
 *  - Account is minstens 7 dagen oud
 *  - EN gebruiker heeft minstens 30 actieve minuten in de app
 */
export function useFeatureVisibility() {
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
    staleTime: 60_000,
  });

  const { data: prefs } = useQuery({
    queryKey: ["user-prefs", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const rows = await base44.entities.UserPreferences.filter({ userId: user.id }, "-created_date", 1);
      return rows?.[0] || null;
    },
    enabled: !!user?.id,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  const accountAgeDays = user?.created_date
    ? differenceInDays(new Date(), parseISO(user.created_date))
    : 0;
  const activeMinutes = Math.floor((prefs?.active_app_seconds || 0) / 60);

  const trialActive = accountAgeDays < TRIAL_DAYS || activeMinutes < MIN_ACTIVE_MINUTES;
  const showPremium = !trialActive;

  return {
    showPremium,
    trialActive,
    accountAgeDays,
    activeMinutes,
    daysRemaining: Math.max(0, TRIAL_DAYS - accountAgeDays),
    minutesRemaining: Math.max(0, MIN_ACTIVE_MINUTES - activeMinutes),
  };
}