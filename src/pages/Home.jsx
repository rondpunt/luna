import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, differenceInDays, parseISO, subDays } from "date-fns";
import { nl } from "date-fns/locale";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

import HeroMoodCard from "@/components/home/HeroMoodCard";
import ModeCarousel from "@/components/home/ModeCarousel";
import WeekTimeline from "@/components/home/WeekTimeline";

function returnNudge(checkIns) {
  if (!checkIns?.length) return "Een rustig moment om in te checken.";
  const sorted = [...checkIns].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  const last = sorted[0];
  if (!last) return null;
  const daysSince = differenceInDays(new Date(), parseISO(last.created_date));
  if (daysSince > 14) return "Welkom terug. Geen druk.";
  const thisWeek = checkIns.filter((c) => differenceInDays(new Date(), parseISO(c.created_date)) < 7).length;
  if (thisWeek >= 7) return "Elke dag aanwezig — dat telt.";
  if (thisWeek >= 3) return "Goed bezig deze week.";
  return "Fijn dat je er bent.";
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
  const greeting = hour < 6 ? "Goedenacht" : hour < 12 ? "Goedemorgen" : hour < 18 ? "Goedemiddag" : "Goedenavond";
  const firstName = user?.full_name?.split(" ")[0] || null;
  const nudge = returnNudge(checkIns);
  const today = format(new Date(), "yyyy-MM-dd");
  const checkedToday = checkIns.some((c) => (c.date || (c.created_date || "").split("T")[0]) === today);
  const streak = dailyStreak(checkIns, saved || checkedToday);

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
    <div className="fade-in" style={{
      padding: "calc(24px + env(safe-area-inset-top, 0px)) 20px 24px",
      display: "flex", flexDirection: "column", gap: 22,
    }}>

      {/* HEADER */}
      <header>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
          <p className="eyebrow-muted">{format(new Date(), "EEEE d MMMM", { locale: nl }).toUpperCase()}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {streak > 1 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  background: "rgba(232,131,74,0.08)",
                  border: "1px solid rgba(232,131,74,0.22)",
                  borderRadius: 999, padding: "5px 11px",
                }}
              >
                <Flame size={13} style={{ color: "#E8834A" }} strokeWidth={2.2} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#E8834A", letterSpacing: "-0.01em" }}>{streak}</span>
              </motion.div>
            )}
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-display"
          style={{ fontSize: 38, color: "var(--text)", letterSpacing: "-0.025em", lineHeight: 1.05, marginTop: 4 }}
        >
          {greeting}{firstName ? `,` : "."}
          {firstName && (
            <span style={{ color: "#E8834A", display: "block" }}>{firstName}.</span>
          )}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          style={{ fontSize: 15, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.45 }}
        >
          {nudge}
        </motion.p>
      </header>

      {/* HERO MOOD */}
      <HeroMoodCard
        mood={mood}
        setMood={setMood}
        onSave={saveOnly}
        onSaveAndChat={saveAndChat}
        saving={saving}
        saved={saved}
        checkedToday={checkedToday}
        onOpenChat={() => navigate("/chat")}
      />

      {/* MODE CAROUSEL */}
      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
          <h2 className="font-display" style={{ fontSize: 22, color: "var(--text)", letterSpacing: "-0.02em" }}>
            Waar heb je nu nood aan?
          </h2>
        </div>
        <ModeCarousel />
      </section>

      {/* WEEK TIMELINE */}
      <WeekTimeline checkIns={checkIns} />

      <div style={{ height: 8 }} />
    </div>
  );
}