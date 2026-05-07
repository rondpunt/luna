import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, differenceInDays } from "date-fns";
import { nl } from "date-fns/locale";
import { Lock, TrendingUp, Activity, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
  BarChart, Bar, Cell,
} from "recharts";

const RANGES = ["7d", "30d", "Alles"];
const EMOTIONS = [
  { key: "sadness", label: "Verdriet", color: "#6B8FD4" },
  { key: "shame",   label: "Schaamte", color: "#A46BA8" },
  { key: "fear",    label: "Angst",    color: "#D4A86B" },
  { key: "anger",   label: "Boosheid", color: "#D46B6B" },
  { key: "joy",     label: "Vreugde",  color: "#6BAD8A" },
];
const URGE_LABELS = {
  urge_self_harm:    "Zelfbeschadiging",
  urge_substance:    "Middelen",
  urge_quit_therapy: "Therapie stoppen",
  urge_lash_out:     "Uitvallen",
};
const ACTED_KEYS = {
  urge_self_harm:    "acted_self_harm",
  urge_substance:    "acted_substance",
  urge_quit_therapy: null,
  urge_lash_out:     "acted_lash_out",
};
const SKILL_COLORS = ["#E8834A","#D4A86B","#A46BA8","#6B8FD4","#6BAD8A","#D46B6B"];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(12,12,20,0.95)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 14px", fontSize: 12, color: "var(--text)" }}>
      <div style={{ color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color || "#E8834A", fontWeight: 600 }}>
          {p.name || p.dataKey}: {p.value}{p.dataKey === "score" ? "/10" : ""}
        </div>
      ))}
    </div>
  );
}

function StatPill({ label, value, color = "#E8834A" }) {
  return (
    <div style={{
      flex: 1, padding: "14px 16px",
      background: "rgba(255,255,255,0.025)",
      border: "1px solid rgba(255,255,255,0.055)",
      borderRadius: 16, textAlign: "center",
    }}>
      <p style={{ fontSize: 24, fontWeight: 700, color, letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.3 }}>{label}</p>
    </div>
  );
}

