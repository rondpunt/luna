import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

/** Shared React Query key for `UserPreferences` row (single object or null). */
export const USER_PREFERENCES_QUERY_KEY = ["userPreferences"];

export async function fetchUserPreferencesRow() {
  const me = await base44.auth.me();
  const list = await base44.entities.UserPreferences.filter({ userId: me.id }).catch(() => []);
  return list?.[0] || null;
}

export const DEFAULT_CHAT_SETTINGS = {
  showSearch: false,
  showPin: false,
  showArchive: false,
  showQuickMove: false,
  showCounts: false,
  compactList: false,
  showDateGroups: true,
};

/**
 * Read + update chat overview settings.
 * Stored under UserPreferences.chatSettings (JSON object).
 * Defaults to a clean layout (everything off except date-groups).
 */
export function useChatSettings() {
  const qc = useQueryClient();

  const { data: prefs, isLoading } = useQuery({
    queryKey: USER_PREFERENCES_QUERY_KEY,
    queryFn: fetchUserPreferencesRow,
  });

  const rawChat = prefs?.chatSettings;
  const chatPatch =
    rawChat && typeof rawChat === "object" && !Array.isArray(rawChat) ? rawChat : {};
  const settings = { ...DEFAULT_CHAT_SETTINGS, ...chatPatch };

  const update = useMutation({
    /** @param {Record<string, unknown>} patch */
    mutationFn: async (patch) => {
      const me = await base44.auth.me();
      const next = { ...settings, ...patch };
      if (prefs?.id) {
        return base44.entities.UserPreferences.update(prefs.id, { chatSettings: next });
      }
      return base44.entities.UserPreferences.create({ userId: me.id, chatSettings: next });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: USER_PREFERENCES_QUERY_KEY }),
  });

  return {
    settings,
    isLoading,
    /** @param {string} key @param {unknown} value */
    setSetting: (key, value) => update.mutate(/** @type {Record<string, unknown>} */ ({ [key]: value })),
    saving: update.isPending,
  };
}