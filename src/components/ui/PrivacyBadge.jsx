import { Lock } from "lucide-react";

/**
 * Junie privacy badge — light theme, vriendelijk.
 * Varianten:
 *  - inline: subtiele pill (default)
 *  - banner: bredere strip
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
          background: "#EEF8F1",
          border: "1px solid #C9E5D3",
          borderRadius: 999,
          fontSize: 11.5, fontWeight: 600, letterSpacing: "0.01em",
          color: "#3D7A52",
          width: "fit-content",
        }}
      >
        <Lock size={11} strokeWidth={2.4} style={{ color: "#5BAE7A" }} />
        <span>{label}</span>
      </div>
    );
  }

  return (
    <span
      aria-label={label}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "4px 10px",
        borderRadius: 999,
        background: "#EEF8F1",
        border: "1px solid #C9E5D3",
        fontSize: 10.5, fontWeight: 600,
        color: "#3D7A52",
        letterSpacing: "0.02em",
      }}
    >
      <Lock size={9} strokeWidth={2.4} style={{ color: "#5BAE7A" }} />
      {label}
    </span>
  );
}