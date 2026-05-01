import React from "react";

export default function ChatBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser ? "gradient-bubble" : ""
        }`}
        style={
          isUser
            ? { color: "#fff" }
            : {
                background: "var(--bubble-luna)",
                color: "var(--text-primary-luna)",
                borderLeft: "2px solid rgba(129,140,248,0.25)",
              }
        }
      >
        {content}
      </div>
    </div>
  );
}