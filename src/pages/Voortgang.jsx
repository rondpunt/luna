import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import BottomNav from "../components/luna/BottomNav";
import Logo from "../components/luna/Logo";
import moment from "moment";

export default function Voortgang() {
  const [period, setPeriod] = useState("week");

  const { data: checkIns } = useQuery({
    queryKey: ["checkIns"],
    queryFn: () => base44.entities.CheckIn.list("-date", 365),
    initialData: [],
  });

  const cutoff = period === "week"
    ? moment().subtract(7, "days")
    : moment().subtract(30, "days");

  const filtered = checkIns
    .filter((c) => moment(c.date).isAfter(cutoff))
    .sort((a, b) => a.date.localeCompare(b.date));

  const chartData = filtered.map((c) => ({
    date: moment(c.date).format(period === "week" ? "ddd" : "D MMM"),
    score: c.score,
  }));

  const avg = filtered.length > 0
    ? (filtered.reduce((s, c) => s + c.score, 0) / filtered.length).toFixed(1)
    : "—";

  const lowest = filtered.length > 0
    ? filtered.reduce((min, c) => (c.score < min.score ? c : min), filtered[0])
    : null;

  const highest = filtered.length > 0
    ? filtered.reduce((max, c) => (c.score > max.score ? c : max), filtered[0])
    : null;

  // Streak calc
  const allDates = [...new Set(checkIns.map((c) => c.date))].sort().reverse();
  let streak = 0;
  let checkDate = moment();
  for (const date of allDates) {
    if (moment(date).isSame(checkDate, "day") || moment(date).isSame(checkDate.clone().subtract(1, "day"), "day")) {
      streak++;
      checkDate = moment(date);
    } else break;
  }

  let bestStreak = 0;
  let currentBest = 1;
  const sortedAsc = [...allDates].reverse();
  for (let i = 1; i < sortedAsc.length; i++) {
    const diff = moment(sortedAsc[i]).diff(moment(sortedAsc[i - 1]), "days");
    if (diff <= 1) {
      currentBest++;
      bestStreak = Math.max(bestStreak, currentBest);
    } else {
      currentBest = 1;
    }
  }
  bestStreak = Math.max(bestStreak, currentBest, streak);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg-base)" }}
    >
      <header className="flex items-center justify-between px-6 py-4">
        <Logo showOrb />
      </header>

      <main className="flex-1 px-6 pb-28 max-w-md mx-auto w-full">
        <Tabs value={period} onValueChange={setPeriod} className="mb-6">
          <TabsList
            className="w-full"
            style={{ background: "var(--bg-elev)" }}
          >
            <TabsTrigger value="week" className="flex-1">Week</TabsTrigger>
            <TabsTrigger value="maand" className="flex-1">Maand</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Chart */}
        <div
          className="rounded-2xl p-4 mb-6"
          style={{ background: "var(--bg-elev)" }}
        >
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--luna-border)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "var(--text-muted-luna)", fontSize: 11 }}
                  axisLine={{ stroke: "var(--luna-border)" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[1, 10]}
                  tick={{ fill: "var(--text-muted-luna)", fontSize: 11 }}
                  axisLine={{ stroke: "var(--luna-border)" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-elev-2)",
                    border: "1px solid var(--luna-border)",
                    borderRadius: 8,
                    color: "var(--text-primary-luna)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="var(--luna-accent)"
                  strokeWidth={2}
                  dot={{ fill: "var(--luna-accent)", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p
              className="text-sm text-center py-12"
              style={{ color: "var(--text-muted-luna)" }}
            >
              Nog geen check-ins. Begin op Home.
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl p-3 text-center" style={{ background: "var(--bg-elev)" }}>
            <p className="text-[10px] mb-1" style={{ color: "var(--text-muted-luna)" }}>Gemiddelde</p>
            <p className="text-lg font-semibold" style={{ color: "var(--text-primary-luna)" }}>{avg}</p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: "var(--bg-elev)" }}>
            <p className="text-[10px] mb-1" style={{ color: "var(--text-muted-luna)" }}>Laagste dag</p>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary-luna)" }}>
              {lowest ? moment(lowest.date).format("ddd") : "—"}
            </p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: "var(--bg-elev)" }}>
            <p className="text-[10px] mb-1" style={{ color: "var(--text-muted-luna)" }}>Hoogste dag</p>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary-luna)" }}>
              {highest ? moment(highest.date).format("ddd") : "—"}
            </p>
          </div>
        </div>

        {/* Streak */}
        <div className="rounded-xl p-4 mb-4" style={{ background: "var(--bg-elev)" }}>
          <p className="text-sm" style={{ color: "var(--text-primary-luna)" }}>
            Huidige reeks: {streak} {streak === 1 ? "dag" : "dagen"}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted-luna)" }}>
            Beste reeks: {bestStreak} {bestStreak === 1 ? "dag" : "dagen"}
          </p>
        </div>

        <p
          className="text-xs text-center"
          style={{ color: "var(--text-muted-luna)" }}
        >
          Patronen helpen je jezelf beter begrijpen. Niet meer dan dat.
        </p>
      </main>

      <BottomNav />
    </div>
  );
}