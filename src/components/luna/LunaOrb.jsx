import { PRESENCE } from "@/hooks/useLunaPresence";

const ORB_CLASS = {
  [PRESENCE.IDLE]:             "orb-dim",
  [PRESENCE.CONNECTING]:       "orb-connect",
  [PRESENCE.ONLINE]:           "orb-breathe",
  [PRESENCE.READING]:          "orb-breathe",
  [PRESENCE.TYPING]:           "orb-pulse",
  [PRESENCE.QUIETLY_HERE]:     "orb-dim",
  [PRESENCE.AWAY]:             "orb-dim",
  [PRESENCE.LAST_ACTIVE]:      "orb-dim",
  [PRESENCE.NETWORK_OFFLINE]:  "orb-dim",
};

const ORB_OPACITY = {
  [PRESENCE.IDLE]:             0.4,
  [PRESENCE.CONNECTING]:       0.75,
  [PRESENCE.ONLINE]:           1,
  [PRESENCE.READING]:          0.85,
  [PRESENCE.TYPING]:           1,
  [PRESENCE.QUIETLY_HERE]:     0.6,
  [PRESENCE.AWAY]:             0.40,
  [PRESENCE.LAST_ACTIVE]:      0.35,
  [PRESENCE.NETWORK_OFFLINE]:  0.38,
};

export default function LunaOrb({ state = PRESENCE.ONLINE, size = 36, className = "" }) {
  const animClass = ORB_CLASS[state] || "orb-breathe";
  const opacity = ORB_OPACITY[state] ?? 1;

  return (
    <div
      className={`rounded-full shrink-0 luna-orb-pulse ${animClass} ${className}`}
      style={{
        width: size,
        height: size,
        background: "radial-gradient(circle at 35% 35%, #ee9670 0%, #c25a32 55%, #7a2d14 100%)",
        opacity,
        transition: "opacity 0.7s ease",
        willChange: "transform, opacity, box-shadow",
      }}
      role="img"
      aria-label="Luna AI aanwezig"
    />
  );
}