import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { format } from "date-fns";
import { base44 } from "@/api/base44Client";

export const FREE_DAILY_MESSAGE_LIMIT = 10;

/**
 * Server-side user messages today (role=user) for rate UX.
 * @param {boolean} isPlus
 */
export function useConversationQuota(isPlus) {
  const qc = useQueryClient();
  const refresh = useCallback(() => {
    qc.invalidateQueries({ queryKey: ["conversation-quota"] });
  }, [qc]);

  const query = useQuery({
    queryKey: ["conversation-quota", isPlus],
    queryFn: async () => {
      const today = format(new Date(), "yyyy-MM-dd");
      const todayMsgs = await base44.entities.Message.filter({ role: "user" }).catch(() => []);
      const todayCount =
        todayMsgs?.filter((m) => (m.created_date || "").split("T")[0] === today).length || 0;
      return { todayCount };
    },
    staleTime: 20_000,
  });

  const msgCount = query.data?.todayCount ?? 0;
  const limitReached = !isPlus && msgCount >= FREE_DAILY_MESSAGE_LIMIT;
  const msgsLeft = isPlus ? null : Math.max(0, FREE_DAILY_MESSAGE_LIMIT - msgCount);

  return {
    msgCount,
    limitReached,
    msgsLeft,
    FREE_DAILY_MESSAGE_LIMIT,
    refresh,
    isLoading: query.isLoading,
  };
}
