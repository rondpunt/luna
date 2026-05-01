import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { LogOut, ChevronRight, Shield, FileText, Mail, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "../components/luna/Logo";
import BottomNav from "../components/luna/BottomNav";

export default function Profiel() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: checkIns = [] } = useQuery({
    queryKey: ["checkIns"],
    queryFn: () => base44.entities.CheckIn.list("-created_date", 365),
    initialData: [],
  });

  // Streak calculation
  const allDates = [...new Set(checkIns.map((c) => c.date))].sort().reverse();
  const today = new Date().toISOString().split("T")[0];
  const todayDate = new Date(today);
  let streak = 0;
  for (let i = 0; i < allDates.length; i++) {
    const d = new Date(allDates[i]);
    const diff = Math.floor((todayDate - d) / (1000 * 60 * 60 * 24));
    if (diff === i) streak++;
    else break;
  }

  const handleLogout = () => {
    base44.auth.logout("/");
  };

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: "var(--luna-bg-base)" }}>
      <header className="flex items-center justify-between px-6 py-4">
        <Logo showOrb />
      </header>

      <div className="px-6 max-w-md mx-auto space-y-4">
        <h1 className="text-xl font-semibold mb-2" style={{ color: "var(--luna-text-primary)" }}>
          Profiel
        </h1>

        {/* Account */}
        <SectionCard title="Account">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "var(--luna-text-primary)" }}>
                {user?.email || "Laden..."}
              </p>
              <p className="text-xs" style={{ color: "var(--luna-text-muted)" }}>
                {user?.full_name || ""}
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Reeks */}
        <SectionCard title="Reeks">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: "var(--luna-text-primary)" }}>
              Huidige reeks
            </p>
            <p className="text-sm font-semibold" style={{ color: "var(--luna-accent)" }}>
              {streak} {streak === 1 ? "dag" : "dagen"}
            </p>
          </div>
        </SectionCard>

        {/* Abonnement */}
        <SectionCard title="Abonnement">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: "var(--luna-text-primary)" }}>
              Gratis
            </p>
            <Link
              to="/pricing"
              className="text-xs font-medium px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: "var(--luna-accent)", color: "white" }}
            >
              Upgrade naar Pro
            </Link>
          </div>
        </SectionCard>

        {/* Juridisch */}
        <SectionCard title="Juridisch">
          <div className="space-y-3">
            <LinkRow icon={Shield} label="Privacy" to="/privacy" />
            <LinkRow icon={FileText} label="Voorwaarden" to="/voorwaarden" />
            <LinkRow icon={Mail} label="Contact" href="mailto:hello@luna.app" />
          </div>
        </SectionCard>

        {/* AI Disclosure */}
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: "var(--luna-bg-elev)", border: "1px solid var(--luna-border)" }}
        >
          <p className="text-xs" style={{ color: "var(--luna-text-muted)" }}>
            Luna is een AI-systeem. Je praat met een taalmodel, geen mens. We doen ons best om Luna veilig te maken maar fouten kunnen voorkomen.
          </p>
        </div>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full mt-4"
          style={{ borderColor: "rgba(239,68,68,0.3)", color: "rgba(239,68,68,0.8)" }}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Uitloggen
        </Button>

        <p className="text-center text-[10px] pt-4 pb-8" style={{ color: "var(--luna-text-muted)" }}>
          luna v0.1 · mei 2026
        </p>
      </div>

      <BottomNav />
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{ backgroundColor: "var(--luna-bg-elev)", border: "1px solid var(--luna-border)" }}
    >
      <h3 className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--luna-text-muted)" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function LinkRow({ icon: Icon, label, to, href }) {
  const content = (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" style={{ color: "var(--luna-text-muted)" }} />
        <span className="text-sm" style={{ color: "var(--luna-text-primary)" }}>{label}</span>
      </div>
      <ChevronRight className="w-4 h-4" style={{ color: "var(--luna-text-muted)" }} />
    </div>
  );

  if (href) return <a href={href}>{content}</a>;
  return <Link to={to}>{content}</Link>;
}