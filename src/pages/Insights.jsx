import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { format, subDays, parseISO } from "date-fns";
import { nl } from "date-fns/locale";

/**
 * Insights — mobiel scanbaar wellbeing-overzicht.
 * Patronen:
 *  - Luna AppShell topbar/bottom-nav (intact via route)
 *  - Luna page padding + card + list-group/list-row
 *  - react-native-gifted-charts referentie:
 *      • single compact line chart, spotpunten op data, rust rondom
 *      • geen grid, minimale ticks, geen y-axis labels
 *      • rustige fallback bij onvoldoende data
 */

const THEMES = [
  { label: "Werkdruk", pct: 80, color: "#C25A32" },
  { label: "Slaap",    pct: 60, color: "#4A9EFF" },
  { label: "Relaties", pct: 45, color: "#34C77B" },
  { label: "Focus",    pct: 40, color: "#F5A623" },
];

export default function Insights() {
  const { data: checkIns = [], isLoading } = useQuery({
    queryKey: ["checkins-insights"],
    queryFn: () => base44.entities.CheckIn.list("-date", 30),
  });

  // 7-day series
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    const found = checkIns.find((c) => c.date === format(d, "yyyy-MM-dd"));
    return {
      day: format(d, "EEEEE", { locale: nl }),
      value: found?.score ?? null,
      fullDate: d,
    };
  });

  const valid = checkIns.filter((c) => c.score != null);
  const hasEnough = valid.length >= 3;

  const avg = valid.length
    ? (valid.reduce((a, c) => a + c.score, 0) / valid.length).toFixed(1)
    : null;

  // Trend: last 3 vs prev 3
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

  // Recent signals: 3-5 recente check-ins met datum
  const signals = valid.slice(0, 5);

  return (
    <div className="px-4 pt-6 pb-6 space-y-6">

      {/* 1. Page title (AppShell levert topbar) */}
      <div className="px-1">
        <h1 className="text-[28px] font-bold leading-tight" style={{ color: "var(--text)", letterSpacing: "-0.4px" }}>
          Inzichten
        </h1>
      </div>

      {/* 2. Samenvattingskaart — max 2 regels + 1 ondersteunende statusregel */}
      <SummaryCard
        loading={isLoading}
        avg={avg}
        count={valid.length}
        trendLabel={trendLabel}
      />

      {/* 3. Trends — exact 1 chart */}
      <section>
        <h2 className="text-[15px] font-semibold mb-3 px-1" style={{ color: "var(--text)" }}>
          Trends
        </h2>
        <TrendsChart days={days} hasEnough={hasEnough} />
      </section>

      {/* 4. Terugkerende thema's — rustige bars in list-group */}
      <section>
        <h2 className="text-[15px] font-semibold mb-3 px-1" style={{ color: "var(--text)" }}>
          Terugkerende thema's
        </h2>
        <div className="list-group">
          {THEMES.map(({ label, pct, color }) => (
            <div key={label} className="list-row gap-4">
              <span className="w-20 text-[14px] font-medium shrink-0" style={{ color: "var(--text)" }}>
                {label}
              </span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: color }} />
              </div>
              <span className="text-[12px] font-medium w-9 text-right shrink-0" style={{ color: "var(--text-3)" }}>
                {pct}%
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Recente signalen — list-row, niet tappable (geen detail-route) */}
      <section>
        <h2 className="text-[15px] font-semibold mb-3 px-1" style={{ color: "var(--text)" }}>
          Recente signalen
        </h2>
        {signals.length === 0 ? (
          <div className="card px-4 py-5 text-center">
            <p className="text-[14px]" style={{ color: "var(--text-2)" }}>
              Nog geen check-ins. Voeg er één toe vanop Start.
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
    </div>
  );
}

/* ── Samenvattingskaart ── */
function SummaryCard({ loading, avg, count, trendLabel }) {
  if (loading) {
    return (
      <div className="card px-4 py-4 space-y-2">
        <div className="h-4 w-2/3 rounded shimmer" />
        <div className="h-3 w-1/3 rounded shimmer" />
      </div>
    );
  }

  if (!avg) {
    return (
      <div className="card px-4 py-4">
        <p className="text-[15px] leading-[1.5]" style={{ color: "var(--text)" }}>
          Nog niet genoeg check-ins om iets te zeggen.
        </p>
        <p className="text-[13px] mt-1" style={{ color: "var(--text-3)" }}>
          Een paar dagen invullen geeft al een eerste beeld.
        </p>
      </div>
    );
  }

  return (
    <div className="card px-4 py-4">
      <p className="text-[15px] leading-[1.5]" style={{ color: "var(--text)" }}>
        Gemiddeld <span style={{ color: "#C25A32", fontWeight: 600 }}>{avg}/10</span> over {count} check-in{count === 1 ? "" : "s"}.
      </p>
      {trendLabel && (
        <p className="text-[13px] mt-1" style={{ color: "var(--text-3)" }}>
          Het gaat {trendLabel}.
        </p>
      )}
    </div>
  );
}

/* ── Trends chart (gifted-charts stijl: rust, één lijn, spotpunten) ── */
function TrendsChart({ days, hasEnough }) {
  if (!hasEnough) {
    return (
      <div className="card px-4 py-5 text-center">
        <p className="text-[14px]" style={{ color: "var(--text-2)" }}>
          Nog te weinig data voor een trend.
        </p>
        <p className="text-[12px] mt-1" style={{ color: "var(--text-3)" }}>
          Vanaf 3 check-ins toon ik een lijn.
        </p>
      </div>
    );
  }
  return (
    <div className="card px-3 pt-4 pb-2 overflow-hidden">
      <div style={{ height: 140, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={days} margin={{ top: 6, right: 8, left: 8, bottom: 0 }}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(240,240,242,0.40)", fontSize: 11 }}
              interval={0}
            />
            <YAxis hide domain={[0, 10]} />
            <Tooltip
              cursor={{ stroke: "rgba(255,255,255,0.10)", strokeWidth: 1 }}
              contentStyle={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--line)",
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
    score >= 7 ? { label: "Goede dag",     color: "#34C77B" }
    : score >= 5 ? { label: "Vlakke dag",  color: "#F5A623" }
    : { label: "Zware dag",                color: "#F04747" };

  return (
    <div className="list-row gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium" style={{ color: "var(--text)" }}>
          {tone.label}
        </p>
        <p className="text-[12px] mt-0.5" style={{ color: "var(--text-3)" }}>
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