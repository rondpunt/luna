/**
 * LunaChatHeader — iOS-style chat nav bar with live presence.
 * Ethically honest: shows AI status, never human impersonation.
 */

import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import LunaOrb from "./LunaOrb";
import { PRESENCE } from "@/hooks/useLunaPresence";

/** Pass `displayState` from `useLunaPresence` when combining network + companion state. */
export default function LunaChatHeader({ state, statusLabel, statusColor }) {
  const isConnecting = state === PRESENCE.CONNECTING;
  const isNetworkOffline = state === PRESENCE.NETWORK_OFFLINE;

  return (
    <div
      className="flex items-center shrink-0 px-4 gap-3"
      style={{
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "saturate(180%) blur(24px)",
        WebkitBackdropFilter: "saturate(180%) blur(24px)",
        borderBottom: "0.5px solid rgba(84,84,88,0.65)",
        paddingTop: "calc(14px + var(--safe-top))",
        paddingBottom: "12px",
      }}
    >
      {/* Back */}
      <Link
        to="/"
        className="flex items-center gap-0.5 shrink-0 justify-center"
        style={{
          color: "#C25A32",
          minWidth: 44,
          minHeight: 44,
          padding: "0 8px 0 0",
          marginLeft: -4,
          touchAction: "manipulation",
        }}
      >
        <ChevronLeft className="h-[22px] w-[22px]" strokeWidth={2.5} />
        <span className="text-[17px] font-medium">Terug</span>
      </Link>

      {/* Center — orb + name + status */}
      <div className="flex flex-1 flex-col items-center gap-0.5">
        {/* Orb with fade-in on connect */}
        <div
          style={{
            opacity: state === PRESENCE.IDLE ? 0 : 1,
            transition: "opacity 0.5s ease",
          }}
        >
          <LunaOrb state={state} size={32} />
        </div>

        <p className="text-[13px] font-semibold leading-none" style={{ color: "#fff" }}>
          Luna
        </p>

        {/* Status line */}
        <div className="flex items-center gap-1.5 h-4">
          {statusLabel && (
            <>
              {/* Pulse dot — only for active states */}
              {(state === PRESENCE.ONLINE ||
                state === PRESENCE.READING ||
                state === PRESENCE.TYPING ||
                isNetworkOffline) && (
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full shrink-0"
                  style={{
                    background: statusColor,
                    animation:
                      state === PRESENCE.TYPING
                        ? "typingPulse 1s ease-in-out infinite"
                        : state === PRESENCE.READING
                          ? "typingPulse 1.4s ease-in-out infinite"
                          : "none",
                  }}
                />
              )}
              <span
                className="text-[12px] font-medium transition-all duration-300"
                style={{ color: statusColor }}
              >
                {statusLabel}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Spacer to balance back button */}
      <div className="w-16 shrink-0" />
    </div>
  );
}