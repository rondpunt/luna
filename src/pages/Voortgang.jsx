import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, differenceInDays, subDays } from "date-fns";
import { nl } from "date-fns/locale";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

const RANGES = ["7d", "30d", "Alles"];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(20,20,30,0.85)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10,
        padding: "8px 12px",
        fontSize: 13,
        color: "var(--text)",
        fontWeight: 500,
      }}
    >
      <div>{label}</div>
      <div style={{ color: "#E8834A" }}>{payload[0].value}/10</div>
    </div>
  );
}

function weekSummary(checkIns) {
  const thisWeek = checkIns.filter((c) => differenceInDays(new Date(), parseISO(c.created_date)) < 7);
  if (!thisWeek.length) return "Een rustige week. Dat hoort er ook bij.";
  const avg = thisWeek.reduce((s, c) => s + (c.score || 5), 0) / thisWeek.length;
  const lighter = thisWeek.filter((c) => c.score >= 6).length;
  if (lighter >= thisWeek.length - 1) return `Je hebt ${thisWeek.length} keer ingecheckt deze week. Bijna altijd voelde het lichter.`;
  if (lighter > 0) return `Je hebt ${thisWeek.length} keer ingecheckt deze week. ${lighter} keer voelde het lichter.`;
  return `Eén keer was de week zwaarder. Dat is ook ok.`;
}

export default function Voortgang() {
  const [range, setRange] = useState("7d");

  const { data: checkIns = [] } = useQuery({
    queryKey: ["checkins-voortgang"],
    queryFn: () => base44.entities.CheckIn.list("-created_date", 100),
  });

  const filtered = checkIns.filter((c) => {
    if (range === "Alles") return true;
    const days = range === "7d" ? 7 : 30;
    return differenceInDays(new Date(), parseISO(c.created_date)) < days;
  });

  const chartData = [...filtered]
    .sort((a, b) => new Date(a.created_date) - new Date(b.created_date))
    .map((c) => ({
      date: format(parseISO(c.created_date), "d MMM", { locale: nl }),
      score: c.score,
    }));

  const firstLabel = chartData[0]?.date || "";
  const lastLabel = chartData[chartData.length - 1]?.date || "";

  return (
    <div
      className="fade-in px-6"
      style={{ paddingTop: "calc(32px + env(safe-area-inset-top, 0px))", paddingBottom: 40 }}
    >
      <h1
        className="font-display"
        style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}
      >
        Voortgang.
      </h1>
      <p style={{ fontSize: 16, color: "var(--text-muted)", marginTop: 6, marginBottom: 40 }}>
        Een terugblik. Zonder oordeel.
      </p>

      {/* Mood flow card */}
      <div className="surface" style={{ padding: "24px 20px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2
            className="font-display"
            style={{ fontSize: 22, color: "var(--text)", letterSpacing: "-0.02em" }}
          >
            Stemming
          </h2>
          <div style={{ display: "flex", gap: 6 }}>
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className="press"
                style={{
                  height: 32, padding: "0 14px", borderRadius: 16, fontSize: 12, fontWeight: 500,
                  background: range === r ? "rgba(232,131,74,0.10)" : "transparent",
                  border: range === r ? "1px solid rgba(232,131,74,0.30)" : "1px solid rgba(255,255,255,0.08)",
                  color: range === r ? "#E8834A" : "var(--text-muted)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {chartData.length > 1 ? (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 8, right: 0, left: -32, bottom: 0 }}>
              <defs>
                <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E8834A" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#E8834A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#4A4640", fontFamily: "'Geist', system-ui" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v, i) => (i === 0 || i === chartData.length - 1) ? v : ""}
              />
              <YAxis hide domain={[1, 10]} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#E8834A"
                strokeWidth={2}
                fill="url(#moodGrad)"
                dot={false}
                activeDot={{ r: 5, fill: "#E8834A", stroke: "none" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div
            style={{
              height: 180, display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-faint)", fontSize: 14,
            }}
          >
            Nog niet genoeg data voor een grafiek.
          </div>
        )}
      </div>

      {/* Week summary */}
      <div className="surface" style={{ padding: "20px 24px", marginBottom: 16 }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>DEZE WEEK</p>
        <p style={{ fontSize: 16, color: "var(--text)", lineHeight: 1.55 }}>
          {weekSummary(checkIns)}
        </p>
      </div>

      {/* Lock card — Pro only history */}
      <div className="surface" style={{ padding: "24px 20px", textAlign: "center" }}>
        <Lock size={24} style={{ color: "#E8834A", margin: "0 auto 12px" }} strokeWidth={1.5} />
        <p style={{ fontSize: 16, fontWeight: 500, color: "var(--text)", marginBottom: 4 }}>
          Volledige geschiedenis
        </p>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 16 }}>
          Beschikbaar in Luna Plus. €9,99/maand.
        </p>
        <Link to="/pricing">
          <button className="btn-ghost-accent btn" style={{ height: 36, fontSize: 13 }}>
            Upgrade
          </button>
        </Link>
      </div>
    </div>
  );
}
