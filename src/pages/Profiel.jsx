import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronRight, Download, Trash2, AlertTriangle,
  FileText, BookMarked, ClipboardCheck, Sparkles, Shield, LogOut
} from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { motion } from "framer-motion";
import { useFeatureVisibility } from "@/hooks/useFeatureVisibility";

function rhythmSentence(checkIns, user) {
  if (!checkIns?.length) return "Je bent hier voor het eerst. Fijn dat je er bent.";
  const thisWeek = checkIns.filter((c) => differenceInDays(new Date(), parseISO(c.created_date)) < 7).length;
  if (thisWeek >= 5) return "Je maakt hier ruimte voor jezelf. Mooi.";
  if (thisWeek >= 2) return "Je hebt er deze week meerdere keren bij stilgestaan.";
  const totalWeeks = user?.created_date ? Math.ceil(differenceInDays(new Date(), parseISO(user.created_date)) / 7) : null;
  if (totalWeeks && totalWeeks >= 4) return `Je bent hier nu meerdere weken. Mooi dat je dat doet.`;
  return "Goed dat je hier bent.";
}

function ListCard({ items }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.055)", borderRadius: 20, overflow: "hidden" }}>
      {items.map((item, i) => (
        item.href ? (
          <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <ListRow item={item} isLast={i === items.length - 1} />
          </a>
        ) : item.to ? (
          <Link key={item.label} to={item.to} style={{ textDecoration: "none" }}>
            <ListRow item={item} isLast={i === items.length - 1} />
          </Link>
        ) : (
          <button key={item.label} onClick={item.onClick} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}>
            <ListRow item={item} isLast={i === items.length - 1} />
          </button>
        )
      ))}
    </div>
  );
}

