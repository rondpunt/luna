import { AreaChart, Area, ResponsiveContainer, XAxis } from "recharts";
import { t } from "@/lib/i18n";

const trend = [
  { day: "W1", value: 4 },
  { day: "W2", value: 6 },
  { day: "W3", value: 5 },
  { day: "W4", value: 7 },
];

export default function Insights() {
  return (
    <div className="px-5 pt-6">
      <p className="text-sm text-muted-foreground">{t.insights.eyebrow}</p>
      <h1 className="mt-1 text-2xl font-semibold text-[#3d1f12]">{t.insights.title}</h1>

      <div className="mt-6 h-44">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trend}>
            <defs>
              <linearGradient id="noraTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c25a32" stopOpacity={0.30} />
                <stop offset="95%" stopColor="#c25a32" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#b89a8a", fontSize: 12 }} />
            <Area type="monotone" dataKey="value" stroke="#c25a32" fill="url(#noraTrend)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-[#9c6a52]">
        {t.insights.weekly}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{t.insights.weeklyBody}</p>

      <div className="mt-6 space-y-4">
        {t.insights.cards.map(([title, body]) => (
          <div key={title} className="border-t border-[rgba(194,90,50,0.10)] pt-4">
            <p className="text-sm font-semibold text-[#3d1f12]">{title}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}