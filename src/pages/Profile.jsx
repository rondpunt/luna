import { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Gem, Shield, FileText, Mail, LogOut, Bell, FolderHeart, Info, Settings2 } from "lucide-react";
import ChatSettingsSheet from "@/components/chat/ChatSettingsSheet";

export default function Profile() {
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });
  const [loggingOut, setLoggingOut] = useState(false);
  const [showChatSettings, setShowChatSettings] = useState(false);

  const name = user?.full_name || "Jij";
  const email = user?.email || "";
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    setLoggingOut(true);
    await base44.auth.logout();
  };

  return (
    <div className="px-4 pt-6 pb-8 space-y-6">

      {/* Avatar */}
      <div className="flex flex-col items-center gap-2.5 py-2">
        <div
          className="h-[64px] w-[64px] rounded-[20px] flex items-center justify-center text-[22px] font-semibold text-white"
          style={{
            background: "#C25A32",
            boxShadow: "0 6px 20px rgba(194,90,50,0.22)",
          }}
        >
          {initials}
        </div>
        <div className="text-center space-y-0.5">
          <p
            className="text-[18px] font-bold leading-tight"
            style={{ color: "var(--text)", letterSpacing: "-0.2px" }}
          >
            {name}
          </p>
          <p className="text-[13px]" style={{ color: "var(--text-3)" }}>{email}</p>
        </div>

        {/* Luna AI badge */}
        <div className="chip mt-1.5" style={{ background: "rgba(194,90,50,0.08)", borderColor: "rgba(194,90,50,0.22)" }}>
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: "#34C77B" }} />
          <span style={{ color: "var(--text-2)" }}>Luna AI · je persoonlijke gezel</span>
        </div>
      </div>

      {/* Upgrade banner */}
      <Link to="/pricing" className="block btn-press">
        <div
          className="px-5 py-4 flex items-center gap-4"
          style={{
            background: "rgba(194,90,50,0.08)",
            border: "1px solid rgba(194,90,50,0.22)",
            borderRadius: 18,
          }}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "rgba(194,90,50,0.16)" }}
          >
            <Gem className="h-[18px] w-[18px]" style={{ color: "#C25A32" }} strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-semibold leading-tight" style={{ color: "var(--text)" }}>Luna Plus</p>
            <p className="text-[12.5px] mt-1" style={{ color: "var(--text-2)" }}>Onbeperkt · Geheugen · €9,99/mnd</p>
          </div>
          <ChevronRight className="h-[18px] w-[18px] shrink-0" style={{ color: "var(--text-3)" }} strokeWidth={1.8} />
        </div>
      </Link>

      {/* Account */}
      <Section label="Account">
        <Row icon={Bell}       label="Meldingen"    sub="Dagelijkse herinnering" to="/profile" />
        <Row icon={Gem}        label="Abonnement"   sub="Gratis plan"            to="/pricing" />
        <Row icon={FolderHeart}label="Gespreksmappen" sub="Organiseer je chats"  to="/chat/folders" />
        <Row
          icon={Settings2}
          label="Chat-instellingen"
          sub="Zoeken, pin, archief, datums…"
          onClick={() => setShowChatSettings(true)}
        />
        <Row icon={Shield}     label="Privacycentrum"                             to="/privacy-center" />
      </Section>

      {/* Over Luna */}
      <Section label="Over Luna">
        <div className="list-row gap-3" style={{ alignItems: "flex-start", paddingTop: 14, paddingBottom: 14 }}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(74,158,255,0.10)" }}>
            <Info className="h-[18px] w-[18px]" style={{ color: "#4A9EFF" }} strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-medium leading-tight" style={{ color: "var(--text)" }}>Wat is Luna?</p>
            <p className="text-[12.5px] mt-1 leading-[1.5]" style={{ color: "var(--text-2)" }}>
              Een rustige AI-gezel voor ondersteunende gesprekken. Geen therapeut, wel altijd beschikbaar.
            </p>
          </div>
        </div>
        <Row icon={FileText}   label="Privacybeleid"  to="/privacy" />
        <Row icon={FileText}   label="Gebruiksvoorwaarden" to="/voorwaarden" />
        <Row icon={Mail}       label="Feedback sturen" to="/contact" />
      </Section>

      {/* Logout */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="w-full flex items-center justify-center gap-2 text-[14.5px] font-semibold btn-press"
        style={{
          height: 52,
          background: "var(--bg-card)",
          border: "1px solid var(--line-subtle)",
          borderRadius: 18,
          color: "#F04747",
        }}
      >
        <LogOut className="h-[16px] w-[16px]" strokeWidth={2} />
        {loggingOut ? "Bezig…" : "Uitloggen"}
      </button>

      <p className="text-center text-[12px]" style={{ color: "var(--text-4)" }}>
        Luna v1.0 · Gemaakt met zorg in België
      </p>

      {showChatSettings && <ChatSettingsSheet onClose={() => setShowChatSettings(false)} />}
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div>
      <p className="text-[13px] font-semibold mb-2.5 px-1" style={{ color: "var(--text-2)", letterSpacing: "-0.1px" }}>
        {label}
      </p>
      <div className="list-group">{children}</div>
    </div>
  );
}

function Row({ icon: Icon, label, sub, to, value, onClick }) {
  const color = "#C25A32";
  const inner = (
    <div className="list-row gap-3 w-full">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: `${color}14` }}>
        <Icon className="h-[18px] w-[18px]" style={{ color }} strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium leading-tight" style={{ color: "var(--text)" }}>{label}</p>
        {sub && <p className="text-[12px] mt-1" style={{ color: "var(--text-3)" }}>{sub}</p>}
      </div>
      {value && <span className="text-[13px]" style={{ color: "var(--text-2)" }}>{value}</span>}
      {(to || onClick) && <ChevronRight className="h-[18px] w-[18px] shrink-0" style={{ color: "var(--text-4)" }} strokeWidth={1.8} />}
    </div>
  );
  if (to) return <Link to={to} className="btn-press">{inner}</Link>;
  if (onClick) return <button onClick={onClick} className="btn-press w-full text-left">{inner}</button>;
  return inner;
}