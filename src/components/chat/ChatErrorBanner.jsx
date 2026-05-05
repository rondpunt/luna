import { AlertCircle, RotateCw } from "lucide-react";

/**
 * Inline error banner shown after a failed assistant response.
 * Sits above the input bar, never blocks the conversation.
 */
export default function ChatErrorBanner({ message, onRetry, retrying, retryDisabled = false }) {
  if (!message) return null;
  return (
    <div
      className="flex items-center gap-2.5 mx-1 mb-2 px-3.5 py-2.5 msg-enter"
      style={{
        background: "rgba(240,71,71,0.08)",
        border: "1px solid rgba(240,71,71,0.20)",
        borderRadius: 14,
      }}
    >
      <AlertCircle className="h-[16px] w-[16px] shrink-0" style={{ color: "#F04747" }} strokeWidth={1.8} />
      <p className="flex-1 text-[13px] leading-[1.4]" style={{ color: "var(--text-2)" }}>
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        disabled={retrying || retryDisabled}
        className="flex items-center gap-1.5 rounded-lg px-3 h-7 text-[12px] font-semibold btn-press shrink-0"
        style={{
          background: "rgba(240,71,71,0.16)",
          color: "#F04747",
          opacity: retrying ? 0.6 : 1,
        }}
      >
        <RotateCw className={`h-[12px] w-[12px] ${retrying ? "animate-spin" : ""}`} strokeWidth={2.5} />
        {retrying ? "Bezig…" : "Opnieuw"}
      </button>
    </div>
  );
}