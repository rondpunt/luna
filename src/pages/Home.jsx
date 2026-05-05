import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, differenceInDays, parseISO } from "date-fns";
import { Wind } from "lucide-react";
import PrimaryActionCard from "@/components/home/PrimaryActionCard";
import RecentActivityList from "@/components/home/RecentActivityList";
import HomeEmpty from "@/components/home/HomeEmpty";
import TodayMoodRow from "@/components/home/TodayMoodRow";
import { Skeleton } from "@/components/ui/skeleton";
import { useDailyReminder } from "@/hooks/useDailyReminder";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { USER_PREFERENCES_QUERY_KEY, fetchUserPreferencesRow } from "@/hooks/useChatSettings";

const MOOD_LABELS = {
  1: "Het is zwaar.", 2: "Het is zwaar.",
  3: "Niet makkelijk.", 4: "Niet makkelijk.",
  5: "Het gaat.", 6: "Het gaat.",
  7: "Goed.", 8: "Goed.",
  9: "Heel goed.", 10: "Heel goed.",
};

function returnNudge(checkIns) {
  if (!checkIns?.length) return null;
  const sorted = [...checkIns].sort((a, b) => Date.parse(String(b.created_date)) - Date.parse(String(a.created_date)));
  const last = sorted[0];
  if (!last) return null;
  const daysSince = differenceInDays(new Date(), parseISO(last.created_date));
  if (daysSince > 14) return "Welkom terug. Goed dat je er weer bent.";
  const thisWeek = checkIns.filter((c) => differenceInDays(new Date(), parseISO(c.created_date)) < 7).length;
  if (thisWeek >= 7) return "Je maakt hier ruimte voor jezelf. Mooi.";
  if (thisWeek >= 3) return "Je hebt er deze week meerdere keren even bij stilgestaan.";
  if (daysSince <= 1) return "Je was hier gisteren ook.";
  return null;
}

