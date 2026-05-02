import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Slider } from "@/components/ui/slider";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { Flame, ChevronRight, Sparkles, BookOpen, MessageCircle } from "lucide-react";
import LunaOrb from "../components/luna/LunaOrb";
import BottomNav from "../components/luna/BottomNav";

const GREETINGS_MORNING = ["Goedemorgen. Hoe slaap je gevallen?", "Een nieuwe dag. Hoe voel jij je nu al?"];
const GREETINGS_AFTERNOON = ["Hoe loopt de dag tot nu toe?", "Even inchecken. Hoe gaat het?"];
const GREETINGS_EVENING = ["Hoe was je dag echt?", "De avond is van jou. Hoe voel je je?"];

function getGreeting() {
  const h = new Date().getHours();
  const arr = h < 12 ? GREETINGS_MORNING : h < 18 ? GREETINGS_AFTERNOON : GREETINGS_EVENING;
  return arr[Math.floor(Math.random() * arr.length)];
}

const MOOD_LABELS = ["", "Zwaar", "Zwaar", "Moeilijk", "Wisselend", "Gaat wel", "Gaat wel", "Goed", "Goed", "Heel goed", "Top"];
const MOOD_COLORS = ["", "#ef4444", "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e", "#22c55e", "#10b981", "#10b981", "#06b6d4"];

const TIPS = [
  { icon: "🌬️", title: "Box breathing", desc: "4 tellen in · 4 vasthouden · 4 uit · 4 wachten. Herhaal 4x.", tag: "Kalmte" },
  { icon: "🌿", title: "5-4-3-2-1 gronden", desc: "Benoem 5 dingen die je ziet, 4 die je voelt, 3 die je hoort...", tag: "Anker" },
  { icon: "💭", title: "Gedachtenstop", desc: "Zeg luid of in gedachten 'STOP'. Visualiseer een rood stopteken.", tag: "Gedachten" },
];

