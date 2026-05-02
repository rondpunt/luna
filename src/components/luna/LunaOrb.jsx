/**
 * LunaOrb — breathing orb representing Luna's AI presence.
 * State-driven animation. Not a face, not a human avatar.
 * Ethically: clearly AI, warmly present.
 */

import { useEffect, useRef } from "react";
import { PRESENCE } from "@/hooks/useLunaPresence";

const ORB_CONFIG = {
  [PRESENCE.IDLE]:         { scale: [1, 1.01],      opacity: [0.55, 0.60], duration: 4000,  glow: 0.10 },
  [PRESENCE.CONNECTING]:   { scale: [0.94, 1.02],   opacity: [0.65, 0.85], duration: 1200,  glow: 0.18 },
  [PRESENCE.ONLINE]:       { scale: [1, 1.035],     opacity: [0.90, 1.00], duration: 3800,  glow: 0.28 },
  [PRESENCE.READING]:      { scale: [0.97, 1.01],   opacity: [0.75, 0.88], duration: 2200,  glow: 0.18 },
  [PRESENCE.TYPING]:       { scale: [1, 1.06],      opacity: [0.92, 1.00], duration: 900,   glow: 0.40 },
  [PRESENCE.QUIETLY_HERE]: { scale: [1, 1.018],     opacity: [0.60, 0.75], duration: 5500,  glow: 0.12 },
  [PRESENCE.AWAY]:         { scale: [1, 1.012],     opacity: [0.40, 0.52], duration: 7000,  glow: 0.06 },
  [PRESENCE.LAST_ACTIVE]:  { scale: [1, 1.010],     opacity: [0.35, 0.48], duration: 8000,  glow: 0.05 },
};

export default function LunaOrb({ state = PRESENCE.ONLINE, size = 36, className = "" }) {
  const orbRef = useRef(null);
  const animRef = useRef(null);
  const cfg = ORB_CONFIG[state] || ORB_CONFIG[PRESENCE.ONLINE];

  useEffect(() => {
    const el = orbRef.current;
    if (!el) return;

    let frame;
    let start = null;
    let direction = 1;
    let progress = 0;

    const animate = (ts) => {
      if (!start) start = ts;
      const elapsed = (ts - start) % (cfg.duration * 2);
      const halfDur = cfg.duration;

      if (elapsed < halfDur) {
        progress = elapsed / halfDur; // 0 → 1
        direction = 1;
      } else {
        progress = 1 - (elapsed - halfDur) / halfDur; // 1 → 0
        direction = -1;
      }

      // Ease in-out
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const scale = cfg.scale[0] + (cfg.scale[1] - cfg.scale[0]) * eased;
      const opacity = cfg.opacity[0] + (cfg.opacity[1] - cfg.opacity[0]) * eased;
      const glowIntensity = cfg.glow * (0.6 + 0.4 * eased);

      el.style.transform = `scale(${scale})`;
      el.style.opacity = opacity;
      el.style.boxShadow = `0 0 ${Math.round(glowIntensity * 60)}px ${Math.round(glowIntensity * 24)}px rgba(194,90,50,${glowIntensity.toFixed(2)})`;

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [state, cfg]);

  return (
    <div
      ref={orbRef}
      className={`shrink-0 rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: "radial-gradient(circle at 35% 35%, #ee9670 0%, #c25a32 50%, #7a2d14 100%)",
        transition: "opacity 0.6s ease, box-shadow 0.6s ease",
        willChange: "transform, opacity, box-shadow",
      }}
      role="img"
      aria-label="Luna AI aanwezig"
    />
  );
}