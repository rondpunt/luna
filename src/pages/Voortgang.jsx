import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, differenceInDays } from "date-fns";
import { nl } from "date-fns/locale";
import { Lock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import WellbeingInsight from "@/components/luna/WellbeingInsight";
import { usePremium } from "@/hooks/usePremium";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
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

const SKILL_COLORS = ["#E8834A","#D4A86B","#A46BA8","#6B8FD4","#6BAD8A","#D46B6B","#8A8278","#F2EDE3","#4A4640"];

/** @param {any} props */
function CustomTooltip(props) {
  const { active, payload, label } = props;
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(20,20,30,0.9)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 12px", fontSize: 13, color: "var(--text)", fontWeight: 500 }}>
      <div>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color || "#E8834A", marginTop: 2 }}>
          {p.name}: {p.value}{p.dataKey === "score" ? "/10" : ""}
        </div>
      ))}
    </div>
  );
}

function weekSummary(checkIns) {
  const thisWeek = checkIns.filter((c) => differenceInDays(new Date(), parseISO(c.created_date)) < 7);
  if (!thisWeek.length) return "Een rustige week. Dat hoort er ook bij.";
  const lighter = thisWeek.filter((c) => c.score >= 6).length;
  if (lighter >= thisWeek.length - 1) return `Je hebt ${thisWeek.length} keer ingecheckt deze week. Bijna altijd voelde het lichter.`;
  if (lighter > 0) return `Je hebt ${thisWeek.length} keer ingecheckt deze week. ${lighter} keer voelde het lichter.`;
  return `Eén keer was de week zwaarder. Dat is ook ok.`;
}

