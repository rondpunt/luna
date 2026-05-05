import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

/**
 * Luna Memory entities — list + delete for settings / geheugen UI.
 */
export function useMemoryList() {
  const qc = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["luna-memories"],
    queryFn: async () => {
      const rows = await base44.entities.Memory.list("-created_date", 200).catch(() => []);
      return Array.isArray(rows) ? rows : [];
    },
    staleTime: 30_000,
  });

  const remove = useMutation({
    /** @param {string} id */
    mutationFn: async (id) => base44.entities.Memory.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["luna-memories"] }),
  });

  const memories = listQuery.data ?? [];
  const active = memories.filter((m) => !m.deletedAt);

  return {
    memories,
    activeMemories: active,
    count: active.length,
    loading: listQuery.isLoading,
    error: listQuery.error,
    refetch: listQuery.refetch,
    removeById: (id) => remove.mutateAsync(id),
    removing: remove.isPending,
  };
}
