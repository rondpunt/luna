/**
 * Orb — the soul of Luna. Breathing presence, never static.
 * sizes: xs=16, sm=36, md=100, lg=180, xl=240
 */

const SIZES = { xs: 16, sm: 36, md: 100, lg: 180, xl: 240 };

export function Orb({ size = "md", className = "" }) {
  const px = SIZES[size];

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: px, height: px }}
      aria-hidden="true"
    >
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full orb-glow-outer"
        style={{
          background: "radial-gradient(circle, rgba(232,131,74,0.35) 0%, rgba(232,131,74,0.12) 35%, transparent 70%)",
          transform: "scale(2.5)",
          filter: "blur(20px)",
        }}
      />
      {/* Inner glow */}
      <div
        className="absolute inset-0 rounded-full orb-glow-inner"
        style={{
          background: "radial-gradient(circle, rgba(255,200,130,0.5) 0%, rgba(232,131,74,0.3) 50%, transparent 80%)",
          transform: "scale(1.4)",
          filter: "blur(8px)",
        }}
      />
      {/* Core */}
      <div
        className="absolute inset-0 rounded-full orb-core"
        style={{
          background: `radial-gradient(circle at 35% 30%,
            #FFD7A8 0%,
            #F5A468 18%,
            #D2682E 45%,
            #8A2F0E 78%,
            #3A1004 100%
          )`,
          boxShadow: "inset -10% -15% 30% rgba(0,0,0,0.4), inset 8% 8% 20% rgba(255,220,180,0.3)",
        }}
      />
      {/* Highlight */}
      <div
        className="absolute rounded-full"
        style={{
          width: "15%",
          height: "12%",
          top: "22%",
          left: "28%",
          background: "rgba(255,240,220,0.7)",
          filter: "blur(2px)",
        }}
      />
    </div>
  );
}

export default Orb;
