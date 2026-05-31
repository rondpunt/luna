/**
 * Junie Logo — schaalbaar SVG-component
 *
 * Variants:
 *  - mark: alleen het hart-met-J icoon (geschikt voor nav, headers, avatars)
 *  - wordmark: alleen de tekst "Junie" met regenboog-kleuren
 *  - full: hart + JUNIE + "MENTAL CHATAPP" tagline (zoals oorspronkelijk logo)
 *  - stacked: hart bovenop, JUNIE eronder (compact verticaal)
 *
 * Schaalt automatisch met size prop (= hoogte in px).
 */
export default function JunieLogo({
  variant = "mark",
  size = 40,
  showTagline = false,
  className = "",
  style = {},
}) {
  if (variant === "wordmark") {
    return <Wordmark size={size} className={className} style={style} />;
  }
  if (variant === "full") {
    return <Full size={size} showTagline={showTagline} className={className} style={style} />;
  }
  if (variant === "stacked") {
    return <Stacked size={size} className={className} style={style} />;
  }
  return <Mark size={size} className={className} style={style} />;
}

/* ─── MARK: hart-icoon (alleen) ─── */
function Mark({ size, className, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="Junie"
    >
      <defs>
        <linearGradient id="junieGrad" x1="10" y1="20" x2="90" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6A9AD9" />
          <stop offset="0.45" stopColor="#7BC096" />
          <stop offset="0.75" stopColor="#F0C674" />
          <stop offset="1" stopColor="#EC6F6F" />
        </linearGradient>
      </defs>
      {/* Left chat-bubble half-heart */}
      <path
        d="M 50 88
           C 30 75, 12 60, 12 38
           C 12 24, 22 14, 34 14
           C 42 14, 47 18, 50 24
           Z"
        fill="url(#junieGrad)"
        opacity="0.88"
      />
      {/* Right chat-bubble half-heart */}
      <path
        d="M 50 88
           C 70 75, 88 60, 88 38
           C 88 24, 78 14, 66 14
           C 58 14, 53 18, 50 24
           Z"
        fill="url(#junieGrad)"
        opacity="0.92"
      />
      {/* Chat dots (left bubble) */}
      <circle cx="26" cy="36" r="2.6" fill="#FFFFFF" />
      <circle cx="34" cy="36" r="2.6" fill="#FFFFFF" />
      <circle cx="42" cy="36" r="2.6" fill="#FFFFFF" />
      {/* Stylized J (center) */}
      <path
        d="M 56 28
           L 56 56
           C 56 64, 50 68, 44 64"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/* ─── WORDMARK: "Junie" tekst met regenboog ─── */
function Wordmark({ size, className, style }) {
  // size = height, width = ratio ~ 2.4
  const h = size;
  const w = size * 2.4;
  const fontSize = h * 0.85;
  const letters = [
    { ch: "J", color: "#6A9AD9" },
    { ch: "u", color: "#5BAE7A" },
    { ch: "n", color: "#7BC096" },
    { ch: "i", color: "#F0C674" },
    { ch: "e", color: "#EC6F6F" },
  ];
  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        fontFamily: "'Quicksand', sans-serif",
        fontWeight: 700,
        fontSize,
        letterSpacing: "-0.01em",
        lineHeight: 1,
        height: h,
        ...style,
      }}
      aria-label="Junie"
    >
      {letters.map((l, i) => (
        <span key={i} style={{ color: l.color }}>{l.ch}</span>
      ))}
    </div>
  );
}

/* ─── FULL: hart + wordmark + tagline ─── */
function Full({ size, showTagline, className, style }) {
  return (
    <div
      className={className}
      style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: size * 0.18, ...style }}
      aria-label="Junie — Mental ChatApp"
    >
      <Mark size={size} />
      <Wordmark size={size * 0.55} />
      {showTagline && (
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: size * 0.16,
            fontWeight: 600,
            letterSpacing: "0.16em",
            color: "#8A8499",
            textTransform: "uppercase",
            marginTop: size * 0.05,
          }}
        >
          Mental ChatApp
        </span>
      )}
    </div>
  );
}

/* ─── STACKED: hart + naam (compact, voor headers) ─── */
function Stacked({ size, className, style }) {
  return (
    <div
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: size * 0.25, ...style }}
      aria-label="Junie"
    >
      <Mark size={size} />
      <Wordmark size={size * 0.7} />
    </div>
  );
}