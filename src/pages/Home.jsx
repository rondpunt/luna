import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, differenceInDays, parseISO, subDays } from "date-fns";
import { nl } from "date-fns/locale";
import { motion } from "framer-motion";
import { Flame, MessageCircle, Zap, Wind, ChevronRight } from "lucide-react";
import { Orb } from "@/components/luna/Orb";

const MOOD_LABELS = {
  1: "Erg zwaar", 2: "Zwaar", 3: "Moeilijk", 4: "Niet makkelijk",
  5: "Het gaat", 6: "Redelijk", 7: "Goed", 8: "Goed",
  9: "Heel goed", 10: "Uitstekend",
};

const MOOD_COLORS = {
  1: "#C94040", 2: "#C94040", 3: "#D4A86B",
  4: "#D4A86B", 5: "#8A8278", 6: "#8A8278",
  7: "#6BAD8A", 8: "#6BAD8A", 9: "#E8834A", 10: "#E8834A",
};

function returnNudge(checkIns) {
  if (!checkIns?.length) return null;
  const sorted = [...checkIns].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  const last = sorted[0];
  if (!last) return null;
  const daysSince = differenceInDays(new Date(), parseISO(last.created_date));
  if (daysSince > 14) return "Welkom terug.";
  const thisWeek = checkIns.filter((c) => differenceInDays(new Date(), parseISO(c.created_date)) < 7).length;
  if (thisWeek >= 7) return "Elke dag aanwezig — dat telt.";
  if (thisWeek >= 3) return "Goed bezig deze week.";
  return null;
}

function dailyStreak(checkIns, includeToday) {
  const dates = new Set((checkIns || []).map((c) => c.date || (c.created_date || "").split("T")[0]).filter(Boolean));
  const today = format(new Date(), "yyyy-MM-dd");
  if (includeToday) dates.add(today);
  let count = 0;
  let cursor = new Date();
  while (dates.has(format(cursor, "yyyy-MM-dd"))) { count++; cursor = subDays(cursor, 1); }
  return count;
}

const QUICK_ACTIONS = [
  { label: "Chat", desc: "Praat vrijuit", icon: MessageCircle, to: "/chat", color: "#E8834A" },
  { label: "Reflex", desc: "Hoe reageer ik?", icon: Zap, to: "/reflex", color: "#E8834A" },
  { label: "Brain Dump", desc: "Gooi het eruit", icon: Wind, to: "/chat?mode=brain_dump", color: "#E8834A" },
];

