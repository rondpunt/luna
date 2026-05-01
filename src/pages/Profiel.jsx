import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { LogOut, Shield, FileText, Mail, ChevronRight } from "lucide-react";
import BottomNav from "../components/luna/BottomNav";
import Logo from "../components/luna/Logo";

export default function Profiel() {
  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
  });

  const { data: checkIns } = useQuery({
    queryKey: ["checkIns"],
    queryFn: () => base44.entities.CheckIn.list("-date", 365),
    initialData: [],
  });

  // Streak calc
  const allDates = [...new Set(checkIns.map((c) => c.date))].sort().reverse();
  let streak = 0;
  let bestStreak = 0;
  let currentBest = 1;

  const sortedAsc = [...allDates].reverse();
  for (let i = 1; i < sortedAsc.length; i++) {
    const diff =
      (new Date(sortedAsc[i]).getTime() - new Date(sortedAsc[i - 1]).getTime()) /
      86400000;
    if (diff <= 1) {
      currentBest++;
      bestStreak = Math.max(bestStreak, currentBest);
    } else {
      currentBest = 1;
    }
  }
  bestStreak = Math.max(bestStreak, currentBest);

  const handleLogout = () => {
    base44.auth.logout("/");
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg-base)" }}
    >
      <header className="flex items-center justify-between px-6 py-4">
        <Logo showOrb />
      </header>

      <main className="flex-1 px-6 pb-28 max-w-md mx-auto w-full space-y-4">
        {/* Account */}
        <div className="rounded-2xl p-5" style={{ background: "var(--bg-elev)" }}>
          <h3
            className="text-xs font-medium uppercase tracking-wider mb-3"
            style={{ color: "var(--text-muted-luna)" }}
          >
            Account
          </h3>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "var(--bg-elev-2)" }}
            >
              <span className="text-sm font-semibold" style={{ color: "var(--luna-accent)" }}>
                {user?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary-luna)" }}>
                {user?.full_name || "Gebruiker"}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted-luna)" }}>
                {user?.email || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className="rounded-2xl p-5" style={{ background: "var(--bg-elev)" }}>
          <h3
            className="text-xs font-medium uppercase tracking-wider mb-3"
            style={{ color: "var(--text-muted-luna)" }}
          >
            Reeks
          </h3>
          <p className="text-sm" style={{ color: "var(--text-primary-luna)" }}>
            Huidige reeks: {streak} {streak === 1 ? "dag" : "dagen"}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted-luna)" }}>
            Beste reeks: {bestStreak} {bestStreak === 1 ? "dag" : "dagen"}
          </p>
        </div>

        {/* Juridisch */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-elev)" }}>
          <h3
            className="text-xs font-medium uppercase tracking-wider px-5 pt-5 pb-2"
            style={{ color: "var(--text-muted-luna)" }}
          >
            Juridisch
          </h3>
          {[
            { label: "Privacy", icon: Shield, to: "/privacy" },
            { label: "Voorwaarden", icon: FileText, to: "/voorwaarden" },
            { label: "Contact", icon: Mail, to: "/contact" },
          ].map(({ label, icon: ItemIcon, to }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-secondary/30"
            >
              <div className="flex items-center gap-3">
                <ItemIcon className="w-4 h-4" style={{ color: "var(--text-muted-luna)" }} />
                <span className="text-sm" style={{ color: "var(--text-primary-luna)" }}>
                  {label}
                </span>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: "var(--text-muted-luna)" }} />
            </Link>
          ))}
        </div>

        {/* AI disclaimer */}
        <div className="rounded-2xl p-5" style={{ background: "var(--bg-elev)" }}>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted-luna)" }}>
            Luna is een AI-systeem. Je praat met een taalmodel, geen mens. 
            We doen ons best om Luna veilig te maken maar fouten kunnen voorkomen.
          </p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full rounded-2xl p-4 flex items-center justify-center gap-2 transition-colors hover:bg-secondary/30"
          style={{
            background: "var(--bg-elev)",
            color: "var(--luna-warn)",
          }}
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Uitloggen</span>
        </button>

        {/* Version */}
        <p
          className="text-xs text-center pt-2"
          style={{ color: "var(--text-muted-luna)" }}
        >
          luna v0.1 · april 2026
        </p>
      </main>

      <BottomNav />
    </div>
  );
}