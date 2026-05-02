/**
 * ChatBubble — Luna vs User message bubbles.
 * Luna responses render as clean flowing text (no paragraph breaks).
 */

function cleanResponse(text) {
  if (!text) return "";
  // Collapse all double newlines into a single space — prevents 3-block layout
  return text
    .replace(/\n{2,}/g, " ")
    .replace(/\n/g, " ")
    .trim();
}

export default function ChatBubble({ role, content, isGhost = false }) {
  const isUser = role === "user";
  const cleanedContent = isUser ? content : cleanResponse(content);

  if (isUser) {
    return (
      <div className="flex justify-end mb-2">
        <div
          className="max-w-[82%] px-4 py-2.5 text-sm leading-relaxed"
          style={{
            background: "rgba(79,70,229,0.18)",
            border: "1px solid rgba(99,102,241,0.22)",
            borderRadius: "16px 4px 16px 16px",
            color: "rgba(255,255,255,0.78)",
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.65,
          }}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-2">
      <div
        className="max-w-[82%] px-4 py-2.5 text-sm leading-relaxed"
        style={{
          background: isGhost ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "4px 16px 16px 16px",
          color: isGhost ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.85)",
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.65,
          opacity: isGhost ? 0.7 : 1,
        }}
      >
        {cleanedContent}
      </div>
    </div>
  );
}