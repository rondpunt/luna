import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import PrimaryActionCard from "@/components/home/PrimaryActionCard";
import TodayMoodRow from "@/components/home/TodayMoodRow";
import RecentActivityList from "@/components/home/RecentActivityList";
import HomeEmpty from "@/components/home/HomeEmpty";
import StreakPill from "@/components/home/StreakPill";
import DailyQuestionCard from "@/components/home/DailyQuestionCard";
import WeeklyProgressPill from "@/components/home/WeeklyProgressPill";

export default function Home() {
  const qc = useQueryClient();
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });

  const { data: prefsList = [] } = useQuery({
    queryKey: ["user-prefs", user?.id],
    queryFn: () => base44.entities.UserPreferences.filter({ userId: user.id }),
    enabled: !!user?.id,
  });
  const prefs = prefsList?.[0];
  const preferredMoments = prefs?.preferred_moments || [];

  const { data: checkIns = [], isLoading: loadingCheckIns } = useQuery({
    queryKey: ["checkins-home"],
    queryFn: () => base44.entities.CheckIn.list("-date", 7),
  });

  const { data: conversations = [], isLoading: loadingConvs } = useQuery({
    queryKey: ["conversations-home"],
    queryFn: () => base44.entities.Conversation.list("-last_message_at", 20),
  });

  const { data: journalEntries = [], isLoading: loadingJournal } = useQuery({
    queryKey: ["journal-home"],
    queryFn: () => base44.entities.JournalEntry.list("-updated_date", 20),
  });

  const isLoading = loadingCheckIns || loadingConvs || loadingJournal;

  const myConvs = conversations.filter((c) => c.userId === user?.id && !c.archived);
  const myJournal = journalEntries.filter((e) => e.userId === user?.id);

  const todayCheckin = checkIns.find((c) => c.date === today);
  const hasMoodPrompt = !todayCheckin;

  // Naam fix: splits volledige naam, val terug op email prefix, dan "daar"
  const rawName = user?.full_name || "";
  const firstName = rawName.length > 1
    ? rawName.split(" ")[0]
    : (user?.email?.split("@")[0] || "");
  const displayName = firstName.length > 1 ? firstName : null;

  const hour = new Date().getHours();

  const greeting = (() => {
    const n = displayName ? `, ${displayName}` : "";
    if (hour < 12 && preferredMoments.includes("morning")) return `Goedemorgen${n}. Hoe begin jij vandaag?`;
    if (hour >= 19 && preferredMoments.includes("evening")) return `Tijd om even te landen${n}.`;
    if (preferredMoments.length > 0) return `Fijn dat je er bent${n}.`;
    const base = hour < 12 ? "Goedemorgen" : hour < 18 ? "Goedemiddag" : "Goedeavond";
    return `${base}${n}`;
  })();

  const completelyEmpty = !isLoading && myConvs.length === 0 && myJournal.length === 0 && !todayCheckin;
  const hasActivity = myConvs.length > 0 || myJournal.length > 0;
  const hasTodaySection = hasMoodPrompt;

  return (
    <div className="px-4 pt-6 pb-6 space-y-5">

      {/* Header — greeting + streak */}
      <div className="flex items-start justify-between gap-3 px-1 pt-1">
        <div className="flex-1 min-w-0">
          {/* Kleine label boven greeting */}
          <p className="text-[11px] font-semibold uppercase mb-1.5 tracking-[1.2px]" style={{ color: "var(--text-3)" }}>
            {format(new Date(), "EEEE d MMMM").charAt(0).toUpperCase() + format(new Date(), "EEEE d MMMM").slice(1)}
          </p>
          <h1
            className="text-[27px] font-bold leading-[1.15]"
            style={{ color: "var(--text)", letterSpacing: "-0.5px" }}
          >
            {greeting}
          </h1>
        </div>
        {!loadingCheckIns && (
          <div className="pt-1.5 shrink-0">
            <StreakPill checkIns={checkIns} />
          </div>
        )}
      </div>

      {completelyEmpty ? (
        <>
          <PrimaryActionCard />
          <HomeEmpty />
        </>
      ) : (
        <>
          <PrimaryActionCard />
          <DailyQuestionCard />

          {hasTodaySection && (
            <section>
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-[13px] font-semibold uppercase tracking-[0.8px]" style={{ color: "var(--text-3)" }}>
                  Vandaag
                </h2>
                {!loadingCheckIns && <WeeklyProgressPill checkIns={checkIns} />}
              </div>
              <TodayMoodRow
                todayDate={today}
                onLogged={() => qc.invalidateQueries({ queryKey: ["checkins-home"] })}
              />
            </section>
          )}

          {hasActivity && (
            <section>
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.8px] mb-3 px-1" style={{ color: "var(--text-3)" }}>
                Recente activiteit
              </h2>
              <RecentActivityList conversations={myConvs} entries={myJournal} />
            </section>
          )}
        </>
      )}
    </div>
  );
}