export default function Home() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [mood, setMood] = useState(5);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });
  const { data: checkIns = [] } = useQuery({
    queryKey: ["checkins-home"],
    queryFn: () => base44.entities.CheckIn.list("-created_date", 30),
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Goedemorgen" : hour < 18 ? "Goedemiddag" : "Goedenavond";
  const firstName = user?.full_name?.split(" ")[0] || null;
  const nudge = returnNudge(checkIns);
  const today = format(new Date(), "yyyy-MM-dd");
  const checkedToday = checkIns.some((c) => (c.date || (c.created_date || "").split("T")[0]) === today);
  const streak = dailyStreak(checkIns, saved || checkedToday);
  const fillPct = ((mood - 1) / 9) * 100;
  const moodColor = MOOD_COLORS[mood] || "#E8834A";

  const saveAndChat = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await base44.entities.CheckIn.create({ score: mood, date: today });
      qc.invalidateQueries({ queryKey: ["checkins-home"] });
      navigate("/chat");
    } catch { navigate("/chat"); }
    setSaving(false);
  };

  const saveOnly = async () => {
    if (saving || saved) return;
    setSaving(true);
    try {
      await base44.entities.CheckIn.create({ score: mood, date: today });
      qc.invalidateQueries({ queryKey: ["checkins-home"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {}
    setSaving(false);
  };

  return (
    <div className="fade-in px-5" style={{ paddingTop: "calc(28px + env(safe-area-inset-top, 0px))", paddingBottom: 8 }}>

      {/* Greeting row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: 6 }}>{format(new Date(), "EEEE d MMMM", { locale: nl })}</p>
          <h1 className="font-display" style={{ fontSize: 34, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.0 }}>
            {greeting}{firstName ? `, ${firstName}.` : "."}
          </h1>
          {nudge && (
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>{nudge}</p>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {streak > 1 && (
            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "rgba(232,131,74,0.08)", border: "1px solid rgba(232,131,74,0.20)",
              borderRadius: 20, padding: "6px 12px",
            }}>
              <Flame size={14} style={{ color: "#E8834A" }} strokeWidth={2} />
              <span style={{ fontSize: 14, fontWeight: 600, color: "#E8834A" }}>{streak}</span>
            </div>
          )}
          <Orb size="sm" />
        </div>
      </div>

      {/* Check-in card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "linear-gradient(145deg, rgba(255,255,255,0.038), rgba(255,255,255,0.018))",
          border: "1px solid rgba(255,255,255,0.065)",
          borderRadius: 24,
          padding: "28px 24px",
          marginBottom: 16,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle accent glow */}
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 160, height: 160, borderRadius: "50%",
          background: `radial-gradient(circle, ${moodColor}18, transparent 70%)`,
          transition: "background 0.5s ease",
          pointerEvents: "none",
        }} />

        {/* Already checked today */}
        {checkedToday && !saved ? (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%", margin: "0 auto 16px",
              background: "rgba(107,173,138,0.10)", border: "1px solid rgba(107,173,138,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 22 }}>✓</span>
            </div>
            <p style={{ fontSize: 16, color: "var(--text)", fontWeight: 500, marginBottom: 4 }}>Vandaag ingecheckt.</p>
            <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Je kunt altijd met 66 praten.</p>
            <button onClick={() => navigate("/chat")} className="btn btn-ghost-accent press" style={{ marginTop: 20, height: 44, fontSize: 14 }}>
              Open chat
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <p className="eyebrow">HOE IS HET?</p>
              <motion.span
                key={mood}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: 13, fontWeight: 600, color: moodColor, transition: "color 0.3s" }}
              >
                {MOOD_LABELS[mood]}
              </motion.span>
            </div>

            {/* Big score + slider */}
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
              <motion.div
                key={mood}
                initial={{ scale: 0.85, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="font-display"
                style={{
                  fontSize: 72, lineHeight: 1, color: moodColor,
                  letterSpacing: "-0.04em", minWidth: 70, flexShrink: 0,
                  filter: `drop-shadow(0 0 20px ${moodColor}40)`,
                }}
              >
                {mood}
              </motion.div>
              <div style={{ flex: 1 }}>
                <input
                  type="range" min={1} max={10} value={mood}
                  onChange={(e) => setMood(Number(e.target.value))}
                  className="mood-slider"
                  style={{ background: `linear-gradient(to right, ${moodColor} ${fillPct}%, rgba(255,255,255,0.05) ${fillPct}%)` }}
                  aria-label="Stemming 1 tot 10"
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: "var(--text-faint)" }}>zwaar</span>
                  <span style={{ fontSize: 11, color: "var(--text-faint)" }}>uitstekend</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={saveAndChat} disabled={saving} className="btn btn-primary" style={{ flex: 2, height: 48, fontSize: 14 }}>
                <MessageCircle size={15} strokeWidth={2} />
                Praat met 66
              </button>
              <button onClick={saveOnly} disabled={saving} className="btn btn-ghost" style={{ flex: 1, height: 48, fontSize: 13, color: saved ? "#6BAD8A" : "var(--text-muted)" }}>
                {saved ? "Opgeslagen ✓" : "Registreer"}
              </button>
            </div>
          </>
        )}
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}
      >
        {QUICK_ACTIONS.map(({ label, desc, icon: Icon, to, color }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className="press"
            style={{
              padding: "18px 14px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.055)",
              borderRadius: 18,
              textAlign: "left",
              cursor: "pointer",
              transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.055)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.055)"; }}
          >
            <div style={{
              width: 34, height: 34, borderRadius: 10, marginBottom: 12,
              background: `${color}15`, border: `1px solid ${color}28`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon size={16} style={{ color }} strokeWidth={1.8} />
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{label}</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>{desc}</p>
          </button>
        ))}
      </motion.div>

      {/* Recent check-in history mini chart */}
      {checkIns.length > 2 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => navigate("/profiel")}
          className="press"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.055)",
            borderRadius: 20, padding: "18px 20px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            cursor: "pointer",
          }}
        >
          <div>
            <p className="eyebrow-muted" style={{ marginBottom: 6 }}>DEZE WEEK</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 32 }}>
              {[...checkIns].slice(0, 7).reverse().map((c, i) => {
                const h = Math.max(4, (c.score / 10) * 32);
                const col = MOOD_COLORS[c.score] || "#E8834A";
                return (
                  <div key={i} style={{
                    width: 8, height: h, borderRadius: 4,
                    background: col, opacity: 0.6 + (i / 7) * 0.4,
                  }} />
                );
              })}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Bekijk alles</span>
            <ChevronRight size={16} style={{ color: "var(--text-faint)" }} strokeWidth={1.5} />
          </div>
        </motion.div>
      )}

      <div style={{ height: 16 }} />
    </div>
  );
}