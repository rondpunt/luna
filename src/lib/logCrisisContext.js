import { base44 } from "@/api/base44Client";
import { BASE44_LOG_CRISIS_FUNCTION_ID } from "@/lib/base44CrisisLogFunction";

/**
 * Server-side crisis audit + keyword triage. No user-facing copy; failures are swallowed.
 * Full chat lines live on `Message` when the caller persisted them; this path adds hash/metadata + flags.
 * @param {{ conversation_id: string, message_id?: string|null|undefined, role: string, content: string }} param
 */
export function logCrisisContextSilently({ conversation_id, message_id, role, content }) {
  if (!conversation_id || !role || typeof content !== "string") return;
  base44.functions
    .invoke(BASE44_LOG_CRISIS_FUNCTION_ID, {
      conversation_id,
      message_id: message_id || undefined,
      role,
      content,
    })
    .catch(() => {});
}
