import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, differenceInDays, parseISO, subDays } from "date-fns";
import { nl } from "date-fns/locale";
import DailyRewardCard from "@/components/home/DailyRewardCard";

const MOOD_LABELS = {
  1: "Het is zwaar.", 2: "Het is zwaar.",
  3: "Niet makkelijk.", 4: "Niet makkelijk.",
  5: "Het gaat.", 6: "Het gaat.",
  7: "Goed.", 8: "Goed.",
  9: "Heel goed.", 10: "Heel goed.",
};

function returnNudge(checkIns) {
  if (!checkIns?.length) return "Eén minuut inchecken is genoeg om Luna beter te laten aansluiten.";
  const sorted = [...checkIns].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  const last = sorted[0];
  if (!last) return null;
  const daysSince = differenceInDays(new Date(), parseISO(last.created_date));
  if (daysSince > 14) return "Welkom terug. Goed dat je er weer bent.";
  const thisWeek = checkIns.filter((c) => differenceInDays(new Date(), parseISO(c.created_date)) < 7).length;
  if (thisWeek >= 7) return "Je ritme wordt zichtbaar. Luna houdt de lijn bij.";
  if (thisWeek >= 3) return "Je hebt deze week al een paar keer ingecheckt. Dat maakt patronen duidelijker.";
  if (daysSince <= 1) return "Je was hier gisteren ook. Blijf die lijn vasthouden.";
  return "Vandaag inchecken maakt morgen scherper terugkijken.";
}

function dailyStreak(checkIns, includeToday) {
  const dates = new Set((checkIns || []).map((c) => c.date || (c.created_date || "").split("T")[0]).filter(Boolean));
  const today = format(new Date(), "yyyy-MM-dd");
  if (includeToday) dates.add(today);

  let count = 0;
  let cursor = new Date();
  while (dates.has(format(cursor, "yyyy-MM-dd"))) {
    count += 1;
    cursor = subDays(cursor, 1);
  }
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
  const greeting = hour < 12 ? "Goedemorgen." : hour < 18 ? "Goedemiddag." : "Goedenavond.";
  const nudge = returnNudge(checkIns);
  const today = format(new Date(), "yyyy-MM-dd");
  const checkedToday = checkIns.some((c) => (c.date || (c.created_date || "").split("T")[0]) === today);
  const streak = dailyStreak(checkIns, saved || checkedToday);

  const saveAndChat = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await base44.entities.CheckIn.create({
        score: mood,
        date: format(new Date(), "yyyy-MM-dd"),
      });
      qc.invalidateQueries({ queryKey: ["checkins-home"] });
      navigate("/chat");
    } catch { navigate("/chat"); }
    setSaving(false);
  };

  const saveOnly = async () => {
    if (saving || saved) return;
    setSaving(true);
    try {
      await base44.entities.CheckIn.create({
        score: mood,
        date: format(new Date(), "yyyy-MM-dd"),
      });
      qc.invalidateQueries({ queryKey: ["checkins-home"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {}
    setSaving(false);
  };

  // Slider fill style
  const fillPct = ((mood - 1) / 9) * 100;

  return (
    <div
      className="px-6 fade-in"
      style={{ paddingTop: "calc(32px + env(safe-area-inset-top, 0px))" }}
    >
      {/* Greeting */}
      <h1
        className="font-display"
        style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}
      >
        {greeting}
      </h1>
      <p style={{ fontSize: 17, color: "var(--text-muted)", marginTop: 6, lineHeight: 1.5 }}>
        Hoe is het met je?
      </p>

      {/* Soft return nudge — geen streak, geen getallen */}
      {nudge && (
        <p
          style={{
            fontSize: 14,
            color: "var(--text-muted)",
            marginTop: 16,
            lineHeight: 1.5,
            textAlign: "center",
          }}
        >
          {nudge}
        </p>
      )}

      {/* Hero check-in card */}
      <div
        className="surface"
        style={{ padding: "28px 24px", marginTop: nudge ? 24 : 40, borderRadius: 24 }}
      >
        <p className="eyebrow" style={{ marginBottom: 16 }}>CHECK-IN</p>
        <h2
          className="font-display"
          style={{ fontSize: 24, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 24 }}
        >
          Wat zit er op je?
        </h2>

        {/* Mood slider */}
        <div>
          <input
            type="range"
            min={1}
            max={10}
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="mood-slider"
            style={{
              background: `linear-gradient(to right, #E8834A ${fillPct}%, rgba(255,255,255,0.06) ${fillPct}%)`,
            }}
            aria-label="Stemming 1 tot 10"
          />

          {/* Big number */}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <span
              className="font-display"
              style={{
                fontSize: 64,
                color: "#E8834A",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                display: "block",
              }}
            >
              {mood}
            </span>
            <span style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4, display: "block" }}>
              {MOOD_LABELS[mood]}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={saveAndChat}
            disabled={saving}
            className="btn btn-primary"
            style={{ fontSize: 15 }}
          >
            Praat met Luna
          </button>
          <button
            onClick={saveOnly}
            disabled={saving}
            className="btn btn-ghost"
            style={{ fontSize: 15, color: saved ? "#E8834A" : "var(--text-muted)" }}
          >
            {saved ? "Beloning vrijgespeeld." : "Alleen registreren"}
          </button>
        </div>

        <DailyRewardCard streak={streak} saved={saved} checkedToday={checkedToday} />
      </div>

      {/* Breathing room */}
      <div style={{ height: 40 }} />
    </div>
  );
}