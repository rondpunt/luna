import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronRight, Download, Trash2, AlertTriangle,
  FileText, ClipboardCheck, Sparkles, Shield, LogOut,
  Zap, TrendingUp, BookOpen
} from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { motion } from "framer-motion";
import { useFeatureVisibility } from "@/hooks/useFeatureVisibility";
import JunieLogo from "@/components/brand/JunieLogo";

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
    <div style={{ background: "#FFFFFF", border: "1px solid var(--border)", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 8px rgba(45,42,58,0.04)" }}>
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
        height: 64, display: "flex", alignItems: "center", padding: "0 18px",
        justifyContent: "space-between", cursor: "pointer",
        background: hov ? "#FFF8F0" : "transparent",
        borderBottom: !isLast ? "1px solid var(--border)" : "none",
        transition: "background 0.12s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {item.icon && (
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: item.danger ? "#FFE5E5" : (item.color ? `${item.color}1F` : "#FFF0E5"),
            border: item.danger ? "1px solid #F4A8A8" : (item.color ? `1px solid ${item.color}55` : "1px solid #F0925E55"),
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <item.icon size={16} style={{ color: item.danger ? "#DC4545" : (item.color || "#F0925E") }} strokeWidth={2.2} />
          </div>
        )}
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: item.danger ? "#DC4545" : "var(--text)", lineHeight: 1 }}>{item.label}</p>
          {item.desc && <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>{item.desc}</p>}
        </div>
      </div>
      <ChevronRight size={15} style={{ color: "var(--text-muted)" }} strokeWidth={2} />
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
    <div className="fade-in px-5" style={{ paddingTop: "calc(24px + env(safe-area-inset-top, 0px))", paddingBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <p className="eyebrow-muted">INSTELLINGEN</p>
        <JunieLogo variant="mark" size={28} />
      </div>

      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "linear-gradient(135deg, #FFF0E5, #FFE5D2)",
          border: "1.5px solid #F0925E33",
          borderRadius: 22, padding: "22px", marginBottom: 14,
          display: "flex", alignItems: "center", gap: 16,
          boxShadow: "0 6px 20px rgba(240, 146, 94, 0.14)",
        }}
      >
        <div style={{
          width: 60, height: 60, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #F0925E, #EC6F6F)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 6px 16px rgba(240, 146, 94, 0.35)",
        }}>
          <span className="font-display-bold" style={{ fontSize: 22, color: "#FFFFFF" }}>{initials}</span>
        </div>
        <div style={{ flex: 1 }}>
          <p className="font-display-bold" style={{ fontSize: 20, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>{name}</p>
          <p style={{ fontSize: 13, color: "var(--text-soft)", marginTop: 3 }}>{email}</p>
          {memberSince && <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Lid sinds {memberSince}</p>}
        </div>
      </motion.div>

      {/* Subscription card */}
      {showPremium && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: "linear-gradient(135deg, #EEF3FB, #E5EDF8)",
            border: "1.5px solid #6A9AD933",
            borderRadius: 22, padding: "20px 20px 18px", marginBottom: 14,
            boxShadow: "0 6px 20px rgba(106, 154, 217, 0.14)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: 4, color: "#3A7BC4" }}>ABONNEMENT</p>
              <p className="font-display-bold" style={{ fontSize: 24, color: "var(--text)", letterSpacing: "-0.02em" }}>Gratis plan</p>
              <p style={{ fontSize: 13, color: "var(--text-soft)", marginTop: 2 }}>10 berichten per dag.</p>
            </div>
            <div style={{
              width: 46, height: 46, borderRadius: 14,
              background: "linear-gradient(135deg, #6A9AD9, #5589C9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 14px rgba(106, 154, 217, 0.42)",
            }}>
              <Sparkles size={20} style={{ color: "#FFFFFF" }} strokeWidth={2.2} />
            </div>
          </div>
          <Link to="/pricing" style={{ textDecoration: "none" }}>
            <button className="btn btn-primary press" style={{ fontSize: 14, height: 46 }}>
              <Sparkles size={14} strokeWidth={2.4} />
              Bekijk opties
            </button>
          </Link>
          <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 8 }}>Maandelijks opzegbaar</p>
        </motion.div>
      )}

      {/* Ritme */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "#FFFFFF", border: "1px solid var(--border)",
          borderRadius: 18, padding: "16px 20px", marginBottom: 14,
          boxShadow: "0 2px 8px rgba(45,42,58,0.04)",
        }}
      >
        <p className="eyebrow-muted" style={{ marginBottom: 8 }}>JOUW RITME</p>
        <p style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.55 }}>{rhythmSentence(checkIns, user)}</p>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Geen score. Geen druk. Gewoon dat je er bent.</p>
      </motion.div>

      {/* Extra tools */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.13, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: 14 }}
      >
        <p className="eyebrow-muted" style={{ marginBottom: 8, paddingLeft: 4 }}>EXTRA TOOLS</p>
        <ListCard items={[
          { label: "Reflex",     icon: Zap,         to: "/reflex",   desc: "Concreet advies bij een situatie", color: "#6A9AD9" },
          { label: "Dagboek",    icon: BookOpen,    to: "/diary",    desc: "Dagelijkse diary card",            color: "#9B7FC4" },
          { label: "Voortgang",  icon: TrendingUp,  to: "/voortgang", desc: "Trends en patronen",              color: "#7BC096" },
        ]} />
      </motion.div>

      {/* Rapportage */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: 14 }}
      >
        <p className="eyebrow-muted" style={{ marginBottom: 8, paddingLeft: 4 }}>RAPPORTAGE</p>
        <ListCard items={[
          { label: "Rapporten",  icon: FileText,         to: "/reports",   desc: "Wekelijkse overzichten & exports", color: "#F0C674" },
          { label: "Zelftesten", icon: ClipboardCheck,   to: "/selftests", desc: "Screenings, geen diagnoses",       color: "#F0925E" },
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
        <div style={{ background: "#FFFFFF", border: "1px solid var(--border)", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 8px rgba(45,42,58,0.04)" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "#EEF8F1" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Shield size={15} style={{ color: "#5BAE7A", flexShrink: 0, marginTop: 1 }} strokeWidth={2.2} />
              <p style={{ fontSize: 13, color: "#3D7A52", lineHeight: 1.6 }}>
                Alles is end-to-end versleuteld. GDPR-compliant. Geen tracking. Geen ads. Niemand kan jouw data lezen — wij ook niet.
              </p>
            </div>
          </div>
          <ListCard items={[
            { label: "Exporteer mijn data", icon: Download, onClick: () => {}, color: "#6A9AD9" },
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
          style={{ fontSize: 14, display: "flex", alignItems: "center", gap: 8, color: "var(--text-soft)", height: 48 }}
        >
          <LogOut size={15} strokeWidth={2} />
          {loggingOut ? "Even geduld…" : "Uitloggen"}
        </button>
      </motion.div>

      <div style={{ height: 16 }} />

      {/* Delete confirm sheet */}
      {showDeleteConfirm && (
        <>
          <div className="fixed inset-0 z-[60]" style={{ background: "rgba(45,42,58,0.45)", backdropFilter: "blur(8px)" }} onClick={() => setShowDeleteConfirm(false)} />
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="fixed bottom-0 left-0 right-0 z-[70]"
            style={{ background: "#FFFFFF", borderRadius: "28px 28px 0 0", padding: "28px 24px calc(40px + env(safe-area-inset-bottom, 0px))", maxWidth: 480, margin: "0 auto", border: "1px solid var(--border)", borderBottom: "none", boxShadow: "0 -10px 40px rgba(45,42,58,0.18)" }}
          >
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "#F0E6D8", margin: "0 auto 24px" }} />
            <div style={{ textAlign: "center", marginBottom: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", margin: "0 auto 12px", background: "#FFE5E5", border: "1.5px solid #F4A8A8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AlertTriangle size={22} style={{ color: "#DC4545" }} strokeWidth={2} />
              </div>
            </div>
            <h3 className="font-display-bold" style={{ fontSize: 24, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.02em" }}>Account wissen?</h3>
            <p style={{ fontSize: 15, color: "var(--text-soft)", marginBottom: 6, lineHeight: 1.55 }}>Dit verwijdert direct alles. Geen herstel mogelijk.</p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24, lineHeight: 1.5 }}>Al je gesprekken, dagboeknotities en check-ins worden permanent gewist.</p>
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