export default function Voortgang() {
  const [range, setRange] = useState("7d");
  const [showEmotions, setShowEmotions] = useState(false);
  const { isPlus } = usePremium();
  useDocumentTitle("Voortgang");

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

  const { data: insightMessages = [] } = useQuery({
    queryKey: ["messages-voortgang-preview"],
    queryFn: () => base44.entities.Message.list("-created_date", 40).catch(() => []),
    enabled: isPlus,
  });

  const { data: insightCheckins = [] } = useQuery({
    queryKey: ["checkins-voortgang-insight"],
    queryFn: () => base44.entities.CheckIn.list("-created_date", 40),
    enabled: isPlus,
  });

  const filtered = checkIns.filter((c) => {
    if (range === "Alles") return true;
    const days = range === "7d" ? 7 : 30;
    return differenceInDays(new Date(), parseISO(c.created_date)) < days;
  });

  const chartData = [...filtered]
    .sort((a, b) => Date.parse(String(a.created_date)) - Date.parse(String(b.created_date)))
    .map((c) => ({ date: format(parseISO(c.created_date), "d MMM", { locale: nl }), score: c.score }));

  // Emotion decomposition from diary entries
  const emotionData = [...diaryEntries]
    .filter((e) => range === "Alles" || differenceInDays(new Date(), parseISO(e.date || e.created_date)) < (range === "7d" ? 7 : 30))
    .sort((a, b) => Date.parse(String(a.date || a.created_date)) - Date.parse(String(b.date || b.created_date)))
    .map((e) => ({
      date: format(parseISO(e.date || e.created_date), "d MMM", { locale: nl }),
      sadness: e.sadness || 0,
      shame: e.shame || 0,
      fear: e.fear || 0,
      anger: e.anger || 0,
      joy: e.joy || 0,
    }));

  // Skill usage bar chart
  const skillCounts = {};
  const thisWeekSkills = skillUses.filter((s) => differenceInDays(new Date(), parseISO(s.created_date)) < 7);
  thisWeekSkills.forEach((s) => {
    if (s.skillKey) skillCounts[s.skillKey] = (skillCounts[s.skillKey] || 0) + 1;
  });
  const skillChartData = Object.entries(skillCounts)
    .map(([key, count]) => ({ name: key.toUpperCase(), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Range button
  const RangeBtn = ({ r }) => (
    <button onClick={() => setRange(r)} className="press"
      style={{ height: 32, padding: "0 14px", borderRadius: 16, fontSize: 12, fontWeight: 500, background: range === r ? "rgba(232,131,74,0.10)" : "transparent", border: range === r ? "1px solid rgba(232,131,74,0.30)" : "1px solid rgba(255,255,255,0.08)", color: range === r ? "#E8834A" : "var(--text-muted)", cursor: "pointer", transition: "all 0.15s" }}>
      {r}
    </button>
  );

  return (
    <div className="fade-in px-6" style={{ paddingTop: "calc(32px + env(safe-area-inset-top, 0px))", paddingBottom: 40 }}>
      <h1 className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>Voortgang.</h1>
      <p style={{ fontSize: 16, color: "var(--text-muted)", marginTop: 6, marginBottom: 32 }}>Een terugblik. Zonder oordeel.</p>

      {/* Stemming chart */}
      <div className="surface" style={{ padding: "20px 20px 16px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 className="font-display" style={{ fontSize: 22, color: "var(--text)", letterSpacing: "-0.02em" }}>Stemming</h2>
          <div style={{ display: "flex", gap: 6 }}>{RANGES.map((r) => <RangeBtn key={r} r={r} />)}</div>
        </div>
        {chartData.length > 1 ? (
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData} margin={{ top: 8, right: 0, left: -32, bottom: 0 }}>
              <defs>
                <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E8834A" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#E8834A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#4A4640", fontFamily: "'Geist', system-ui" }} tickLine={false} axisLine={false} tickFormatter={(v, i) => (i === 0 || i === chartData.length - 1) ? v : ""} />
              <YAxis hide domain={[1, 10]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="score" stroke="#E8834A" strokeWidth={2} fill="url(#moodGrad)" dot={false} activeDot={{ r: 5, fill: "#E8834A", stroke: "none" }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-faint)", fontSize: 14 }}>Nog niet genoeg data.</div>
        )}
      </div>

      {/* Emotie-decompositie (uit Diary) */}
      {emotionData.length > 1 && (
        <div className="surface" style={{ padding: "20px 20px 16px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 className="font-display" style={{ fontSize: 20, color: "var(--text)", letterSpacing: "-0.02em" }}>Emoties</h2>
            <button onClick={() => setShowEmotions(s => !s)} style={{ fontSize: 12, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
              {showEmotions ? "Verberg" : "Toon"}
            </button>
          </div>
          {showEmotions && (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={emotionData} margin={{ top: 4, right: 0, left: -32, bottom: 0 }}>
                  {EMOTIONS.map(({ key, color }) => (
                    <defs key={key}>
                      <linearGradient id={`emoGrad-${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  ))}
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#4A4640" }} tickLine={false} axisLine={false} tickFormatter={(v, i) => (i === 0 || i === emotionData.length - 1) ? v : ""} />
                  <YAxis hide domain={[0, 5]} />
                  <Tooltip content={<CustomTooltip />} />
                  {EMOTIONS.map(({ key, label, color }) => (
                    <Area key={key} type="monotone" dataKey={key} name={label} stroke={color} strokeWidth={1.5} fill={`url(#emoGrad-${key})`} dot={false} />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                {EMOTIONS.map(({ key, label, color }) => (
                  <div key={key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Skills gebruikt */}
      {skillChartData.length > 0 && (
        <div className="surface" style={{ padding: "20px 20px 16px", marginBottom: 16 }}>
          <h2 className="font-display" style={{ fontSize: 20, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 16 }}>Skills deze week</h2>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={skillChartData} margin={{ top: 0, right: 0, left: -32, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#8A8278", fontFamily: "'Geist', system-ui" }} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={32}>
                {skillChartData.map((entry, i) => (
                  <Cell key={i} fill={SKILL_COLORS[i % SKILL_COLORS.length]} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Week summary */}
      <div className="surface" style={{ padding: "20px 24px", marginBottom: 16 }}>
        <p className="eyebrow-muted" style={{ marginBottom: 12 }}>DEZE WEEK</p>
        <p style={{ fontSize: 16, color: "var(--text)", lineHeight: 1.55 }}>{weekSummary(checkIns)}</p>
      </div>

      {isPlus && (
        <div className="surface" style={{ padding: "20px 20px 24px", marginBottom: 16 }}>
          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="eyebrow" style={{ marginBottom: 0 }}>LUNA PLUS</p>
            <Sparkles size={18} style={{ color: "#E8834A" }} strokeWidth={1.5} />
          </div>
          <WellbeingInsight
            isPro={true}
            checkIns={insightCheckins}
            messages={insightMessages
              .filter((m) => m.role === "user" || m.role === "assistant")
              .map((m) => ({ role: m.role, content: m.content || "" }))}
          />
          <Link to="/inzichten" className="btn btn-ghost-accent btn w-full mt-4" style={{ height: 40, fontSize: 14 }}>
            Open volledige inzichten
          </Link>
        </div>
      )}

      {!isPlus && (
        <div className="surface" style={{ padding: "24px 20px", textAlign: "center" }}>
          <Lock size={22} style={{ color: "#E8834A", margin: "0 auto 12px" }} strokeWidth={1.5} />
          <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 4 }}>Volledige geschiedenis en AI-inzichten</p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>Beschikbaar in Luna Plus. €9,99/maand.</p>
          <Link to="/pricing">
            <button type="button" className="btn-ghost-accent btn" style={{ height: 36, fontSize: 13 }}>Upgrade</button>
          </Link>
        </div>
      )}
    </div>
  );
}
