import { Lock } from "lucide-react";

/**
 * Premium privacy badge — volgens UX-blueprint:
 * altijd zichtbaar bij gevoelige flows, slotje + microcopy.
 *
 * Varianten:
 *  - inline: subtiele pill (default)
 *  - banner: bredere strip (chat/braindump bovenkant)
 */
export default function PrivacyBadge({ variant = "inline", text }) {
  const label = text || "Versleuteld · alleen jij";

  if (variant === "banner") {
    return (
      <div
        role="status"
        aria-label={label}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 14px",
          background: "rgba(138,148,130,0.08)",
          border: "1px solid rgba(138,148,130,0.18)",
          borderRadius: 999,
          fontSize: 11.5, fontWeight: 500, letterSpacing: "0.02em",
          color: "var(--text-soft)",
          width: "fit-content",
        }}
      >
        <Lock size={11} strokeWidth={2} style={{ color: "#8A9482" }} />
        <span>{label}</span>
      </div>
    );
  }

  return (
    <span
      aria-label={label}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        fontSize: 10.5, color: "var(--text-muted)",
        letterSpacing: "0.04em",
      }}
    >
      <Lock size={10} strokeWidth={2} style={{ color: "#8A9482" }} />
      {label}
    </span>
  );
}