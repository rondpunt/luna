/**
 * NL hints for Luna (memoryContext) + <html> data-* voor rust / motion / plain UI.
 * Bron: UserPreferences + JSON `onboarding_profile` (zie lunaComfortPreferences.js).
 */

import {
  parseOnboardingProfile,
  getEffectiveReduceMotion,
} from "@/lib/lunaComfortPreferences";

const CONCERN_LABELS = {
  bpd: "intense emoties en relatiedruk",
  adhd: "aandacht, prikkels of uitstel",
  autism: "overprikkeling of behoefte aan duidelijkheid",
  both: "meerdere thema's (legacy)",
  combination: "meerdere dingen door elkaar",
  unsure: "nog aan het verkennen wat past",
};

const STYLE_HINTS = {
  shorter: "Voorkeur: compacte antwoorden.",
  structured: "Voorkeur: iets meer structuur (korte blokken, eventueel stappen).",
  deeper: "Voorkeur: mag wat dieper, zacht uitgewerkt.",
  practical: "Voorkeur: direct en concreet.",
};

/**
 * @param {Record<string, unknown> | null | undefined} prefs
 * @returns {string}
 */
export function buildLunaPreferenceMemoryHint(prefs) {
  if (!prefs || typeof prefs !== "object") return "";
  const parts = [];
  const c = prefs.concern;
  if (typeof c === "string" && CONCERN_LABELS[c]) {
    parts.push(`Gebruiker herkent vooral: ${CONCERN_LABELS[c]}.`);
  }
  const style = prefs.aiResponseStyle;
  if (typeof style === "string" && STYLE_HINTS[style]) {
    parts.push(STYLE_HINTS[style]);
  }
  const profile = parseOnboardingProfile(
    typeof prefs.onboarding_profile === "string" ? prefs.onboarding_profile : null,
  );
  if (profile.replyShape === "structured") {
    parts.push("Graag antwoorden met duidelijke structuur (korte blokken of stappen waar het past).");
  }
  if (profile.communicationDirectness === "direct") {
    parts.push("Liever directe taal; blijf warm.");
  }
  if (profile.fewerCelebrations) {
    parts.push("Liever geen overdreven enthousiaste of ‘feestelijke’ formuleringen.");
  }
  if (profile.plainMode) {
    parts.push("Voorkeur voor een heel sobere, rustige toon.");
  }
  if (prefs.calmUi === true || profile.calmPalette) {
    parts.push("Rustig scherm — minder visuele druk in de app.");
  }
  if (prefs.reduceMotionUi === true || profile.reduceAnimations) {
    parts.push("Liever weinig levendige beweging ook in beeldspraak.");
  }
  if (Array.isArray(prefs.goals) && prefs.goals.length) {
    parts.push(`Thema’s: ${prefs.goals.slice(0, 5).join(", ")}.`);
  }
  if (!parts.length) return "";
  return `[Sessie-voorkeuren]\n${parts.join(" ")}`.slice(0, 900);
}

/**
 * @param {Record<string, unknown> | null | undefined} prefs
 */
export function applyLunaPreferenceDocumentAttrs(prefs) {
  const root = document.documentElement;
  const profile = parseOnboardingProfile(
    typeof prefs?.onboarding_profile === "string" ? prefs.onboarding_profile : null,
  );
  const mq =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const userMotion =
    profile.reduceAnimations === true || prefs?.reduceMotionUi === true;
  const reduce = getEffectiveReduceMotion(!!userMotion, !!mq);

  const calm = profile.calmPalette === true || prefs?.calmUi === true;
  const plain = profile.plainMode === true;
  const low = profile.fewerCelebrations === true;

  // Use value "true" so CSS matches `[data-*="true"]` (toggleAttribute alone sets empty string).
  if (reduce) root.setAttribute("data-reduce-motion", "true");
  else root.removeAttribute("data-reduce-motion");
  if (calm) root.setAttribute("data-calm-ui", "true");
  else root.removeAttribute("data-calm-ui");
  if (plain) root.setAttribute("data-plain-mode", "true");
  else root.removeAttribute("data-plain-mode");
  if (low) root.setAttribute("data-low-celebration", "true");
  else root.removeAttribute("data-low-celebration");
}

export function clearLunaPreferenceDocumentAttrs() {
  const root = document.documentElement;
  root.removeAttribute("data-calm-ui");
  root.removeAttribute("data-plain-mode");
  root.removeAttribute("data-low-celebration");
  const mq =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (mq) root.setAttribute("data-reduce-motion", "true");
  else root.removeAttribute("data-reduce-motion");
}
