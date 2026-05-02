import { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Gem, Shield, FileText, Mail, LogOut, Bell, FolderHeart, Info } from "lucide-react";

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
    <div className="px-4 pt-6 pb-8 space-y-6">

      {/* Avatar */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div
          className="h-[76px] w-[76px] rounded-[24px] flex items-center justify-center text-[26px] font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #ee9670, #c25a32)", boxShadow: "0 8px 32px rgba(194,90,50,0.30)" }}
        >
          {initials}
        </div>
        <div className="text-center space-y-0.5">
          <p className="text-[20px] font-bold" style={{ color: "var(--text)", letterSpacing: "-0.3px" }}>{name}</p>
          <p className="text-[14px]" style={{ color: "var(--text-2)" }}>{email}</p>
        </div>

        {/* Luna AI badge */}
        <div
          className="flex items-center gap-2 rounded-full px-3.5 py-2 mt-1"
          style={{ background: "rgba(194,90,50,0.10)", border: "1px solid rgba(194,90,50,0.25)" }}
        >
          <div className="h-2 w-2 rounded-full" style={{ background: "#34C77B" }} />
          <p className="text-[13px] font-medium" style={{ color: "var(--text-2)" }}>
            Luna AI · je persoonlijke gezel
          </p>
        </div>
      </div>

      {/* Upgrade banner */}
      <Link to="/pricing" className="block btn-press">
        <div
          className="rounded-2xl px-4 py-4 flex items-center gap-4"
          style={{
            background: "linear-gradient(135deg, rgba(194,90,50,0.18) 0%, rgba(194,90,50,0.08) 100%)",
            border: "1px solid rgba(194,90,50,0.35)",
          }}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(194,90,50,0.22)" }}>
            <Gem className="h-5 w-5" style={{ color: "#C25A32" }} strokeWidth={1.8} />
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>Luna Plus</p>
            <p className="text-[13px] mt-0.5" style={{ color: "var(--text-2)" }}>Onbeperkt · Geheugen · €9,99/mnd</p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0" style={{ color: "var(--text-3)" }} />
        </div>
      </Link>

      {/* Account */}
      <Section label="Account">
        <Row icon={Bell}       label="Meldingen"    sub="Dagelijkse herinnering" to="/profile" />
        <Row icon={Gem}        label="Abonnement"   sub="Gratis plan"            to="/pricing" />
        <Row icon={FolderHeart}label="Gespreksmappen" sub="Organiseer je chats"  to="/chat/folders" />
        <Row icon={Shield}     label="Privacycentrum"                             to="/privacy-center" />
      </Section>

      {/* Over Luna */}
      <Section label="Over Luna">
        <div className="list-row gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(74,158,255,0.12)" }}>
            <Info className="h-[17px] w-[17px]" style={{ color: "#4A9EFF" }} strokeWidth={1.8} />
          </div>
          <div className="flex-1 py-0.5">
            <p className="text-[14px] font-medium" style={{ color: "var(--text)" }}>Wat is Luna?</p>
            <p className="text-[12px] mt-0.5 leading-5" style={{ color: "var(--text-2)" }}>
              Luna is een AI-gezel voor rustige, ondersteunende gesprekken. Geen therapeut, geen dokter — wel altijd aanwezig.
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
        className="w-full list-group py-4 flex items-center justify-center gap-2 text-[15px] font-semibold btn-press"
        style={{ color: "#F04747" }}
      >
        <LogOut className="h-4 w-4" />
        {loggingOut ? "Bezig…" : "Uitloggen"}
      </button>

      <p className="text-center text-[12px]" style={{ color: "var(--text-4)" }}>
        Luna v1.0 · Gemaakt met zorg in België
      </p>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div>
      <p className="text-[12px] font-semibold uppercase tracking-widest mb-2.5 px-1" style={{ color: "var(--text-3)" }}>
        {label}
      </p>
      <div className="list-group">{children}</div>
    </div>
  );
}

function Row({ icon: Icon, label, sub, to, value }) {
  const color = "#C25A32";
  const inner = (
    <div className="list-row gap-3.5 w-full">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: `${color}18` }}>
        <Icon className="h-[17px] w-[17px]" style={{ color }} strokeWidth={1.8} />
      </div>
      <div className="flex-1 py-0.5">
        <p className="text-[15px] font-medium" style={{ color: "var(--text)" }}>{label}</p>
        {sub && <p className="text-[12px] mt-0.5" style={{ color: "var(--text-2)" }}>{sub}</p>}
      </div>
      {value && <span className="text-[14px]" style={{ color: "var(--text-2)" }}>{value}</span>}
      {to && <ChevronRight className="h-4 w-4 shrink-0" style={{ color: "var(--text-3)" }} />}
    </div>
  );
  if (to) return <Link to={to} className="btn-press">{inner}</Link>;
  return inner;
}