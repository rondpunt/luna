import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import LunaOrb from "./LunaOrb";
import { PRESENCE } from "@/hooks/useLunaPresence";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { ChevronRight } from "lucide-react";

export default function LunaPresenceBadge() {
  const online = useOnlineStatus();
  const [status, setStatus] = useState("online");

  useEffect(() => {
    const t = setTimeout(() => setStatus("quiet"), 40000 + Math.random() * 25000);
    return () => clearTimeout(t);
  }, []);

  const label = !online
    ? "Geen verbinding"
    : status === "online"
      ? "Luna is online"
      : "Luna is stil aanwezig";
  const sub = !online
    ? "Berichten werken weer zodra je online bent"
    : status === "online"
      ? "Klaar om te luisteren"
      : "Tap om te beginnen";
  const orbState = !online ? PRESENCE.NETWORK_OFFLINE : status === "online" ? PRESENCE.ONLINE : PRESENCE.QUIETLY_HERE;
  const dotColor = !online ? "#8E8E93" : status === "online" ? "#34C77B" : "rgba(240,240,242,0.35)";

  return (
    <Link to="/chat" className="block btn-press">
      <div
        className="flex items-center gap-3.5 rounded-2xl px-4 py-3.5"
        style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}
      >
        <LunaOrb state={orbState} size={38} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: dotColor }} />
            <p className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>{label}</p>
          </div>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--text-2)" }}>{sub}</p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0" style={{ color: "var(--text-3)" }} />
      </div>
    </Link>
  );
}