export default function Home() {
  const [mood, setMood] = useState([5]);
  const [checkedIn, setCheckedIn] = useState(false);
  const [greeting] = useState(getGreeting);
  const [tipIdx] = useState(() => Math.floor(Math.random() * TIPS.length));
  const queryClient = useQueryClient();
  const today = format(new Date(), "yyyy-MM-dd");
  const tip = TIPS[tipIdx];

  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });
  const { data: todayCheckIn } = useQuery({
    queryKey: ["checkin-today"],
    queryFn: () => base44.entities.CheckIn.filter({ date: today }),
  });
  const { data: allCheckIns = [] } = useQuery({
    queryKey: ["checkins-streak"],
    queryFn: () => base44.entities.CheckIn.list("-date", 30),
  });

  // Compute streak
  const streak = (() => {
    let s = 0;
    for (let i = 0; i < 30; i++) {
      const d = format(new Date(Date.now() - i * 86400000), "yyyy-MM-dd");
      if (allCheckIns.find((c) => c.date === d)) s++;
      else break;
    }
    return s;
  })();

  useEffect(() => {
    if (todayCheckIn && todayCheckIn.length > 0) {
      setCheckedIn(true);
      setMood([todayCheckIn[0].score]);
    }
  }, [todayCheckIn]);

  const createCheckIn = useMutation({
    mutationFn: (score) => base44.entities.CheckIn.create({ score, date: today }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkin-today"] });
      queryClient.invalidateQueries({ queryKey: ["checkins-streak"] });
      setCheckedIn(true);
    },
  });

  const name = user?.full_name?.split(" ")[0] || "";

  return (
    <div
      className="min-h-screen pb-32"
      style={{ background: "linear-gradient(160deg, #f0f4ff 0%, #f5f7ff 55%, #eaeffa 100%)" }}
    >
      {/* Header */}
      <div className="px-5 pt-12 pb-5 flex items-start justify-between">
        <div>
          <p className="text-xs mb-1 font-medium" style={{ color: "#9aa5be", fontFamily: "'DM Sans', sans-serif" }}>
            {format(new Date(), "EEEE d MMMM", { locale: nl })}
          </p>
          <h1 className="text-xl font-bold leading-snug" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif", maxWidth: 220 }}>
            {name ? `Hé ${name}, ` : ""}{greeting}
          </h1>
        </div>
        <LunaOrb size={42} state="idle" />
      </div>

      <div className="px-5 space-y-4 max-w-md mx-auto">

        {/* Streak banner — social proof / retention hook */}
        {streak > 0 && (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.85)", boxShadow: "0 2px 10px rgba(100,140,220,0.08)" }}
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fff3e0" }}>
              <Flame className="w-5 h-5" style={{ color: "#f97316" }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>
                {streak} {streak === 1 ? "dag" : "dagen"} op rij 🔥
              </p>
              <p className="text-xs" style={{ color: "#8a96b0", fontFamily: "'DM Sans', sans-serif" }}>
                Blijf inchecken en bouw je reeks op
              </p>
            </div>
          </div>
        )}

        {/* Daily check-in */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.90)", boxShadow: "0 2px 14px rgba(100,140,220,0.10)" }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#b0bace", fontFamily: "'DM Sans', sans-serif" }}>
            Dagelijkse check-in
          </p>
          {checkedIn ? (
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: MOOD_COLORS[mood[0]] + "18" }}
              >
                <span className="text-2xl font-bold" style={{ color: MOOD_COLORS[mood[0]], fontFamily: "'DM Sans', sans-serif" }}>
                  {mood[0]}
                </span>
              </div>
              <div>
                <p className="font-semibold text-base" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>
                  {MOOD_LABELS[mood[0]]}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#9aa5be", fontFamily: "'DM Sans', sans-serif" }}>
                  Vandaag ingevuld · goed gedaan
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm" style={{ color: "#5a6a8a", fontFamily: "'DM Sans', sans-serif" }}>
                  Hoe voel je je op een schaal van 1 tot 10?
                </p>
                <span className="text-xl font-bold ml-3 shrink-0" style={{ color: MOOD_COLORS[mood[0]], fontFamily: "'DM Sans', sans-serif" }}>
                  {mood[0]}
                </span>
              </div>
              <Slider value={mood} onValueChange={setMood} min={1} max={10} step={1} className="mb-1" />
              <div className="flex justify-between mb-4">
                <span className="text-[10px]" style={{ color: "#b0bace", fontFamily: "'DM Sans', sans-serif" }}>Zwaar</span>
                <span className="text-[10px]" style={{ color: "#b0bace", fontFamily: "'DM Sans', sans-serif" }}>{MOOD_LABELS[mood[0]]}</span>
                <span className="text-[10px]" style={{ color: "#b0bace", fontFamily: "'DM Sans', sans-serif" }}>Top</span>
              </div>
              <button
                onClick={() => createCheckIn.mutate(mood[0])}
                disabled={createCheckIn.isPending}
                className="w-full py-3 rounded-full text-sm font-semibold text-white transition-all active:scale-[0.97] disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #1e7a8c, #1a6678)",
                  boxShadow: "0 4px 14px rgba(30,122,140,0.28)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {createCheckIn.isPending ? "Opslaan..." : "Bewaar check-in"}
              </button>
            </>
          )}
        </div>

        {/* CTA — praat met Luna */}
        <Link to="/chat">
          <div
            className="rounded-2xl p-5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
            style={{
              background: "linear-gradient(135deg, #1e7a8c 0%, #1a5f7a 100%)",
              boxShadow: "0 4px 20px rgba(30,122,140,0.30)",
            }}
          >
            <div>
              <p className="text-base font-bold mb-1 text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Praat met Luna
              </p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.70)", fontFamily: "'DM Sans', sans-serif" }}>
                Jouw ruimte. Geen oordeel.
              </p>
            </div>
            <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.18)" }}>
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
          </div>
        </Link>

        {/* Tip van de dag */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.90)", boxShadow: "0 2px 10px rgba(100,140,220,0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#b0bace", fontFamily: "'DM Sans', sans-serif" }}>
              Tip van vandaag
            </p>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: "#e8f0fe", color: "#3b5bdb", fontFamily: "'DM Sans', sans-serif" }}
            >
              {tip.tag}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">{tip.icon}</span>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>
                {tip.title}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "#6b7a99", fontFamily: "'DM Sans', sans-serif" }}>
                {tip.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Bibliotheek shortcut */}
        <Link to="/bibliotheek">
          <div
            className="rounded-2xl p-4 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-all"
            style={{ background: "rgba(255,255,255,0.85)", boxShadow: "0 2px 8px rgba(100,140,220,0.07)" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#eef2ff" }}>
              <BookOpen className="w-5 h-5" style={{ color: "#5b7cf6" }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>
                Ontdek de bibliotheek
              </p>
              <p className="text-xs" style={{ color: "#8a96b0", fontFamily: "'DM Sans', sans-serif" }}>
                Oefeningen voor ademhaling, slaap en meer
              </p>
            </div>
            <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "#c0cce0" }} />
          </div>
        </Link>

        {/* Pro upsell — urgency + value hook */}
        <Link to="/prijzen">
          <div
            className="rounded-2xl p-4 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-all"
            style={{
              background: "linear-gradient(135deg, #eef2ff 0%, #e8edff 100%)",
              border: "1px solid rgba(91,124,246,0.18)",
              boxShadow: "0 2px 8px rgba(91,124,246,0.08)",
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(91,124,246,0.12)" }}>
              <Sparkles className="w-5 h-5" style={{ color: "#5b7cf6" }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>
                Ontgrendel Luna Pro
              </p>
              <p className="text-xs" style={{ color: "#6b7a99", fontFamily: "'DM Sans', sans-serif" }}>
                Patronen zien, persoonlijke inzichten, AI-geheugen
              </p>
            </div>
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0"
              style={{ background: "#5b7cf6", color: "white", fontFamily: "'DM Sans', sans-serif" }}
            >
              Pro
            </span>
          </div>
        </Link>

      </div>
      <BottomNav />
    </div>
  );
}