function UrgeActedCard({ diaryEntries }) {
  const week = diaryEntries.filter((e) =>
    differenceInDays(new Date(), parseISO(e.date || e.created_date)) < 7
  );
  const stats = Object.entries(URGE_LABELS).map(([urgeKey, label]) => {
    const total = week.filter((e) => (e[urgeKey] || 0) > 0).length;
    const actedKey = ACTED_KEYS[urgeKey];
    const acted = actedKey ? week.filter((e) => e[actedKey]).length : null;
    return { urgeKey, label, total, acted };
  }).filter((s) => s.total > 0);
  if (!stats.length) return null;
  return (
    <div style={{ marginBottom: 12 }}>
      <SectionCard title="Urges deze week" icon={Activity}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {stats.map(({ urgeKey, label, total, acted }) => {
            const ratio = acted !== null ? acted / total : null;
            const col = ratio === null ? "rgba(255,255,255,0.08)" : ratio === 0 ? "#6BAD8A" : ratio < 0.5 ? "#D4A86B" : "#D46B6B";
            return (
              <div key={urgeKey} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, border: `2px solid ${col}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.025)" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", lineHeight: 1 }}>{total}</span>
                  {acted !== null && <span style={{ fontSize: 8, color: "var(--text-muted)", marginTop: 1 }}>{acted}×</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500, marginBottom: 5 }}>{label}</div>
                  {acted !== null && (
                    <>
                      <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2 }}>
                        <div style={{ height: "100%", borderRadius: 2, width: `${Math.round((acted / total) * 100)}%`, background: col, transition: "width 0.5s ease" }} />
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>
                        {acted === 0 ? "Niet op gehandeld" : `${acted} van ${total} keer gehandeld`}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 16, lineHeight: 1.5 }}>
          Geen oordeel — informatie voor jou en je therapeut.
        </p>
      </SectionCard>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children, action }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.055)",
      borderRadius: 20, padding: "20px 20px 18px", marginBottom: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {Icon && (
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(232,131,74,0.08)", border: "1px solid rgba(232,131,74,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={15} style={{ color: "#E8834A" }} strokeWidth={1.8} />
            </div>
          )}
          <h2 className="font-display" style={{ fontSize: 20, color: "var(--text)", letterSpacing: "-0.02em" }}>{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export default function Voortgang() {
  const [range, setRange] = useState("7d");
  const [showEmotions, setShowEmotions] = useState(false);

  const { data: checkIns = [] } = useQuery({
    queryKey: ["checkins-voortgang"],
    queryFn: () => base44.entities.CheckIn.list("-created_date", 100),
  });
  const { data: diaryEntries = [] } = useQuery({
    queryKey: ["diary-voortgang"],
    queryFn: () => base44.entities.DiaryEntry?.list?.("-date", 30) || Promise.resolve([]),
  });
  const { data: skillUses = [] } = useQuery({
    queryKey: ["skilluses-voortgang"],
    queryFn: () => base44.entities.SkillUse?.list?.("-created_date", 100) || Promise.resolve([]),
  });

  const filtered = checkIns.filter((c) => {
    if (range === "Alles") return true;
    return differenceInDays(new Date(), parseISO(c.created_date)) < (range === "7d" ? 7 : 30);
  });
  const chartData = [...filtered].sort((a, b) => new Date(a.created_date) - new Date(b.created_date))
    .map((c) => ({ date: format(parseISO(c.created_date), "d MMM", { locale: nl }), score: c.score }));

  const emotionData = [...diaryEntries]
    .filter((e) => range === "Alles" || differenceInDays(new Date(), parseISO(e.date || e.created_date)) < (range === "7d" ? 7 : 30))
    .sort((a, b) => new Date(a.date || a.created_date) - new Date(b.date || b.created_date))
    .map((e) => ({
      date: format(parseISO(e.date || e.created_date), "d MMM", { locale: nl }),
      sadness: e.sadness || 0, shame: e.shame || 0, fear: e.fear || 0, anger: e.anger || 0, joy: e.joy || 0,
    }));

  const skillCounts = {};
  skillUses.filter((s) => differenceInDays(new Date(), parseISO(s.created_date)) < 7).forEach((s) => {
    if (s.skillKey) skillCounts[s.skillKey] = (skillCounts[s.skillKey] || 0) + 1;
  });
  const skillChartData = Object.entries(skillCounts)
    .map(([key, count]) => ({ name: key.toUpperCase(), count }))
    .sort((a, b) => b.count - a.count).slice(0, 6);

  const weekCheckins = checkIns.filter((c) => differenceInDays(new Date(), parseISO(c.created_date)) < 7);
  const avgScore = weekCheckins.length ? (weekCheckins.reduce((s, c) => s + c.score, 0) / weekCheckins.length).toFixed(1) : "—";
  const maxScore = weekCheckins.length ? Math.max(...weekCheckins.map((c) => c.score)) : "—";

  return (
    <div className="fade-in px-5" style={{ paddingTop: "calc(28px + env(safe-area-inset-top, 0px))", paddingBottom: 8 }}>
      <div style={{ marginBottom: 28 }}>
        <p className="eyebrow" style={{ marginBottom: 6 }}>JOUW PATRONEN</p>
        <h1 className="font-display" style={{ fontSize: 34, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.0 }}>Voortgang.</h1>
        <p style={{ fontSize: 15, color: "var(--text-muted)", marginTop: 4 }}>Een terugblik zonder oordeel.</p>
      </div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: "flex", gap: 10, marginBottom: 12 }}
      >
        <StatPill label="Gem. stemming" value={avgScore} color="#E8834A" />
        <StatPill label="Check-ins week" value={weekCheckins.length} color="#6B8FD4" />
        <StatPill label="Beste dag" value={maxScore} color="#6BAD8A" />
      </motion.div>

      {/* Range selector */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {RANGES.map((r) => (
          <button key={r} onClick={() => setRange(r)} className="press" style={{
            height: 30, padding: "0 14px", borderRadius: 15, fontSize: 12, fontWeight: 500,
            background: range === r ? "rgba(232,131,74,0.10)" : "transparent",
            border: range === r ? "1px solid rgba(232,131,74,0.28)" : "1px solid rgba(255,255,255,0.07)",
            color: range === r ? "#E8834A" : "var(--text-muted)", cursor: "pointer", transition: "all 0.15s",
          }}>{r}</button>
        ))}
      </div>

      {/* Stemming chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <SectionCard title="Stemming" icon={TrendingUp}>
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={chartData} margin={{ top: 8, right: 0, left: -32, bottom: 0 }}>
                <defs>
                  <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E8834A" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#E8834A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#3A3630", fontFamily: "'Geist', system-ui" }} tickLine={false} axisLine={false} tickFormatter={(v, i) => (i === 0 || i === chartData.length - 1) ? v : ""} />
                <YAxis hide domain={[1, 10]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" stroke="#E8834A" strokeWidth={2} fill="url(#moodGrad)" dot={false} activeDot={{ r: 5, fill: "#E8834A", stroke: "#0B0B14", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 150, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-faint)", fontSize: 14 }}>
              Nog niet genoeg data.
            </div>
          )}
        </SectionCard>
      </motion.div>

      {/* Emoties */}
      {emotionData.length > 1 && (
        <SectionCard title="Emoties" icon={Activity}
          action={
            <button onClick={() => setShowEmotions(s => !s)} style={{ fontSize: 12, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: "4px 8px" }}>
              {showEmotions ? "Verberg" : "Toon"}
            </button>
          }
        >
          {showEmotions && (
            <>
              <ResponsiveContainer width="100%" height={130}>
                <AreaChart data={emotionData} margin={{ top: 4, right: 0, left: -32, bottom: 0 }}>
                  {EMOTIONS.map(({ key, color }) => (
                    <defs key={key}>
                      <linearGradient id={`emoGrad-${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.18} />
                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  ))}
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#3A3630" }} tickLine={false} axisLine={false} tickFormatter={(v, i) => (i === 0 || i === emotionData.length - 1) ? v : ""} />
                  <YAxis hide domain={[0, 5]} />
                  <Tooltip content={<CustomTooltip />} />
                  {EMOTIONS.map(({ key, label, color }) => (
                    <Area key={key} type="monotone" dataKey={key} name={label} stroke={color} strokeWidth={1.5} fill={`url(#emoGrad-${key})`} dot={false} />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
                {EMOTIONS.map(({ key, label, color }) => (
                  <div key={key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          {!showEmotions && <p style={{ fontSize: 13, color: "var(--text-faint)" }}>Klik op "Toon" voor emotie-decompositie.</p>}
        </SectionCard>
      )}

      {/* Urge/acted */}
      <UrgeActedCard diaryEntries={diaryEntries} />

      {/* Skills */}
      {skillChartData.length > 0 && (
        <SectionCard title="Skills deze week" icon={Zap}>
          <ResponsiveContainer width="100%" height={110}>
            <BarChart data={skillChartData} margin={{ top: 0, right: 0, left: -32, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#7A7268" }} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[5, 5, 0, 0]} maxBarSize={28}>
                {skillChartData.map((_, i) => <Cell key={i} fill={SKILL_COLORS[i % SKILL_COLORS.length]} fillOpacity={0.75} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      )}

      {/* Lock card */}
      <div style={{
        background: "linear-gradient(145deg, rgba(232,131,74,0.06), rgba(255,255,255,0.02))",
        border: "1px solid rgba(232,131,74,0.18)", borderRadius: 20, padding: "22px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>Volledige geschiedenis</p>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Beschikbaar in Luna Plus.</p>
        </div>
        <Link to="/pricing" style={{ textDecoration: "none" }}>
          <button className="btn btn-ghost-accent btn-sm press" style={{ width: "auto", fontSize: 13 }}>Upgrade</button>
        </Link>
      </div>

      <div style={{ height: 16 }} />
    </div>
  );
}