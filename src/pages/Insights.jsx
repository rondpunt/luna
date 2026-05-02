import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { format, subDays } from "date-fns";
import { nl } from "date-fns/locale";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const THEMES = [
  { label: "Werkdruk", pct: 80, color: "#C25A32" },
  { label: "Slaap", pct: 60, color: "#EE9670" },
  { label: "Relaties", pct: 45, color: "#A04028" },
  { label: "Focus", pct: 40, color: "#7A3020" },
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
  const trendVal =
    last3.length && prev3.length
      ? (last3.reduce((a, c) => a + c.score, 0) / 3) - (prev3.reduce((a, c) => a + c.score, 0) / 3)
      : 0;

  const TrendIcon = trendVal > 0.3 ? TrendingUp : trendVal < -0.3 ? TrendingDown : Minus;
  const trendColor = trendVal > 0.3 ? "#30D158" : trendVal < -0.3 ? "#FF453A" : "rgba(235,235,245,0.45)";
  const trendLabel = trendVal > 0.3 ? "Stijgend" : trendVal < -0.3 ? "Dalend" : "Stabiel";

  return (
    <div className="px-4 pt-6 pb-6 space-y-6">

      {/* Header */}
      <div className="px-1">
        <p className="text-[15px]" style={{ color: "rgba(235,235,245,0.60)" }}>Inzichten</p>
        <h1 className="mt-0.5 text-[34px] font-bold leading-tight" style={{ color: "#fff", letterSpacing: "-0.5px" }}>
          Jouw patronen.
        </h1>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl px-4 py-4" style={{ background: "#1C1C1E" }}>
          <p className="text-[12px] font-medium uppercase tracking-wider mb-1" style={{ color: "rgba(235,235,245,0.45)" }}>
            Gemiddeld
          </p>
          <p className="text-[34px] font-bold leading-none" style={{ color: "#fff", letterSpacing: "-0.5px" }}>{avg}</p>
          <p className="text-[13px] mt-1" style={{ color: "rgba(235,235,245,0.40)" }}>op 10</p>
        </div>
        <div className="rounded-2xl px-4 py-4" style={{ background: "#1C1C1E" }}>
          <p className="text-[12px] font-medium uppercase tracking-wider mb-1" style={{ color: "rgba(235,235,245,0.45)" }}>
            Trend
          </p>
          <div className="flex items-center gap-2 mt-1">
            <TrendIcon className="h-7 w-7" style={{ color: trendColor }} />
          </div>
          <p className="text-[15px] font-semibold mt-1" style={{ color: trendColor }}>{trendLabel}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl px-4 pt-4 pb-2" style={{ background: "#1C1C1E" }}>
        <p className="text-[12px] font-medium uppercase tracking-wider mb-4" style={{ color: "rgba(235,235,245,0.45)" }}>
          Stemming — 7 dagen
        </p>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={days} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C25A32" stopOpacity={0.40} />
                  <stop offset="95%" stopColor="#C25A32" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(235,235,245,0.35)", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  background: "#2C2C2E",
                  border: "0.5px solid rgba(84,84,88,0.65)",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: 13,
                }}
                formatter={(v) => [v ? `${v}/10` : "–", "Stemming"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#C25A32"
                fill="url(#g)"
                strokeWidth={2}
                connectNulls={false}
                dot={{ fill: "#C25A32", r: 3, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Themes */}
      <div>
        <p className="text-[13px] font-medium uppercase tracking-wider mb-3 px-1" style={{ color: "rgba(235,235,245,0.55)" }}>
          Veelbesproken thema's
        </p>
        <div className="ios-list">
          {THEMES.map(({ label, pct, color }, i) => (
            <div key={label} className={`ios-list-row gap-3 ${i > 0 ? "" : ""}`}>
              <span className="w-24 text-[15px]" style={{ color: "#fff" }}>{label}</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(120,120,128,0.24)" }}>
                <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insight cards */}
      <div className="ios-list">
        {[
          ["💡 Wat helpt jou", "Ademreset, herformuleren, korte gesprekken vroeg op de dag."],
          ["⚡ Triggers", "Onbeantwoorde berichten, laat opblijven, vermijdingsgedrag."],
        ].map(([title, body], i) => (
          <div key={title} className={`ios-list-row flex-col items-start gap-0.5 py-3 ${i > 0 ? "" : ""}`}>
            <p className="text-[15px] font-semibold" style={{ color: "#fff" }}>{title}</p>
            <p className="text-[13px] leading-5" style={{ color: "rgba(235,235,245,0.55)" }}>{body}</p>
          </div>
        ))}
      </div>

    </div>
  );
}