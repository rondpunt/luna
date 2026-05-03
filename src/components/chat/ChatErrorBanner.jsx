import { AlertCircle, RotateCw } from "lucide-react";

/**
 * Inline error banner shown after a failed assistant response.
 * Sits above the input bar, never blocks the conversation.
 */
export default function ChatErrorBanner({ message, onRetry, retrying }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2.5 mx-1 mb-2 rounded-2xl px-3.5 py-2.5 msg-enter"
      style={{ background: "rgba(240,71,71,0.10)", border: "1px solid rgba(240,71,71,0.25)" }}
    >
      <AlertCircle className="h-4 w-4 shrink-0" style={{ color: "#F04747" }} strokeWidth={1.8} />
      <p className="flex-1 text-[13px] leading-[1.4]" style={{ color: "var(--text-2)" }}>
        {message}
      </p>
      <button
        onClick={onRetry}
        disabled={retrying}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold btn-press shrink-0"
        style={{
          background: "rgba(240,71,71,0.18)",
          color: "#F04747",
          opacity: retrying ? 0.6 : 1,
        }}
      >
        <RotateCw className={`h-3 w-3 ${retrying ? "animate-spin" : ""}`} strokeWidth={2.5} />
        {retrying ? "Bezig…" : "Opnieuw"}
      </button>
    </div>
  );
}