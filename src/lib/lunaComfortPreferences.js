/**
 * Comfort / onboarding JSON stored in UserPreferences.onboarding_profile (stringified).
 * Base44 entity may lag behind; the app tolerates missing server fields by merging client-side.
 *
 * Schema (v1):
 * - v: number
 * - reduceAnimations: boolean — minder beweging in de UI
 * - calmPalette: boolean — zachtere accenten (CSS data-calm-ui)
 * - fewerCelebrations: boolean — minder feestelijke micro-feedback
 * - plainMode: boolean — rustiger, minder “glans”
 * - communicationDirectness: "softer" | "direct"
 * - replyShape: "short" | "structured"
 */

/** @typedef {{ v?: number, reduceAnimations?: boolean, calmPalette?: boolean, fewerCelebrations?: boolean, plainMode?: boolean, communicationDirectness?: "softer"|"direct", replyShape?: "short"|"structured" }} OnboardingProfileV1 */

export const DEFAULT_ONBOARDING_PROFILE = /** @type {Required<OnboardingProfileV1>} */ ({
  v: 1,
  reduceAnimations: false,
  calmPalette: false,
  fewerCelebrations: false,
  plainMode: false,
  communicationDirectness: "softer",
  replyShape: "short",
});

/**
 * @param {string | null | undefined} raw
 * @returns {Required<OnboardingProfileV1>}
 */
export function parseOnboardingProfile(raw) {
  if (!raw || typeof raw !== "string") return { ...DEFAULT_ONBOARDING_PROFILE };
  try {
    const o = JSON.parse(raw);
    if (!o || typeof o !== "object") return { ...DEFAULT_ONBOARDING_PROFILE };
    return {
      ...DEFAULT_ONBOARDING_PROFILE,
      ...o,
      communicationDirectness:
        o.communicationDirectness === "direct" ? "direct" : "softer",
      replyShape: o.replyShape === "structured" ? "structured" : "short",
    };
  } catch {
    return { ...DEFAULT_ONBOARDING_PROFILE };
  }
}

/**
 * Map onboarding communication choices to UserPreferences.aiResponseStyle enum.
 * @param {Required<OnboardingProfileV1>} profile
 * @returns {"shorter"|"structured"|"deeper"|"practical"}
 */
export function profileToAiResponseStyle(profile) {
  if (profile.replyShape === "structured" && profile.communicationDirectness === "softer") return "deeper";
  if (profile.replyShape === "structured") return "structured";
  if (profile.communicationDirectness === "direct") return "practical";
  return "shorter";
}

/**
 * @param {boolean} userWantsReduce
 * @param {boolean} systemPrefersReduce
 */
export function getEffectiveReduceMotion(userWantsReduce, systemPrefersReduce) {
  return !!(userWantsReduce || systemPrefersReduce);
}
