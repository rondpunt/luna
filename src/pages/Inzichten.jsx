import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, differenceInDays } from "date-fns";
import { nl } from "date-fns/locale";
import { base44 } from "@/api/base44Client";
import WellbeingInsight from "@/components/luna/WellbeingInsight";
import { usePremium } from "@/hooks/usePremium";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
} from "recharts";

const RANGES = [
  { key: "14d", label: "14 d", days: 14 },
  { key: "30d", label: "30 d", days: 30 },
  { key: "90d", label: "90 d", days: 90 },
];

/** @param {any} props */
function LunaTooltip(props) {
  const { active, payload, label } = props;
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(20,20,30,0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 12px", fontSize: 12, color: "var(--text)" }}>
      <div style={{ marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={String(p.dataKey)} style={{ color: p.color }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
}

export default function Inzichten() {
  const { isPlus } = usePremium();
  const [rangeKey, setRangeKey] = useState("30d");
  useDocumentTitle("Inzichten");

  const days = useMemo(() => RANGES.find((r) => r.key === rangeKey)?.days ?? 30, [rangeKey]);

  const { data: checkIns = [] } = useQuery({
    queryKey: ["checkins-inzichten"],
    queryFn: () => base44.entities.CheckIn.list("-created_date", 200),
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["messages-inzichten"],
    queryFn: () => base44.entities.Message.list("-created_date", 120).catch(() => []),
    enabled: isPlus,
  });

  const chartData = useMemo(() => {
    const filtered = checkIns.filter((c) => differenceInDays(new Date(), parseISO(c.created_date)) < days);
    return [...filtered]
      .sort((a, b) => Date.parse(String(a.created_date)) - Date.parse(String(b.created_date)))
      .map((c) => ({
        date: format(parseISO(c.created_date), "d MMM", { locale: nl }),
        score: c.score,
      }));
  }, [checkIns, days]);

  const chatSlice = useMemo(
    () =>
      messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content || "" })),
    [messages]
  );

  if (!isPlus) {
    return (
      <div className="fade-in px-6" style={{ paddingTop: "calc(32px + env(safe-area-inset-top, 0px))", paddingBottom: 120 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>VOORTGANG</p>
        <h1 className="font-display" style={{ fontSize: 34, color: "var(--text)" }}>Diepere inzichten.</h1>
        <p style={{ fontSize: 15, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.55 }}>
          Luna Plus opent een aparte inzichtenpagina met langere trends, thema&apos;s en AI-welzijnsanalyse op basis van je chats en check-ins.
        </p>
        <Link to="/pricing" className="btn btn-primary press mt-8 inline-block" style={{ fontSize: 14 }}>
          Bekijk Luna Plus
        </Link>
      </div>
    );
  }

  return (
    <div className="fade-in px-6" style={{ paddingTop: "calc(32px + env(safe-area-inset-top, 0px))", paddingBottom: 120 }}>
      <p className="eyebrow" style={{ marginBottom: 8 }}>LUNA PLUS</p>
      <h1 className="font-display" style={{ fontSize: 34, color: "var(--text)", letterSpacing: "-0.02em" }}>Inzichten.</h1>
      <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 6, marginBottom: 20 }}>
        Langere context, meer data, geen oordeel.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {RANGES.map((r) => (
          <button
            key={r.key}
            type="button"
            className="press"
            onClick={() => setRangeKey(r.key)}
            style={{
              height: 32,
              padding: "0 14px",
              borderRadius: 16,
              fontSize: 12,
              fontWeight: 500,
              background: rangeKey === r.key ? "rgba(232,131,74,0.10)" : "transparent",
              border: rangeKey === r.key ? "1px solid rgba(232,131,74,0.30)" : "1px solid rgba(255,255,255,0.08)",
              color: rangeKey === r.key ? "#E8834A" : "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="surface" style={{ padding: "18px 16px 8px", marginBottom: 16 }}>
        <h2 className="font-display" style={{ fontSize: 20, color: "var(--text)", marginBottom: 12 }}>Stemming ({days} dagen)</h2>
        {chartData.length > 1 ? (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="insGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E8834A" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#E8834A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#8A8278" }} tickLine={false} axisLine={false} />
              <YAxis hide domain={[1, 10]} />
              <Tooltip content={<LunaTooltip />} />
              <Area type="monotone" dataKey="score" name="Score" stroke="#E8834A" strokeWidth={2} fill="url(#insGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ fontSize: 14, color: "var(--text-muted)", padding: "24px 0", textAlign: "center" }}>Nog niet genoeg check-ins in deze periode.</p>
        )}
      </div>

      <div className="mb-4">
        <WellbeingInsight messages={chatSlice} checkIns={checkIns} isPro={true} />
      </div>

      <p style={{ fontSize: 12, color: "var(--text-faint)", lineHeight: 1.5 }}>
        Plus-modus stuurt ook een iets ruimere context naar Luna in chat (meer tokens, zachte instructie). Geen medische analyse.
      </p>
    </div>
  );
}