function HomeSkeleton() {
  return (
    <div className="luna-page space-y-4 animate-pulse pb-8">
      <Skeleton className="h-10 w-48 rounded-lg bg-white/10" />
      <Skeleton className="h-5 w-full max-w-sm rounded-md bg-white/10" />
      <Skeleton className="h-40 w-full rounded-2xl bg-white/10" />
      <Skeleton className="h-32 w-full rounded-2xl bg-white/10" />
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [mood, setMood] = useState(5);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const todayDate = format(new Date(), "yyyy-MM-dd");

  const { isLoading: loadingCheckins, data: checkIns = [] } = useQuery({
    queryKey: ["checkins-home"],
    queryFn: () => base44.entities.CheckIn.list("-created_date", 30),
  });

  const { isLoading: loadingConversations, data: conversations = [] } = useQuery({
    queryKey: ["conversations-home"],
    queryFn: () => base44.entities.Conversation.list("-created_date", 15),
  });

  const { isLoading: loadingDiary, data: diaryEntries = [] } = useQuery({
    queryKey: ["diary-entries-home"],
    queryFn: async () => {
      try {
        const list = base44.entities.DiaryEntry?.list;
        if (typeof list !== "function") return [];
        return list("-updated_date", 12);
      } catch {
        return [];
      }
    },
  });

  const { data: prefsHome } = useQuery({
    queryKey: USER_PREFERENCES_QUERY_KEY,
    queryFn: fetchUserPreferencesRow,
  });

  const reminderEnabled = !!(prefsHome?.notificationTime && prefsHome.notificationTime !== "none");
  useDailyReminder({
    enabled: reminderEnabled,
    label: "Even een minuutje voor jezelf met Luna?",
  });
  useDocumentTitle("");

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Goedemorgen." : hour < 18 ? "Goedemiddag." : "Goedenavond.";
  const nudge = returnNudge(checkIns);
  const fillPct = ((mood - 1) / 9) * 100;

  const activityLoading = loadingConversations || loadingDiary;
  const showActivitySkeleton = activityLoading && conversations.length === 0 && diaryEntries.length === 0;

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
    } catch {
      navigate("/chat");
    }
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
    } catch { /* silent */ }
    setSaving(false);
  };

  if (loadingCheckins) {
    return <HomeSkeleton />;
  }

  const hasActivity =
    (conversations?.length > 0 || diaryEntries?.length > 0) &&
    !showActivitySkeleton;

  return (
    <div className="luna-page fade-in pb-8">
      <p className="eyebrow-muted" style={{ marginBottom: 10 }}>
        Vandaag
      </p>
      <h1
        className="font-display"
        style={{ fontSize: 34, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}
      >
        {greeting}
      </h1>
      <p style={{ fontSize: 17, color: "var(--text-muted)", marginTop: 10, lineHeight: 1.55 }}>
        Hoe is het met je?
      </p>

      {nudge && (
        <p
          className="text-center"
          style={{
            fontSize: 14,
            color: "var(--text-muted)",
            marginTop: 20,
            lineHeight: 1.55,
          }}
        >
          {nudge}
        </p>
      )}

      <p
        style={{
          fontSize: 11,
          color: "var(--text-4)",
          marginTop: 20,
          lineHeight: 1.5,
          textAlign: "center",
          maxWidth: 320,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Tip: open een bestaand gesprek via{" "}
        <span style={{ color: "var(--text-3)" }}>/chat?conv=…</span>
        {" "}· Veeg op je telefoon omlaag om te verversen waar het kan.
      </p>

      <div className="mt-8 space-y-6">
        <PrimaryActionCard />

        <Link
          to="/rust"
          className="card flex items-center gap-4 px-4 py-4 btn-press transition-opacity hover:opacity-95"
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
            style={{ background: "rgba(232,131,74,0.12)", border: "1px solid rgba(232,131,74,0.25)" }}
          >
            <Wind className="h-6 w-6" style={{ color: "#E8834A" }} strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>
              Rust & gronding
            </p>
            <p className="text-[13px] mt-0.5" style={{ color: "var(--text-3)" }}>
              Box-adem en 5-4-3-2-1 — een paar minuten voor jezelf.
            </p>
          </div>
        </Link>

        <TodayMoodRow
          todayDate={todayDate}
          onLogged={() => {
            qc.invalidateQueries({ queryKey: ["checkins-home"] });
            qc.invalidateQueries({ queryKey: ["conversations-home"] });
          }}
        />
      </div>

      <div style={{ marginTop: "var(--section-gap)" }}>
        <p className="eyebrow-muted" style={{ marginBottom: 12, paddingLeft: 2 }}>
          Check-in
        </p>
        <div
          className="surface"
          style={{ padding: "var(--space-3) var(--space-2)", borderRadius: 24 }}
        >
          <h2
            className="font-display"
            style={{ fontSize: 22, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 6 }}
          >
            Wat zit er op je?
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 20, lineHeight: 1.5 }}>
            Stemming — geen oordeel, alleen even peilen.
          </p>

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

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <span
                className="font-display"
                style={{
                  fontSize: 56,
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

          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
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
              {saved ? "Genoteerd." : "Alleen registreren"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "var(--section-gap)" }}>
        <p className="eyebrow-muted" style={{ marginBottom: 12, paddingLeft: 2 }}>
          Recent
        </p>
        {showActivitySkeleton ? (
          <div className="list-group p-4 space-y-3">
            <Skeleton className="h-14 w-full rounded-xl bg-white/10" />
            <Skeleton className="h-14 w-full rounded-xl bg-white/10" />
            <Skeleton className="h-14 w-full rounded-xl bg-white/10" />
          </div>
        ) : hasActivity ? (
          <RecentActivityList conversations={conversations} entries={diaryEntries} />
        ) : (
          <HomeEmpty />
        )}
      </div>

      <div style={{ height: 32 }} />
    </div>
  );
}
