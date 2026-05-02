import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import SectionCard from "./SectionCard";

export default function InsightChartCard({ data }) {
  return (
    <SectionCard>
      <p className="text-sm font-medium text-foreground">Weekly emotional trend</p>
      <p className="mt-1 text-sm text-muted-foreground">A soft view of how your week has been feeling.</p>
      <div className="mt-4 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="noraTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6e7ef7" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6e7ef7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#8a8fa8", fontSize: 12 }} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#6e7ef7" fill="url(#noraTrend)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}