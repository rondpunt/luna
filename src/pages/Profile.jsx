import { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Gem, Shield, FileText, Mail, LogOut, Bell } from "lucide-react";

export default function Profile() {
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });
  const [loggingOut, setLoggingOut] = useState(false);

  const name = user?.full_name || "Jij";
  const email = user?.email || "";
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    setLoggingOut(true);
    await base44.auth.logout();
  };

  return (
    <div className="px-4 pt-6 pb-8 space-y-8">

      {/* Avatar section */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <div
          className="h-[72px] w-[72px] rounded-full flex items-center justify-center text-[26px] font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #ee9670, #c25a32)" }}
        >
          {initials}
        </div>
        <div className="text-center">
          <p className="text-[20px] font-semibold" style={{ color: "#fff", letterSpacing: "-0.2px" }}>{name}</p>
          <p className="text-[13px] mt-0.5" style={{ color: "rgba(235,235,245,0.50)" }}>{email}</p>
        </div>
      </div>

      {/* Pro banner */}
      <Link to="/pricing">
        <div
          className="rounded-2xl px-4 py-4 flex items-center gap-3"
          style={{
            background: "linear-gradient(135deg, rgba(194,90,50,0.25) 0%, rgba(194,90,50,0.12) 100%)",
            border: "0.5px solid rgba(194,90,50,0.50)",
          }}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "rgba(194,90,50,0.25)" }}
          >
            <Gem className="h-5 w-5" style={{ color: "#C25A32" }} />
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-semibold" style={{ color: "#fff" }}>Upgrade naar Nora Plus</p>
            <p className="text-[13px]" style={{ color: "rgba(235,235,245,0.50)" }}>Onbeperkt · Geheugen · €9,99/mnd</p>
          </div>
          <ChevronRight className="h-4 w-4" style={{ color: "rgba(235,235,245,0.30)" }} />
        </div>
      </Link>

      {/* Account group */}
      <IosGroup label="ACCOUNT">
        <IosRow icon={Bell} label="Meldingen" value="20:00" />
        <IosRow icon={Gem} label="Abonnement" value="Gratis" to="/pricing" />
        <IosRow icon={Shield} label="Privacycentrum" to="/privacy-center" />
      </IosGroup>

      {/* Info group */}
      <IosGroup label="OVER">
        <IosRow icon={FileText} label="Privacybeleid" to="/privacy" />
        <IosRow icon={FileText} label="Voorwaarden" to="/voorwaarden" />
        <IosRow icon={Mail} label="Feedback sturen" to="/contact" />
      </IosGroup>

      {/* Logout */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="ios-list w-full ios-list-row justify-center gap-2 text-[15px] font-medium"
        style={{ color: "#FF453A" }}
      >
        <LogOut className="h-4 w-4" />
        {loggingOut ? "Bezig…" : "Uitloggen"}
      </button>

      <p className="text-center text-[12px]" style={{ color: "rgba(235,235,245,0.20)" }}>
        Nora v1.0 · Gemaakt met zorg in België
      </p>
    </div>
  );
}

function IosGroup({ label, children }) {
  return (
    <div>
      <p
        className="text-[13px] font-medium uppercase tracking-wider mb-1.5 px-4"
        style={{ color: "rgba(235,235,245,0.55)" }}
      >
        {label}
      </p>
      <div className="ios-list">{children}</div>
    </div>
  );
}

function IosRow({ icon: Icon, label, value, to }) {
  const inner = (
    <div className="ios-list-row gap-3 w-full">
      <Icon className="h-[18px] w-[18px] shrink-0" style={{ color: "#C25A32" }} />
      <span className="flex-1 text-[15px]" style={{ color: "#fff" }}>{label}</span>
      {value && <span className="text-[15px]" style={{ color: "rgba(235,235,245,0.45)" }}>{value}</span>}
      {to && <ChevronRight className="h-4 w-4 shrink-0" style={{ color: "rgba(235,235,245,0.30)" }} />}
    </div>
  );
  if (to) return <Link to={to}>{inner}</Link>;
  return inner;
}