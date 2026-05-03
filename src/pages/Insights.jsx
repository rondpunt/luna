import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { format, subDays, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import ThemesList from "@/components/insights/ThemesList";
import InsightsEmpty from "@/components/insights/InsightsEmpty";

/**
 * Insights — rustig mobiel inzichten-scherm binnen de Luna design layer.
 * Bron: alleen echte Base44 entities (CheckIn, Conversation, JournalEntry).
 * Patronen hergebruikt:
 *   - AppShell topbar + bottom-nav (intact via route)
 *   - Page padding `px-4 pt-6 pb-6 space-y-6` (zelfde als Journal/Profile/Home)
 *   - card surface, list-group/list-row pattern
 *   - section heading 15px semibold (zoals Journal)
 *   - tokens: --bg-card, --line, --text, --text-2, --text-3, accent #C25A32
 */

export default function Insights() {
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });

  const { data: checkIns = [], isLoading: loadingCheckIns } = useQuery({
    queryKey: ["checkins-insights"],
    queryFn: () => base44.entities.CheckIn.list("-date", 30),
  });

  const { data: conversations = [], isLoading: loadingConvs } = useQuery({
    queryKey: ["conversations-insights"],
    queryFn: () => base44.entities.Conversation.list("-last_message_at", 200),
  });

  const { data: journalEntries = [], isLoading: loadingJournal } = useQuery({
    queryKey: ["journal-insights"],
    queryFn: () => base44.entities.JournalEntry.list("-created_date", 100),
  });

  const isLoading = loadingCheckIns || loadingConvs || loadingJournal;

  // Filter op user
  const myConversations = conversations.filter((c) => c.userId === user?.id);
  const myJournal = journalEntries.filter((e) => e.userId === user?.id);

  // 7-day series
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    const found = checkIns.find((c) => c.date === format(d, "yyyy-MM-dd"));
    return {
      day: format(d, "EEEEE", { locale: nl }),
      value: found?.score ?? null,
    };
  });

  const valid = checkIns.filter((c) => c.score != null);
  const hasEnoughTrend = valid.length >= 3;

  const avg = valid.length
    ? (valid.reduce((a, c) => a + c.score, 0) / valid.length).toFixed(1)
    : null;

  // Trend: laatste 3 vs vorige 3
  const last3 = valid.slice(0, 3);
  const prev3 = valid.slice(3, 6);
  const trendVal =
    last3.length === 3 && prev3.length === 3
      ? last3.reduce((a, c) => a + c.score, 0) / 3 -
        prev3.reduce((a, c) => a + c.score, 0) / 3
      : null;
  const trendLabel =
    trendVal === null ? null
    : trendVal > 0.3 ? "iets beter dan vorige week"
    : trendVal < -0.3 ? "iets zwaarder dan vorige week"
    : "stabiel deze week";

  const signals = valid.slice(0, 5);

  // Globale empty state: helemaal niets om te tonen
  const completelyEmpty =
    !isLoading &&
    valid.length === 0 &&
    myConversations.length === 0 &&
    myJournal.length === 0;

  return (
    <div className="px-4 pt-6 pb-6 space-y-6">

      {/* 1. Page title */}
      <div className="px-1 pt-1">
        <h1
          className="text-[26px] font-bold leading-[1.15]"
          style={{ color: "var(--text)", letterSpacing: "-0.4px" }}
        >
          Inzichten
        </h1>
      </div>

      {completelyEmpty ? (
        <InsightsEmpty />
      ) : (
        <>
          {/* 2. Samenvattingskaart */}
          <SummaryCard loading={isLoading} avg={avg} count={valid.length} trendLabel={trendLabel} />

          {/* 3. Trends */}
          <section>
            <h2 className="text-[15px] font-semibold mb-3 px-1" style={{ color: "var(--text)" }}>
              Trends
            </h2>
            <TrendsChart days={days} hasEnough={hasEnoughTrend} />
          </section>

          {/* 4. Terugkerende thema's */}
          <section>
            <h2 className="text-[15px] font-semibold mb-3 px-1" style={{ color: "var(--text)" }}>
              Terugkerende thema's
            </h2>
            <ThemesList conversations={myConversations} entries={myJournal} />
          </section>

          {/* 5. Recente signalen */}
          <section>
            <h2 className="text-[15px] font-semibold mb-3 px-1" style={{ color: "var(--text)" }}>
              Recente signalen
            </h2>
            {signals.length === 0 ? (
              <div className="card px-5 py-6 text-center">
                <p className="text-[14px]" style={{ color: "var(--text-2)" }}>
                  Nog geen check-ins om te tonen.
                </p>
                <p className="text-[12px] mt-1.5" style={{ color: "var(--text-3)" }}>
                  Voeg een check-in toe vanop Start.
                </p>
              </div>
            ) : (
              <div className="list-group">
                {signals.map((s) => (
                  <SignalRow key={s.id || s.date} signal={s} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

/* ── Samenvattingskaart ── */
function SummaryCard({ loading, avg, count, trendLabel }) {
  if (loading) {
    return (
      <div className="card px-5 py-5 space-y-2">
        <div className="h-4 w-2/3 rounded shimmer" />
        <div className="h-3 w-1/3 rounded shimmer" />
      </div>
    );
  }

  if (!avg) {
    return (
      <div className="card px-5 py-5">
        <p className="text-[15px] leading-[1.5]" style={{ color: "var(--text)" }}>
          Nog niet genoeg check-ins om iets te zeggen.
        </p>
        <p className="text-[13px] mt-1.5" style={{ color: "var(--text-3)" }}>
          Een paar dagen invullen geeft al een eerste beeld.
        </p>
      </div>
    );
  }

  return (
    <div className="card px-5 py-5">
      <p className="text-[16px] leading-[1.45]" style={{ color: "var(--text)", letterSpacing: "-0.1px" }}>
        Gemiddeld <span style={{ color: "#C25A32", fontWeight: 600 }}>{avg}/10</span> over {count} check-in{count === 1 ? "" : "s"}.
      </p>
      {trendLabel && (
        <p className="text-[13px] mt-1.5" style={{ color: "var(--text-3)" }}>
          Het gaat {trendLabel}.
        </p>
      )}
    </div>
  );
}

/* ── Trends chart (rustig, single line, geen grid) ── */
function TrendsChart({ days, hasEnough }) {
  if (!hasEnough) {
    return (
      <div className="card px-5 py-6 text-center">
        <p className="text-[14px]" style={{ color: "var(--text-2)" }}>
          Nog te weinig data voor een trend.
        </p>
        <p className="text-[12px] mt-1.5" style={{ color: "var(--text-3)" }}>
          Vanaf 3 check-ins toon ik een lijn.
        </p>
      </div>
    );
  }
  return (
    <div className="card px-4 pt-5 pb-3 overflow-hidden">
      <div style={{ height: 144, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={days} margin={{ top: 8, right: 12, left: 12, bottom: 4 }}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(240,240,242,0.40)", fontSize: 11 }}
              interval={0}
            />
            <YAxis hide domain={[0, 10]} />
            <Tooltip
              cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }}
              contentStyle={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--line-subtle)",
                borderRadius: 12,
                color: "var(--text)",
                fontSize: 12,
                padding: "6px 10px",
              }}
              formatter={(v) => [v ? `${v}/10` : "–", "Stemming"]}
              labelFormatter={() => ""}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#C25A32"
              strokeWidth={2}
              connectNulls={false}
              dot={{ fill: "#C25A32", r: 3.5, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#C25A32", strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ── Signal row (niet tappable, geen chevron) ── */
function SignalRow({ signal }) {
  const date = signal.date ? parseISO(signal.date) : null;
  const dateLabel = date ? format(date, "EEEE d MMM", { locale: nl }) : "";
  const score = signal.score;

  const tone =
    score >= 7 ? { label: "Goede dag",    color: "#34C77B" }
    : score >= 5 ? { label: "Vlakke dag", color: "#F5A623" }
    : { label: "Zware dag",               color: "#F04747" };

  return (
    <div className="list-row gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium leading-tight" style={{ color: "var(--text)" }}>
          {tone.label}
        </p>
        <p className="text-[12px] mt-1" style={{ color: "var(--text-3)" }}>
          {dateLabel}
        </p>
      </div>
      <span
        className="text-[13px] font-semibold tabular-nums shrink-0"
        style={{ color: tone.color }}
      >
        {score}/10
      </span>
    </div>
  );
}