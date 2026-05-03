import { base44 } from "@/api/base44Client";

/**
 * Single source of truth for chat persistence.
 * - Message entity = canonical store (used for refresh + thread restore)
 * - Conversation entity = thread metadata
 * - Agent conversation = LLM context only
 *
 * All writes are best-effort with explicit error returns so the UI can react.
 */

export async function saveUserMessage({ conversationId, content }) {
  return base44.entities.Message.create({
    conversation_id: conversationId,
    role: "user",
    content,
    mode: "text",
  });
}

export async function saveAssistantMessage({ conversationId, content }) {
  if (!content?.trim()) throw new Error("empty_assistant_content");
  return base44.entities.Message.create({
    conversation_id: conversationId,
    role: "assistant",
    content,
    mode: "text",
  });
}

export async function loadMessages(conversationId) {
  if (!conversationId) return [];
  const list = await base44.entities.Message.filter(
    { conversation_id: conversationId },
    "created_date",
    500
  );
  return list || [];
}

export async function ensureConversation({
  existingId,
  userId,
  title,
  folderId,
  folderName,
  agentConversationId,
}) {
  if (existingId) {
    // Update agent id if newly known
    if (agentConversationId) {
      await base44.entities.Conversation.update(existingId, { agentConversationId }).catch(() => {});
    }
    return existingId;
  }
  const conv = await base44.entities.Conversation.create({
    userId,
    title: title.slice(0, 50) || "Nieuw gesprek",
    folderId: folderId || undefined,
    folderName: folderName || undefined,
    agentConversationId: agentConversationId || undefined,
    last_message_at: new Date().toISOString(),
    message_count: 1,
  });
  return conv.id;
}

export async function touchConversation({ id, message_count }) {
  if (!id) return;
  return base44.entities.Conversation.update(id, {
    last_message_at: new Date().toISOString(),
    message_count,
  }).catch(() => {});
}

/**
 * Call noraChat with up to 2 retries (exponential backoff).
 * Throws on final failure so the caller can show the retry UI.
 */
export async function invokeNoraChatWithRetry({ messages, style = "gentle", memoryContext = "" }, maxRetries = 2) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await base44.functions.invoke("noraChat", { messages, style, memoryContext });
      const reply =
        typeof res?.data?.reply === "string"
          ? res.data.reply
          : res?.data?.reply?.content;
      if (!reply || !reply.trim()) throw new Error("empty_reply");
      return reply;
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
      }
    }
  }
  throw lastError || new Error("noraChat_failed");
}