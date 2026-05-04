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

/**
 * Home — premium, rustige dagelijkse startpagina.
 * Hergebruikt:
 *   - AppShell topbar/bottom-nav (intact via route)
 *   - Page padding `px-4 pt-6 pb-6 space-y-6` (zelfde als Journal/Insights/Profile)
 *   - card surface, list-group/list-row pattern
 *   - section heading 15px semibold (zelfde als Journal/Insights)
 *   - Luna tokens (--bg-card, --line, --text*, accent #C25A32)
 * Bron: alleen echte Base44 entities (User, CheckIn, Conversation, JournalEntry).
 */
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

  const firstName = user?.full_name?.split(" ")[0] || "";
  const hour = new Date().getHours();

  const greeting = (() => {
    const n = firstName ? `, ${firstName}` : "";
    if (hour < 12 && preferredMoments.includes("morning")) {
      return `Goedemorgen${n}. Hoe begin jij vandaag?`;
    }
    if (hour >= 19 && preferredMoments.includes("evening")) {
      return `Tijd om even te landen${n}.`;
    }
    if (preferredMoments.length > 0) {
      return `Fijn dat je er bent${n}.`;
    }
    const base = hour < 12 ? "Goedemorgen" : hour < 18 ? "Goedemiddag" : "Goedeavond";
    return `${base}${n}`;
  })();

  const completelyEmpty =
    !isLoading && myConvs.length === 0 && myJournal.length === 0 && !todayCheckin;

  const hasActivity = myConvs.length > 0 || myJournal.length > 0;
  const hasTodaySection = hasMoodPrompt; // alleen tonen als er iets te doen is

  return (
    <div className="px-4 pt-6 pb-6 space-y-6">

      {/* 1. Topgedeelte — gepersonaliseerde opener + streak inline */}
      <div className="px-1 pt-1">
        <div className="flex items-start gap-3 flex-wrap">
          <h1
            className="text-[26px] font-bold leading-[1.15] flex-1 min-w-0"
            style={{ color: "var(--text)", letterSpacing: "-0.4px" }}
          >
            {greeting}
          </h1>
          {!loadingCheckIns && <div className="pt-1.5"><StreakPill checkIns={checkIns} /></div>}
        </div>
      </div>

      {completelyEmpty ? (
        <>
          {/* 2. Primaire actie blijft ook in empty zichtbaar */}
          <PrimaryActionCard />
          {/* 5. Lege staat */}
          <HomeEmpty />
        </>
      ) : (
        <>
          {/* 2. Primaire actiekaart */}
          <PrimaryActionCard />

          {/* 2b. Luna's dagelijkse vraag */}
          <DailyQuestionCard />

          {/* 3. Vandaag */}
          {hasTodaySection && (
            <section>
              <div className="flex items-center justify-between mb-3 px-1 gap-3">
                <h2 className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>
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

          {/* 4. Recente activiteit */}
          {hasActivity && (
            <section>
              <h2 className="text-[15px] font-semibold mb-3 px-1" style={{ color: "var(--text)" }}>
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