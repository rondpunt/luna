import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Lock, Download, Trash2, AlertTriangle, FileText, BookMarked, ClipboardCheck } from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import CrisisButton from "@/components/luna/CrisisButton";

function rhythmSentence(checkIns, user) {
  if (!checkIns?.length) return "Je bent hier voor het eerst. Fijn dat je er bent.";
  const totalWeeks = user?.created_date
    ? Math.ceil(differenceInDays(new Date(), parseISO(user.created_date)) / 7)
    : null;
  const thisWeek = checkIns.filter((c) => differenceInDays(new Date(), parseISO(c.created_date)) < 7).length;
  if (thisWeek >= 5) return "Je maakt hier ruimte voor jezelf. Mooi.";
  if (thisWeek >= 2) return "Je hebt er deze week meerdere keren even bij stilgestaan.";
  if (totalWeeks && totalWeeks >= 4) return `Je bent hier nu meerdere weken. Mooi dat je dat doet.`;
  return "Goed dat je hier bent.";
}

export default function Profiel() {
  const navigate = useNavigate();
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });
  const { data: checkIns = [] } = useQuery({
    queryKey: ["checkins-profiel"],
    queryFn: () => base44.entities.CheckIn.list("-created_date", 100),
  });
  const [loggingOut, setLoggingOut] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const rawName = user?.full_name || "";
  const name = rawName.length > 1 ? rawName : (user?.email?.split("@")[0] || "Jij");
  const email = user?.email || "";
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    setLoggingOut(true);
    await base44.auth.logout();
  };

  return (
    <div
      className="fade-in"
      style={{
        padding: "calc(32px + env(safe-area-inset-top, 0px)) 24px 40px",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      <CrisisButton />

      {/* Profile header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <div
          style={{
            width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
            background: "#14141E",
            border: "1px solid rgba(232,131,74,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <span className="font-display" style={{ fontSize: 22, color: "#E8834A" }}>{initials}</span>
        </div>
        <div>
          <p className="font-display" style={{ fontSize: 24, color: "var(--text)", letterSpacing: "-0.02em" }}>{name}</p>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>{email}</p>
        </div>
      </div>

      {/* Abonnement */}
      <div className="surface" style={{ padding: 24, marginBottom: 24 }}>
        <p className="eyebrow-muted" style={{ marginBottom: 12 }}>ABONNEMENT</p>
        <p className="font-display" style={{ fontSize: 32, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 8 }}>Gratis</p>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20 }}>10 berichten per dag.</p>
        <Link to="/pricing">
          <button className="btn btn-primary press" style={{ fontSize: 15 }}>Upgrade naar Luna Plus</button>
        </Link>
        <p style={{ fontSize: 12, color: "var(--text-faint)", textAlign: "center", marginTop: 8 }}>€9,99/maand. Maandelijks opzegbaar.</p>
      </div>

      {/* Jouw ritme */}
      <div className="surface" style={{ padding: "20px 24px", marginBottom: 24 }}>
        <p className="eyebrow-muted" style={{ marginBottom: 12 }}>JOUW RITME</p>
        <p style={{ fontSize: 16, color: "var(--text)", lineHeight: 1.55 }}>{rhythmSentence(checkIns, user)}</p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Geen score. Geen druk. Gewoon: dat je er bent.</p>
      </div>

      {/* Tools */}
      <p className="eyebrow-muted" style={{ marginBottom: 8, paddingLeft: 4 }}>TOOLS</p>
      <div className="surface" style={{ padding: 0, marginBottom: 24, overflow: "hidden" }}>
        {[
          { label: "Rapporten", icon: FileText, to: "/reports", desc: "Wekelijkse overzichten & exports" },
          { label: "Topic Vault", icon: BookMarked, to: "/vault", desc: "Wat steeds terugkomt" },
          { label: "Zelftesten", icon: ClipboardCheck, to: "/selftests", desc: "Screenings voor patronen, geen diagnoses" },
        ].map((item, i) => (
          <Link key={item.label} to={item.to} style={{ textDecoration: "none" }}>
            <div
              style={{
                height: 64, display: "flex", alignItems: "center",
                padding: "0 20px", justifyContent: "space-between",
                borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <item.icon size={18} style={{ color: "#E8834A" }} strokeWidth={1.5} />
                <div>
                  <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>{item.label}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.desc}</p>
                </div>
              </div>
              <ChevronRight size={16} style={{ color: "var(--text-faint)" }} strokeWidth={1.5} />
            </div>
          </Link>
        ))}
      </div>

      {/* Privacy & data */}
      <div className="surface" style={{ padding: 24, marginBottom: 24 }}>
        <p className="eyebrow-muted" style={{ marginBottom: 12 }}>JE DATA & PRIVACY</p>
        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 20 }}>
          Onder GDPR heb je altijd recht op inzage, export en verwijdering. Alles wat je hier zegt is end-to-end versleuteld. Niemand kan het lezen — wij ook niet. Geen tracking. Geen ads.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button className="btn btn-ghost press" style={{ fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
            <Download size={16} strokeWidth={1.5} />
            Exporteer mijn data
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn btn-ghost-crisis press"
            style={{ fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}
          >
            <Trash2 size={16} strokeWidth={1.5} />
            Wis dit account
          </button>
        </div>
      </div>

      {/* Legal */}
      <p className="eyebrow-muted" style={{ marginBottom: 8, paddingLeft: 4 }}>JURIDISCH</p>
      <div className="surface" style={{ padding: 0, marginBottom: 24, overflow: "hidden" }}>
        {[
          { label: "Privacybeleid", to: "/privacy" },
          { label: "Algemene voorwaarden", to: "/voorwaarden" },
          { label: "Contact", to: "/contact" },
        ].map((item, i, arr) => (
          <Link key={item.label} to={item.to} style={{ textDecoration: "none" }}>
            <div
              style={{
                height: 56, display: "flex", alignItems: "center",
                padding: "0 20px", justifyContent: "space-between",
                borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>{item.label}</span>
              <ChevronRight size={16} style={{ color: "var(--text-faint)" }} strokeWidth={1.5} />
            </div>
          </Link>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="btn btn-ghost"
        style={{ fontSize: 15, color: "var(--text-muted)", transition: "color 0.15s" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#D14D4D"}
        onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
      >
        {loggingOut ? "Even geduld…" : "Uitloggen"}
      </button>

      {/* Delete confirm */}
      {showDeleteConfirm && (
        <>
          <div className="fixed inset-0 z-[60]" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }} onClick={() => setShowDeleteConfirm(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-[70] fade-up" style={{ background: "#14141E", borderRadius: "28px 28px 0 0", padding: "32px 24px calc(40px + env(safe-area-inset-bottom, 0px))", maxWidth: 480, margin: "0 auto" }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", margin: "0 auto 24px" }} />
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <AlertTriangle size={28} style={{ color: "#D14D4D", marginBottom: 12 }} strokeWidth={1.5} />
            </div>
            <h3 className="font-display" style={{ fontSize: 24, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.02em" }}>Account wissen?</h3>
            <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 8 }}>Dit verwijdert direct alles. Geen herstel mogelijk.</p>
            <p style={{ fontSize: 13, color: "var(--text-faint)", marginBottom: 24 }}>Al je gesprekken, dagboeknotities en check-ins worden permanent gewist.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-ghost press" style={{ flex: 1, fontSize: 14 }}>Annuleren</button>
              <button className="btn press" style={{ flex: 1, fontSize: 14, background: "var(--crisis-soft)", border: "1px solid var(--crisis-border)", color: "#D14D4D", borderRadius: "var(--r-pill)" }}>
                Definitief wissen
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}