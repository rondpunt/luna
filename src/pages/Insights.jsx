import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { format, subDays } from "date-fns";
import { nl } from "date-fns/locale";
import { TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";

const THEMES = [
  { label: "Werkdruk",  pct: 80, color: "#C25A32" },
  { label: "Slaap",     pct: 60, color: "#4A9EFF" },
  { label: "Relaties",  pct: 45, color: "#34C77B" },
  { label: "Focus",     pct: 40, color: "#F5A623" },
  { label: "Energie",   pct: 30, color: "#A855F7" },
];

export default function Insights() {
  const { data: checkIns = [] } = useQuery({
    queryKey: ["checkins-insights"],
    queryFn: () => base44.entities.CheckIn.list("-date", 14),
  });

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    const found = checkIns.find((c) => c.date === format(d, "yyyy-MM-dd"));
    return { day: format(d, "EEEEE", { locale: nl }), value: found?.score ?? null };
  });

  const valid = checkIns.filter((c) => c.score != null);
  const avg = valid.length ? (valid.reduce((a, c) => a + c.score, 0) / valid.length).toFixed(1) : "–";
  const last3 = valid.slice(0, 3);
  const prev3 = valid.slice(3, 6);
  const trendVal = last3.length && prev3.length
    ? (last3.reduce((a, c) => a + c.score, 0) / 3) - (prev3.reduce((a, c) => a + c.score, 0) / 3)
    : 0;

  const TrendIcon = trendVal > 0.3 ? TrendingUp : trendVal < -0.3 ? TrendingDown : Minus;
  const trendColor = trendVal > 0.3 ? "#34C77B" : trendVal < -0.3 ? "#F04747" : "rgba(240,240,242,0.45)";
  const trendLabel = trendVal > 0.3 ? "Stijgend" : trendVal < -0.3 ? "Dalend" : "Stabiel";

  return (
    <div className="px-4 pt-6 pb-6 space-y-6">

      {/* Header */}
      <div className="px-1">
        <p className="text-[14px] font-medium mb-1" style={{ color: "var(--text-2)" }}>Inzichten</p>
        <h1 className="text-[30px] font-bold leading-tight" style={{ color: "var(--text)", letterSpacing: "-0.5px" }}>
          Jouw patronen.
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl px-4 py-4" style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-3)" }}>Gemiddeld</p>
          <p className="text-[36px] font-bold leading-none" style={{ color: "var(--text)", letterSpacing: "-1px" }}>{avg}</p>
          <p className="text-[12px] mt-1.5" style={{ color: "var(--text-3)" }}>op 10</p>
        </div>
        <div className="rounded-2xl px-4 py-4" style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-3)" }}>Trend</p>
          <TrendIcon className="h-7 w-7" style={{ color: trendColor }} strokeWidth={2} />
          <p className="text-[15px] font-semibold mt-1.5" style={{ color: trendColor }}>{trendLabel}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl px-4 pt-4 pb-3" style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}>
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-3)" }}>
          Stemming · 7 dagen
        </p>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={days} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#C25A32" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#C25A32" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(240,240,242,0.30)", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-elevated)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  color: "var(--text)",
                  fontSize: 13,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}
                formatter={(v) => [v ? `${v}/10` : "–", "Stemming"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#C25A32"
                fill="url(#chartGrad)"
                strokeWidth={2}
                connectNulls={false}
                dot={{ fill: "#C25A32", r: 3.5, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Themes */}
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-widest mb-3 px-1" style={{ color: "var(--text-3)" }}>
          Veelbesproken thema's
        </p>
        <div className="list-group">
          {THEMES.map(({ label, pct, color }) => (
            <div key={label} className="list-row gap-4">
              <span className="w-20 text-[14px] font-medium shrink-0" style={{ color: "var(--text)" }}>{label}</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}55` }}
                />
              </div>
              <span className="text-[12px] font-medium w-9 text-right shrink-0" style={{ color: "var(--text-3)" }}>{pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-widest mb-3 px-1" style={{ color: "var(--text-3)" }}>
          Wat Luna ziet
        </p>
        <div className="list-group">
          {[
            { icon: "💡", title: "Wat helpt jou",  body: "Ademhalen, even afstand nemen, korte gesprekken vroeg op de dag." },
            { icon: "⚡", title: "Triggers",         body: "Onbeantwoorde berichten, laat opblijven, vermijden van moeilijke gesprekken." },
            { icon: "🌱", title: "Groeimoment",      body: "Je stelt steeds vaker grenzen — ook al kost dat moeite." },
          ].map(({ icon, title, body }) => (
            <div key={title} className="list-row flex-col items-start gap-1 py-4">
              <div className="flex items-center gap-2">
                <span className="text-[16px]">{icon}</span>
                <p className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>{title}</p>
              </div>
              <p className="text-[13px] leading-[1.5] pl-6" style={{ color: "var(--text-2)" }}>{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Luna note */}
      <div
        className="rounded-2xl px-4 py-4 flex items-start gap-3"
        style={{ background: "rgba(194,90,50,0.08)", border: "1px solid rgba(194,90,50,0.20)" }}
      >
        <Sparkles className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#C25A32" }} strokeWidth={1.8} />
        <p className="text-[13px] leading-[1.55]" style={{ color: "var(--text-2)" }}>
          Inzichten worden nauwkeuriger naarmate je meer gesprekken voert en check-ins doet.
        </p>
      </div>

    </div>
  );
}