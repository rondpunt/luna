import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Shield, Bell, Download, CreditCard, FileText, Lock, Mail } from "lucide-react";
import GlassCard from "../components/luna/GlassCard";
import LunaOrb from "../components/luna/LunaOrb";
import BottomNav from "../components/luna/BottomNav";

const menuItems = [
  { icon: Bell, label: "Notificaties", path: null },
  { icon: Download, label: "Exporteer mijn data", path: null },
  { icon: CreditCard, label: "Abonnement", path: "/prijzen" },
  { icon: Shield, label: "Privacybeleid", path: "/privacy" },
  { icon: FileText, label: "Voorwaarden", path: "/voorwaarden" },
  { icon: Mail, label: "Contact", path: "/contact" },
];

export default function Profiel() {
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });

  const handleLogout = () => base44.auth.logout();

  return (
    <div className="min-h-screen pb-32" style={{ background: "radial-gradient(ellipse at 80% -10%, rgba(180,120,20,0.12), transparent 50%), radial-gradient(ellipse at 50% -5%, rgba(79,70,229,0.10), transparent 45%), #080d1e" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-6 flex flex-col items-center text-center gap-3">
        <LunaOrb size={56} state="idle" />
        <div>
          <p className="text-lg font-semibold" style={{ color: "rgba(255,255,255,0.92)", fontFamily: "'DM Sans', sans-serif" }}>
            {user?.full_name || "Jij"}
          </p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>
            {user?.email || ""}
          </p>
        </div>
        {/* Privacy chips */}
        <div className="flex gap-2 flex-wrap justify-center">
          {["🇪🇺 EU-servers", "🔒 Versleuteld", "🇧🇪 Belgisch"].map((chip) => (
            <span
              key={chip}
              className="px-3 py-1 rounded-full text-[11px]"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                color: "rgba(255,255,255,0.45)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div className="px-5 max-w-md mx-auto space-y-2">
        {menuItems.map(({ icon: Icon, label, path }) =>
          path ? (
            <Link key={label} to={path}>
              <GlassCard className="flex items-center gap-3 px-4 py-3.5 cursor-pointer">
                <Icon className="w-4 h-4 shrink-0" style={{ color: "rgba(255,255,255,0.45)" }} />
                <span className="flex-1 text-sm" style={{ color: "rgba(255,255,255,0.75)", fontFamily: "'DM Sans', sans-serif" }}>
                  {label}
                </span>
                <ChevronRight className="w-4 h-4" style={{ color: "rgba(255,255,255,0.25)" }} />
              </GlassCard>
            </Link>
          ) : (
            <GlassCard key={label} className="flex items-center gap-3 px-4 py-3.5">
              <Icon className="w-4 h-4 shrink-0" style={{ color: "rgba(255,255,255,0.45)" }} />
              <span className="flex-1 text-sm" style={{ color: "rgba(255,255,255,0.75)", fontFamily: "'DM Sans', sans-serif" }}>
                {label}
              </span>
              <ChevronRight className="w-4 h-4" style={{ color: "rgba(255,255,255,0.25)" }} />
            </GlassCard>
          )
        )}

        <button
          onClick={handleLogout}
          className="w-full py-3.5 rounded-2xl text-sm transition-all active:scale-[0.97] mt-2"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.15)",
            color: "rgba(248,113,113,0.75)",
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