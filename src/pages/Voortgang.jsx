import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";
import { nl } from "date-fns/locale";
import { Lock, TrendingUp, Flame, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import BottomNav from "../components/luna/BottomNav";

const MOOD_LABELS = ["", "Zwaar", "Zwaar", "Moeilijk", "Wisselend", "Gaat wel", "Gaat wel", "Goed", "Goed", "Heel goed", "Top"];

export default function Voortgang() {
  const [period, setPeriod] = useState(7);
  const isPro = false;

  const { data: checkIns = [] } = useQuery({
    queryKey: ["checkins", period],
    queryFn: () => base44.entities.CheckIn.list("-date", 30),
  });

  const days = Array.from({ length: period }, (_, i) => {
    const d = subDays(new Date(), period - 1 - i);
    const dateStr = format(d, "yyyy-MM-dd");
    const found = checkIns.find((c) => c.date === dateStr);
    return {
      label: format(d, period <= 7 ? "EEE" : "d/M", { locale: nl }),
      score: found?.score ?? null,
      date: dateStr,
    };
  });

  const validCheckIns = checkIns.filter((c) => c.score !== null);
  const avg = validCheckIns.length
    ? (validCheckIns.reduce((a, c) => a + c.score, 0) / validCheckIns.length).toFixed(1)
    : "–";

  // Streak
  const streak = (() => {
    let s = 0;
    for (let i = 0; i < 30; i++) {
      const d = format(new Date(Date.now() - i * 86400000), "yyyy-MM-dd");
      if (checkIns.find((c) => c.date === d)) s++;
      else break;
    }
    return s;
  })();

  // Best score
  const best = validCheckIns.length ? Math.max(...validCheckIns.map((c) => c.score)) : "–";

  // Simple insight
  const insight = (() => {
    if (validCheckIns.length < 3) return "Check nog een paar dagen in voor je eerste inzicht.";
    const recent = validCheckIns.slice(0, 3).reduce((a, c) => a + c.score, 0) / 3;
    const older = validCheckIns.slice(3, 6);
    if (!older.length) return `Je gemiddelde score van de week is ${avg}/10.`;
    const olderAvg = older.reduce((a, c) => a + c.score, 0) / older.length;
    if (recent > olderAvg + 0.5) return "Je gaat vooruit — de scores van de laatste dagen liggen hoger dan vorige week. 🌱";
    if (recent < olderAvg - 0.5) return "Het lijkt iets moeilijker te gaan. Dat mag er zijn. Luna is er.";
    return `Je score blijft stabiel rond de ${avg}/10 — consistentie is kracht.`;
  })();

  return (
    <div
      className="min-h-screen pb-32"
      style={{ background: "linear-gradient(160deg, #f0f4ff 0%, #f5f7ff 55%, #eaeffa 100%)" }}
    >
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>
          Jouw voortgang
        </h1>
        <p className="text-sm" style={{ color: "#8a96b0", fontFamily: "'DM Sans', sans-serif" }}>
          Kleine stappen, groot verschil
        </p>
      </div>

      <div className="px-5 space-y-4 max-w-md mx-auto">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Gemiddeld", value: avg, sub: "score" },
            { label: "Reeks", value: streak > 0 ? `${streak}🔥` : "0", sub: "dagen" },
            { label: "Beste dag", value: best, sub: "score" },
          ].map(({ label, value, sub }) => (
            <div
              key={label}
              className="rounded-2xl p-3 text-center"
              style={{ background: "rgba(255,255,255,0.90)", boxShadow: "0 2px 8px rgba(100,140,220,0.07)" }}
            >
              <p className="text-xl font-bold mb-0.5" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>{value}</p>
              <p className="text-[10px] font-medium" style={{ color: "#b0bace", fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Period toggle */}
        <div className="flex gap-2">
          {[7, 14, 30].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: period === p ? "#1e7a8c" : "rgba(255,255,255,0.85)",
                color: period === p ? "#fff" : "#6b7a99",
                boxShadow: period === p ? "0 2px 10px rgba(30,122,140,0.25)" : "none",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {p} dagen
            </button>
          ))}
        </div>

        {/* Chart */}
        <div
          className="rounded-2xl p-4 relative overflow-hidden"
          style={{ background: "rgba(255,255,255,0.90)", boxShadow: "0 2px 10px rgba(100,140,220,0.08)" }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#b0bace", fontFamily: "'DM Sans', sans-serif" }}>
            Stemming over tijd
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={days} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e7a8c" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#1e7a8c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fill: "#b0bace", fontSize: 11, fontFamily: "'DM Sans',sans-serif" }} axisLine={false} tickLine={false} />
              <YAxis domain={[1, 10]} tick={{ fill: "#b0bace", fontSize: 11, fontFamily: "'DM Sans',sans-serif" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid rgba(180,190,220,0.30)", borderRadius: 12, fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#1a2340", boxShadow: "0 4px 20px rgba(100,140,220,0.12)" }}
                cursor={{ stroke: "rgba(30,122,140,0.15)" }}
                formatter={(val) => [val ? `${val}/10 — ${MOOD_LABELS[val]}` : "—", "Stemming"]}
              />
              <Area type="monotone" dataKey="score" stroke="#1e7a8c" strokeWidth={2.5} fill="url(#scoreGrad)" connectNulls={false} dot={{ fill: "#1e7a8c", r: 4, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>

          {/* Pro lock overlay for > 7 days */}
          {!isPro && period > 7 && (
            <div className="absolute inset-0 rounded-2xl flex items-center justify-center" style={{ backdropFilter: "blur(10px)", background: "rgba(240,244,255,0.75)" }}>
              <div
                className="p-5 text-center mx-6 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 4px 20px rgba(100,140,220,0.15)", border: "1px solid rgba(91,124,246,0.20)" }}
              >
                <Lock className="w-6 h-6 mx-auto mb-2" style={{ color: "#5b7cf6" }} />
                <p className="text-sm font-bold mb-1" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>
                  Ontgrendel langetermijn patronen
                </p>
                <p className="text-xs mb-3" style={{ color: "#8a96b0", fontFamily: "'DM Sans', sans-serif" }}>
                  Zie je evolutie over 14 en 30 dagen met Luna Pro
                </p>
                <Link to="/prijzen" className="inline-block px-5 py-2 rounded-full text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #5b7cf6, #3b5bdb)", fontFamily: "'DM Sans', sans-serif" }}>
                  Upgrade · €4,99/mnd
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* AI Insight card */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.90)", boxShadow: "0 2px 10px rgba(100,140,220,0.08)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{ color: "#1e7a8c" }} />
            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#b0bace", fontFamily: "'DM Sans', sans-serif" }}>
              Luna's observatie
            </p>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#4a5a78", fontFamily: "'DM Sans', sans-serif" }}>
            {insight}
          </p>
        </div>

        {/* Pro upsell */}
        {!isPro && (
          <Link to="/prijzen">
            <div
              className="rounded-2xl p-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
              style={{
                background: "linear-gradient(135deg, #eef2ff 0%, #e8edff 100%)",
                border: "1px solid rgba(91,124,246,0.20)",
              }}
            >
              <div>
                <p className="text-sm font-bold" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>
                  Diepere patronen ontdekken?
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#6b7a99", fontFamily: "'DM Sans', sans-serif" }}>
                  Luna Pro geeft AI-inzichten op maat
                </p>
              </div>
              <ChevronRight className="w-5 h-5 shrink-0" style={{ color: "#5b7cf6" }} />
            </div>
          </Link>
        )}

      </div>
      <BottomNav />
    </div>
  );
}