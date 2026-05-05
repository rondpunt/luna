import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { USER_PREFERENCES_QUERY_KEY, fetchUserPreferencesRow } from "@/hooks/useChatSettings";
import {
  applyLunaPreferenceDocumentAttrs,
  clearLunaPreferenceDocumentAttrs,
} from "@/lib/lunaPreferenceHints";

/**
 * After auth, sync calm / motion prefs from UserPreferences to <html> data attributes.
 */
export default function LunaPreferenceRootSync() {
  const { isAuthenticated, authError } = useAuth();
  const ok =
    isAuthenticated &&
    authError?.type !== "auth_required" &&
    authError?.type !== "user_not_registered";

  const { data: prefs } = useQuery({
    queryKey: USER_PREFERENCES_QUERY_KEY,
    queryFn: fetchUserPreferencesRow,
    enabled: ok,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!ok) {
      clearLunaPreferenceDocumentAttrs();
      return;
    }
    applyLunaPreferenceDocumentAttrs(prefs);
    return () => {};
  }, [ok, prefs]);

  useEffect(() => {
    if (!ok || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => applyLunaPreferenceDocumentAttrs(prefs);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [ok, prefs]);

  return null;
}
