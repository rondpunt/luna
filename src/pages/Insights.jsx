import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { format, subDays } from "date-fns";
import { nl } from "date-fns/locale";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const THEMES = [
  { label: "Werkdruk", count: 6, color: "#c25a32" },
  { label: "Slaap", count: 4, color: "#ee9670" },
  { label: "Relaties", count: 3, color: "#a04028" },
  { label: "Focus", count: 3, color: "#7a3020" },
];

export default function Insights() {
  const { data: checkIns = [] } = useQuery({
    queryKey: ["checkins-insights"],
    queryFn: () => base44.entities.CheckIn.list("-date", 14),
  });

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dateStr = format(d, "yyyy-MM-dd");
    const found = checkIns.find((c) => c.date === dateStr);
    return { day: format(d, "EEEEE", { locale: nl }), value: found?.score ?? null };
  });

  const valid = checkIns.filter((c) => c.score != null);
  const avg = valid.length ? (valid.reduce((a, c) => a + c.score, 0) / valid.length).toFixed(1) : "–";
  const last3 = valid.slice(0, 3);
  const prev3 = valid.slice(3, 6);
  const trend =
    last3.length && prev3.length
      ? (last3.reduce((a, c) => a + c.score, 0) / 3) - (prev3.reduce((a, c) => a + c.score, 0) / 3)
      : 0;

  const TrendIcon = trend > 0.3 ? TrendingUp : trend < -0.3 ? TrendingDown : Minus;
  const trendColor = trend > 0.3 ? "#34c759" : trend < -0.3 ? "#ff3b30" : "rgba(255,255,255,0.50)";

  return (
    <div className="px-5 pt-6 space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Inzichten</p>
        <h1 className="text-2xl font-bold text-white">Patronen, geen prestaties.</h1>
      </div>

      {/* Score + trend */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4" style={{ background: "#1c1c1e" }}>
          <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.40)" }}>Gemiddelde score</p>
          <p className="text-3xl font-bold text-white">{avg}</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>op 10</p>
        </div>
        <div className="rounded-2xl p-4" style={{ background: "#1c1c1e" }}>
          <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.40)" }}>Trend</p>
          <div className="flex items-center gap-2 mt-1">
            <TrendIcon className="h-7 w-7" style={{ color: trendColor }} />
            <p className="text-sm font-semibold" style={{ color: trendColor }}>
              {trend > 0.3 ? "Stijgend" : trend < -0.3 ? "Dalend" : "Stabiel"}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl p-4" style={{ background: "#1c1c1e" }}>
        <p className="text-xs mb-4 font-medium" style={{ color: "rgba(255,255,255,0.40)" }}>Stemming – afgelopen 7 dagen</p>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={days}>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c25a32" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#c25a32" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#2c2c2e", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }}
                formatter={(v) => [v ? `${v}/10` : "–", "Stemming"]}
              />
              <Area type="monotone" dataKey="value" stroke="#c25a32" fill="url(#g)" strokeWidth={2} connectNulls={false} dot={{ fill: "#c25a32", r: 3, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Themes */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>Veelbesproken thema's</p>
        <div className="space-y-2">
          {THEMES.map(({ label, count, color }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-24 text-sm text-white">{label}</div>
              <div className="flex-1 h-2 rounded-full" style={{ background: "#2c2c2e" }}>
                <div className="h-2 rounded-full" style={{ width: `${(count / 6) * 100}%`, background: color }} />
              </div>
              <span className="text-xs w-6 text-right" style={{ color: "rgba(255,255,255,0.40)" }}>{count}×</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {[
          ["💡 Wat helpt jou", "Ademreset, herformuleren, korte gesprekken vroeg op de dag."],
          ["⚡ Triggers", "Onbeantwoorde berichten, laat opblijven, vermijdingsgedrag."],
        ].map(([t, b]) => (
          <div key={t} className="rounded-2xl px-4 py-3.5" style={{ background: "#1c1c1e" }}>
            <p className="text-sm font-semibold text-white mb-1">{t}</p>
            <p className="text-sm leading-5" style={{ color: "rgba(255,255,255,0.55)" }}>{b}</p>
          </div>
        ))}
      </div>
    </div>
  );
}