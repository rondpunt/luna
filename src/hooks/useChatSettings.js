import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

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
    queryKey: ["userPreferences"],
    queryFn: async () => {
      const me = await base44.auth.me();
      const list = await base44.entities.UserPreferences.filter({ userId: me.id }).catch(() => []);
      return list?.[0] || null;
    },
  });

  const settings = { ...DEFAULT_CHAT_SETTINGS, ...(prefs?.chatSettings || {}) };

  const update = useMutation({
    mutationFn: async (patch) => {
      const me = await base44.auth.me();
      const next = { ...settings, ...patch };
      if (prefs?.id) {
        return base44.entities.UserPreferences.update(prefs.id, { chatSettings: next });
      }
      return base44.entities.UserPreferences.create({ userId: me.id, chatSettings: next });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userPreferences"] }),
  });

  return {
    settings,
    isLoading,
    setSetting: (key, value) => update.mutate({ [key]: value }),
    saving: update.isPending,
  };
}