function ListRow({ item, isLast }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        height: 64, display: "flex", alignItems: "center", padding: "0 20px",
        justifyContent: "space-between", cursor: "pointer",
        background: hov ? "rgba(255,255,255,0.03)" : "transparent",
        borderBottom: !isLast ? "1px solid rgba(255,255,255,0.04)" : "none",
        transition: "background 0.12s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {item.icon && (
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: item.danger ? "rgba(184,85,74,0.08)" : "rgba(212,175,137,0.10)",
            border: item.danger ? "1px solid rgba(184,85,74,0.22)" : "1px solid rgba(212,175,137,0.22)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <item.icon size={16} style={{ color: item.danger ? "var(--crisis)" : "#D4AF89" }} strokeWidth={1.8} />
          </div>
        )}
        <div>
          <p style={{ fontSize: 14, fontWeight: 500, color: item.danger ? "var(--crisis)" : "var(--text)", lineHeight: 1 }}>{item.label}</p>
          {item.desc && <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{item.desc}</p>}
        </div>
      </div>
      <ChevronRight size={15} style={{ color: "var(--text-faint)" }} strokeWidth={1.5} />
    </div>
  );
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
  const { showPremium } = useFeatureVisibility();

  const rawName = user?.full_name || "";
  const name = rawName.length > 1 ? rawName : (user?.email?.split("@")[0] || "Jij");
  const email = user?.email || "";
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const memberSince = user?.created_date ? format(parseISO(user.created_date), "MMMM yyyy", { locale: nl }) : null;

  const handleLogout = async () => {
    setLoggingOut(true);
    await base44.auth.logout();
  };

  return (
    <div className="fade-in px-5" style={{ paddingTop: "calc(28px + env(safe-area-inset-top, 0px))", paddingBottom: 8 }}>

      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
          border: "1px solid rgba(255,255,255,0.065)",
          borderRadius: 24, padding: "24px", marginBottom: 14,
          display: "flex", alignItems: "center", gap: 16,
        }}
      >
        <div style={{
          width: 62, height: 62, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, rgba(212,175,137,0.18), rgba(212,175,137,0.05))",
          border: "1.5px solid rgba(212,175,137,0.30)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span className="font-display" style={{ fontSize: 22, color: "#D4AF89" }}>{initials}</span>
        </div>
        <div style={{ flex: 1 }}>
          <p className="font-display" style={{ fontSize: 22, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>{name}</p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>{email}</p>
          {memberSince && <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2 }}>Lid sinds {memberSince}</p>}
        </div>
      </motion.div>

      {/* Subscription card — alleen na trial (7 dagen + 30 actieve minuten) */}
      {showPremium && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: "linear-gradient(145deg, rgba(61,42,77,0.40), rgba(212,175,137,0.06))",
            border: "1px solid rgba(212,175,137,0.22)",
            borderRadius: 22, padding: "22px 22px 18px", marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: 4 }}>ABONNEMENT</p>
              <p className="font-display" style={{ fontSize: 28, color: "var(--text)", letterSpacing: "-0.02em" }}>Gratis plan</p>
              <p style={{ fontSize: 13, color: "var(--text-soft)", marginTop: 2 }}>10 berichten per dag.</p>
            </div>
            <div style={{
              width: 46, height: 46, borderRadius: 14,
              background: "rgba(212,175,137,0.12)", border: "1px solid rgba(212,175,137,0.24)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Sparkles size={20} style={{ color: "#D4AF89" }} strokeWidth={1.8} />
            </div>
          </div>
          <Link to="/pricing" style={{ textDecoration: "none" }}>
            <button className="btn btn-primary press" style={{ fontSize: 14, height: 46 }}>
              <Sparkles size={14} strokeWidth={2} />
              Bekijk opties
            </button>
          </Link>
          <p style={{ fontSize: 11, color: "var(--text-faint)", textAlign: "center", marginTop: 8 }}>Maandelijks opzegbaar</p>
        </motion.div>
      )}

      {/* Ritme */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.055)",
          borderRadius: 18, padding: "16px 20px", marginBottom: 14,
        }}
      >
        <p className="eyebrow-muted" style={{ marginBottom: 8 }}>JOUW RITME</p>
        <p style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.55 }}>{rhythmSentence(checkIns, user)}</p>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Geen score. Geen druk. Gewoon dat je er bent.</p>
      </motion.div>

      {/* Tools */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: 14 }}
      >
        <p className="eyebrow-muted" style={{ marginBottom: 8, paddingLeft: 4 }}>TOOLS</p>
        <ListCard items={[
          { label: "Rapporten", icon: FileText, to: "/reports", desc: "Wekelijkse overzichten & exports" },
          { label: "Zelftesten", icon: ClipboardCheck, to: "/selftests", desc: "Screenings, geen diagnoses" },
        ]} />
      </motion.div>

      {/* Privacy & data */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: 14 }}
      >
        <p className="eyebrow-muted" style={{ marginBottom: 8, paddingLeft: 4 }}>DATA & PRIVACY</p>
        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.055)", borderRadius: 20, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Shield size={15} style={{ color: "#6BAD8A", flexShrink: 0, marginTop: 1 }} strokeWidth={1.8} />
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                Alles is end-to-end versleuteld. GDPR-compliant. Geen tracking. Geen ads. Niemand kan jouw data lezen — wij ook niet.
              </p>
            </div>
          </div>
          <ListCard items={[
            { label: "Exporteer mijn data", icon: Download, onClick: () => {} },
            { label: "Wis dit account", icon: Trash2, onClick: () => setShowDeleteConfirm(true), danger: true, desc: "Permanent en onomkeerbaar" },
          ]} />
        </div>
      </motion.div>

      {/* Legal */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: 14 }}
      >
        <p className="eyebrow-muted" style={{ marginBottom: 8, paddingLeft: 4 }}>JURIDISCH</p>
        <ListCard items={[
          { label: "Privacybeleid", to: "/privacy" },
          { label: "Algemene voorwaarden", to: "/voorwaarden" },
          { label: "Contact", to: "/contact" },
        ]} />
      </motion.div>

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: 8 }}
      >
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="btn btn-ghost press"
          style={{ fontSize: 14, display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)", height: 48 }}
        >
          <LogOut size={15} strokeWidth={1.5} />
          {loggingOut ? "Even geduld…" : "Uitloggen"}
        </button>
      </motion.div>

      <div style={{ height: 16 }} />

      {/* Delete confirm sheet */}
      {showDeleteConfirm && (
        <>
          <div className="fixed inset-0 z-[60]" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }} onClick={() => setShowDeleteConfirm(false)} />
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="fixed bottom-0 left-0 right-0 z-[70]"
            style={{ background: "#0F0F1A", borderRadius: "28px 28px 0 0", padding: "28px 24px calc(40px + env(safe-area-inset-bottom, 0px))", maxWidth: 480, margin: "0 auto", border: "1px solid rgba(255,255,255,0.06)", borderBottom: "none" }}
          >
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.12)", margin: "0 auto 24px" }} />
            <div style={{ textAlign: "center", marginBottom: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", margin: "0 auto 12px", background: "rgba(201,64,64,0.08)", border: "1px solid rgba(201,64,64,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AlertTriangle size={22} style={{ color: "var(--crisis)" }} strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="font-display" style={{ fontSize: 26, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.02em" }}>Account wissen?</h3>
            <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 6, lineHeight: 1.55 }}>Dit verwijdert direct alles. Geen herstel mogelijk.</p>
            <p style={{ fontSize: 13, color: "var(--text-faint)", marginBottom: 24, lineHeight: 1.5 }}>Al je gesprekken, dagboeknotities en check-ins worden permanent gewist.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-ghost press" style={{ flex: 1, fontSize: 14, height: 48 }}>Annuleren</button>
              <button className="btn btn-ghost-crisis press" style={{ flex: 1, fontSize: 14, height: 48 }}>Definitief wissen</button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}