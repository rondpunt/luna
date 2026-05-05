import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

/** @returns {boolean} */
export function isDevPremiumOverride() {
  try {
    return import.meta.env?.VITE_PREMIUM_DEV === "1";
  } catch {
    return false;
  }
}

/** @param {null | undefined | { plan?: string, status?: string }} sub */
function subscriptionIsPaidActive(sub) {
  if (!sub) return false;
  const plan = sub.plan;
  const status = sub.status;
  if (plan !== "plus" && plan !== "pro") return false;
  return status === "active" || status === "trialing";
}

/**
 * Resolves Luna Plus / Pro from user.role, Subscription entity, or VITE_PREMIUM_DEV.
 */
export function useUserPlan() {
  const query = useQuery({
    queryKey: ["user-plan"],
    queryFn: async () => {
      const me = await base44.auth.me();
      const subs = await base44.entities.Subscription.filter({ userId: me.id }).catch(() => []);
      const subscription =
        (Array.isArray(subs) ? subs : []).find(subscriptionIsPaidActive) || null;
      const isRolePremium = me?.role === "premium";
      const isPlus = isDevPremiumOverride() || isRolePremium || !!subscription;
      return {
        user: me,
        subscription,
        subscriptions: Array.isArray(subs) ? subs : [],
        isPlus,
        plan: isPlus ? subscription?.plan || (isRolePremium ? "premium_role" : "dev") : "free",
      };
    },
    staleTime: 60_000,
  });

  return {
    user: query.data?.user,
    subscription: query.data?.subscription,
    subscriptions: query.data?.subscriptions ?? [],
    isPlus: query.data?.isPlus ?? false,
    plan: query.data?.plan ?? "free",
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
