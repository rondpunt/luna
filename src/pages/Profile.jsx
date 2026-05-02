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

  const ACCOUNT = [
    { icon: Bell, label: "Meldingen", value: "Dagelijks 20:00", action: null },
    { icon: Gem, label: "Abonnement", value: "Gratis", to: "/pricing" },
    { icon: Shield, label: "Privacycentrum", value: null, to: "/privacy-center" },
  ];

  const INFO = [
    { icon: FileText, label: "Privacybeleid", to: "/privacy" },
    { icon: FileText, label: "Voorwaarden", to: "/voorwaarden" },
    { icon: Mail, label: "Feedback sturen", to: "/contact" },
  ];

  return (
    <div className="px-5 pt-6 pb-8 space-y-6">
      {/* Avatar + name */}
      <div className="flex flex-col items-center text-center gap-3 py-4">
        <div
          className="h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold text-white"
          style={{ background: "linear-gradient(135deg, #ee9670, #c25a32)" }}
        >
          {initials}
        </div>
        <div>
          <p className="text-lg font-bold text-white">{name}</p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{email}</p>
        </div>
      </div>

      {/* Pro banner */}
      <Link to="/pricing">
        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg, rgba(194,90,50,0.30), rgba(194,90,50,0.15))", border: "1px solid rgba(194,90,50,0.35)" }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "rgba(194,90,50,0.25)" }}>
            <Gem className="h-5 w-5 text-[#c25a32]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Upgrade naar Nora Plus</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.50)" }}>Onbeperkt · Geheugen · €9,99/mnd</p>
          </div>
          <ChevronRight className="h-4 w-4" style={{ color: "rgba(255,255,255,0.35)" }} />
        </div>
      </Link>

      {/* Account */}
      <Section label="ACCOUNT">
        {ACCOUNT.map(({ icon: Icon, label, value, to, action }, i) => {
          const row = (
            <div className={`flex items-center gap-3 px-4 py-3.5 ${i > 0 ? "border-t border-[rgba(255,255,255,0.06)]" : ""}`}>
              <Icon className="h-5 w-5 text-[#c25a32]" />
              <span className="flex-1 text-sm text-white">{label}</span>
              {value && <span className="text-sm" style={{ color: "rgba(255,255,255,0.40)" }}>{value}</span>}
              <ChevronRight className="h-4 w-4" style={{ color: "rgba(255,255,255,0.25)" }} />
            </div>
          );
          return to ? <Link key={label} to={to}>{row}</Link> : <div key={label}>{row}</div>;
        })}
      </Section>

      {/* Info */}
      <Section label="OVER">
        {INFO.map(({ icon: Icon, label, to }, i) => (
          <Link key={label} to={to} className={`flex items-center gap-3 px-4 py-3.5 ${i > 0 ? "border-t border-[rgba(255,255,255,0.06)]" : ""}`}>
            <Icon className="h-5 w-5" style={{ color: "rgba(255,255,255,0.40)" }} />
            <span className="flex-1 text-sm text-white">{label}</span>
            <ChevronRight className="h-4 w-4" style={{ color: "rgba(255,255,255,0.25)" }} />
          </Link>
        ))}
      </Section>

      {/* Logout */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-medium transition-all"
        style={{ background: "rgba(255,59,48,0.12)", border: "1px solid rgba(255,59,48,0.20)", color: "#ff3b30" }}
      >
        <LogOut className="h-4 w-4" />
        {loggingOut ? "Bezig…" : "Uitloggen"}
      </button>

      <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.20)" }}>Nora v1.0 · Gemaakt met zorg in België</p>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest mb-2 px-1" style={{ color: "rgba(255,255,255,0.30)" }}>{label}</p>
      <div className="overflow-hidden rounded-2xl" style={{ background: "#1c1c1e" }}>
        {children}
      </div>
    </div>
  );
}