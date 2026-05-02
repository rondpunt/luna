import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Shield, Bell, CreditCard, FileText, Mail, Star, Flame } from "lucide-react";
import LunaOrb from "../components/luna/LunaOrb";
import BottomNav from "../components/luna/BottomNav";
import { format } from "date-fns";

export default function Profiel() {
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });
  const { data: checkIns = [] } = useQuery({
    queryKey: ["checkins-profile"],
    queryFn: () => base44.entities.CheckIn.list("-date", 30),
  });

  const streak = (() => {
    let s = 0;
    for (let i = 0; i < 30; i++) {
      const d = format(new Date(Date.now() - i * 86400000), "yyyy-MM-dd");
      if (checkIns.find((c) => c.date === d)) s++;
      else break;
    }
    return s;
  })();

  const handleLogout = () => base44.auth.logout();
  const name = user?.full_name || "Jij";
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const menuItems = [
    { icon: Bell, label: "Notificaties", path: null, desc: "Dagelijkse herinneringen instellen" },
    { icon: CreditCard, label: "Abonnement", path: "/prijzen", desc: "Gratis plan · Upgrade naar Pro" },
    { icon: Shield, label: "Privacybeleid", path: "/privacy", desc: "Jouw data, jouw controle" },
    { icon: FileText, label: "Voorwaarden", path: "/voorwaarden", desc: "Lees onze gebruiksvoorwaarden" },
    { icon: Mail, label: "Feedback geven", path: "/contact", desc: "Help Luna beter worden" },
  ];

  return (
    <div
      className="min-h-screen pb-32"
      style={{ background: "linear-gradient(160deg, #f0f4ff 0%, #f5f7ff 55%, #eaeffa 100%)" }}
    >
      {/* Profile header */}
      <div className="px-5 pt-12 pb-6 flex flex-col items-center text-center gap-4">
        {/* Avatar */}
        <div className="relative">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{
              background: "linear-gradient(135deg, #1e7a8c, #1a5f7a)",
              color: "white",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 4px 20px rgba(30,122,140,0.30)",
            }}
          >
            {initials}
          </div>
        </div>

        <div>
          <p className="text-xl font-bold" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>
            {name}
          </p>
          <p className="text-sm mt-0.5" style={{ color: "#8a96b0", fontFamily: "'DM Sans', sans-serif" }}>
            {user?.email || ""}
          </p>
        </div>

        {/* Stats chips */}
        <div className="flex gap-3">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.85)", boxShadow: "0 2px 8px rgba(100,140,220,0.08)" }}
          >
            <Flame className="w-3.5 h-3.5" style={{ color: "#f97316" }} />
            <span className="text-xs font-semibold" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>
              {streak} dag{streak !== 1 ? "en" : ""} reeks
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.85)", boxShadow: "0 2px 8px rgba(100,140,220,0.08)" }}
          >
            <Star className="w-3.5 h-3.5" style={{ color: "#5b7cf6" }} />
            <span className="text-xs font-semibold" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>
              {checkIns.length} check-ins
            </span>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex gap-2 flex-wrap justify-center">
          {["🇧🇪 Belgisch", "🇪🇺 EU-servers", "🔒 Versleuteld"].map((chip) => (
            <span
              key={chip}
              className="px-3 py-1 rounded-full text-[11px] font-medium"
              style={{
                background: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(180,190,220,0.30)",
                color: "#6b7a99",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="px-5 max-w-md mx-auto space-y-2">

        {/* Pro upgrade banner */}
        <Link to="/prijzen">
          <div
            className="rounded-2xl p-4 flex items-center gap-3 mb-4 cursor-pointer active:scale-[0.98] transition-all"
            style={{
              background: "linear-gradient(135deg, #1e7a8c 0%, #1a5f7a 100%)",
              boxShadow: "0 4px 16px rgba(30,122,140,0.28)",
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.18)" }}>
              <Star className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Upgrade naar Luna Pro
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.70)", fontFamily: "'DM Sans', sans-serif" }}>
                AI-geheugen, patronen & meer · €4,99/mnd
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-white opacity-70 shrink-0" />
          </div>
        </Link>

        {menuItems.map(({ icon: Icon, label, path, desc }) =>
          path ? (
            <Link key={label} to={path}>
              <div
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer active:scale-[0.98] transition-all"
                style={{ background: "rgba(255,255,255,0.85)", boxShadow: "0 2px 6px rgba(100,140,220,0.06)" }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#eef2ff" }}>
                  <Icon className="w-4 h-4" style={{ color: "#5b7cf6" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
                  <p className="text-xs" style={{ color: "#9aa5be", fontFamily: "'DM Sans', sans-serif" }}>{desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "#c0cce0" }} />
              </div>
            </Link>
          ) : (
            <div
              key={label}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.85)", boxShadow: "0 2px 6px rgba(100,140,220,0.06)" }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#eef2ff" }}>
                <Icon className="w-4 h-4" style={{ color: "#5b7cf6" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
                <p className="text-xs" style={{ color: "#9aa5be", fontFamily: "'DM Sans', sans-serif" }}>{desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "#c0cce0" }} />
            </div>
          )
        )}

        <button
          onClick={handleLogout}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-[0.97] mt-2"
          style={{
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.15)",
            color: "#ef4444",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Uitloggen
        </button>
      </div>

      <BottomNav />
    </div>
  );
}