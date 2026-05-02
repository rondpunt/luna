export default function ChatBubble({ role, content, ghost = false }) {
  const isUser = role === "user";
  const text = typeof content === "string" ? content.replace(/\n+/g, " ").trim() : content;

  if (isUser) {
    return (
      <div className="flex justify-end mb-3">
        <div
          className="max-w-[78%] px-4 py-3 rounded-2xl rounded-br-md text-sm leading-relaxed"
          style={{
            background: "#d6e4ff",
            color: "#1a2340",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 mb-3">
      {/* Luna avatar */}
      <div
        className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold"
        style={{ background: "linear-gradient(135deg, #a5b4fc, #818cf8)", color: "white", marginBottom: 2 }}
      >
        L
      </div>
      <div
        className="max-w-[78%] px-4 py-3 rounded-2xl rounded-bl-md text-sm leading-relaxed"
        style={{
          background: ghost ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.92)",
          color: ghost ? "#9aa5be" : "#1a2340",
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: "0 1px 6px rgba(100,140,220,0.10)",
        }}
      >
        {text}
      </div>
    </div>
  );
}