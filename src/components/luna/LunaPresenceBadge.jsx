/**
 * LunaPresenceBadge — mini presence indicator for Home/dashboard.
 * Links to chat. Keeps Luna present across the app.
 * Ethical: "Luna AI · Online" never implies human.
 */

import { Link } from "react-router-dom";
import LunaOrb from "./LunaOrb";
import { PRESENCE } from "@/hooks/useLunaPresence";
import { useEffect, useState } from "react";

// A simplified ambient presence for non-chat screens
const AMBIENT_LABELS = {
  online: "Luna is online",
  quietly: "Luna is stil aanwezig",
};

export default function LunaPresenceBadge() {
  const [ambient, setAmbient] = useState("online");

  // Occasionally drift to "quietly here" when on home
  useEffect(() => {
    const t = setTimeout(() => {
      setAmbient("quietly");
    }, 45000 + Math.random() * 30000);
    return () => clearTimeout(t);
  }, []);

  const label = AMBIENT_LABELS[ambient];
  const orbState = ambient === "online" ? PRESENCE.ONLINE : PRESENCE.QUIETLY_HERE;

  return (
    <Link to="/chat">
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all active:opacity-70"
        style={{ background: "#1C1C1E", border: "0.5px solid rgba(84,84,88,0.45)" }}
      >
        <LunaOrb state={orbState} size={36} />

        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-medium text-white leading-tight">Babbelen met Luna</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full shrink-0"
              style={{ background: orbState === PRESENCE.ONLINE ? "#30D158" : "rgba(235,235,245,0.40)" }}
            />
            <p className="text-[13px]" style={{ color: "rgba(235,235,245,0.55)" }}>
              {label}
            </p>
          </div>
        </div>

        {/* Chevron */}
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="rgba(235,235,245,0.28)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </Link>
  );
}