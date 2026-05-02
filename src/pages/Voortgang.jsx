import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";
import { nl } from "date-fns/locale";
import { Lock } from "lucide-react";
import GlassCard from "../components/luna/GlassCard";
import BottomNav from "../components/luna/BottomNav";

export default function Voortgang() {
  const [period, setPeriod] = useState(7);

  const { data: checkIns = [] } = useQuery({
    queryKey: ["checkins", period],
    queryFn: () => base44.entities.CheckIn.list("-date", period),
  });

  const days = Array.from({ length: period }, (_, i) => {
    const d = subDays(new Date(), period - 1 - i);
    const dateStr = format(d, "yyyy-MM-dd");
    const found = checkIns.find((c) => c.date === dateStr);
    return {
      label: format(d, "EEE", { locale: nl }),
      score: found?.score ?? null,
    };
  });

  const avg = checkIns.length ? (checkIns.reduce((a, c) => a + c.score, 0) / checkIns.length).toFixed(1) : "–";
  const streak = checkIns.filter((c) => c.score !== null).length;
  const isPro = false; // TODO: connect to user subscription

  return (
    <div className="min-h-screen pb-32" style={{ background: "radial-gradient(ellipse at 80% -10%, rgba(180,120,20,0.12), transparent 50%), radial-gradient(ellipse at 50% -5%, rgba(79,70,229,0.10), transparent 45%), #080d1e" }}>
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl" style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic", color: "rgba(255,255,255,0.92)" }}>
          Jouw voortgang
        </h1>
      </div>

      <div className="px-5 space-y-4 max-w-md mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <GlassCard className="p-4 text-center">
            <p className="text-2xl font-semibold mb-0.5" style={{ color: "rgba(255,255,255,0.92)", fontFamily: "'Lora', Georgia, serif" }}>{avg}</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>Gemiddeld</p>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <p className="text-2xl font-semibold mb-0.5" style={{ color: "rgba(255,255,255,0.92)", fontFamily: "'Lora', Georgia, serif" }}>{streak}</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>Check-ins</p>
          </GlassCard>
        </div>

        {/* Period toggle */}
        <div className="flex gap-2">
          {[7, 14, 30].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: period === p ? "#6366f1" : "rgba(255,255,255,0.05)",
                color: period === p ? "#fff" : "rgba(255,255,255,0.40)",
                border: `1px solid ${period === p ? "#6366f1" : "rgba(255,255,255,0.09)"}`,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {p} dagen
            </button>
          ))}
        </div>

        {/* Chart */}
        <GlassCard className="p-4 relative overflow-hidden">
          <p className="text-xs mb-3 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.30)", fontFamily: "'DM Sans', sans-serif" }}>
            Stemming over tijd
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={days} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11, fontFamily: "'DM Sans',sans-serif" }} axisLine={false} tickLine={false} />
              <YAxis domain={[1, 10]} tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11, fontFamily: "'DM Sans',sans-serif" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "rgba(8,13,30,0.9)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.88)" }}
                cursor={{ stroke: "rgba(129,140,248,0.25)" }}
              />
              <Area type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={2} fill="url(#scoreGrad)" connectNulls={false} dot={{ fill: "#818cf8", r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>

          {/* Pro lock overlay for > 7 days */}
          {!isPro && period > 7 && (
            <div className="absolute inset-0 rounded-2xl flex items-center justify-center" style={{ backdropFilter: "blur(8px)", background: "rgba(8,13,30,0.6)" }}>
              <GlassCard className="p-5 text-center mx-6" style={{ border: "1px solid rgba(129,140,248,0.3)" }}>
                <Lock className="w-6 h-6 mx-auto mb-2" style={{ color: "#818cf8" }} />
                <p className="text-sm font-semibold mb-1" style={{ color: "rgba(255,255,255,0.92)", fontFamily: "'DM Sans', sans-serif" }}>
                  Ontgrendel langetermijn patronen
                </p>
                <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.40)", fontFamily: "'DM Sans', sans-serif" }}>
                  met Luna Pro
                </p>
                <a href="/prijzen" className="inline-block px-4 py-2 rounded-full text-xs font-semibold text-white" style={{ background: "#6366f1", fontFamily: "'DM Sans', sans-serif" }}>
                  Upgrade
                </a>
              </GlassCard>
            </div>
          )}
        </GlassCard>
      </div>

      <BottomNav />
    </div>
  );
}