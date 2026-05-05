import { useUserPlan } from "./useUserPlan";

/** @typedef {ReturnType<typeof useUserPlan>} UserPlanResult */

/**
 * Semantic alias for premium gating (Luna Plus).
 * @returns {UserPlanResult & { isPremium: boolean }}
 */
export function usePremium() {
  const plan = useUserPlan();
  return { ...plan, isPremium: plan.isPlus };
}
