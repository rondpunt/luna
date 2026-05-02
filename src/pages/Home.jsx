import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Slider } from "@/components/ui/slider";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import GlassCard from "../components/luna/GlassCard";
import LunaOrb from "../components/luna/LunaOrb";
import BottomNav from "../components/luna/BottomNav";

const GREETINGS = [
  "Hoe gaat het vandaag echt met je?",
  "Fijn dat je er bent.",
  "Jouw ruimte. Altijd hier.",
  "Hoe voel je je op dit moment?",
];

export default function Home() {
  const [mood, setMood] = useState([5]);
  const [checkedIn, setCheckedIn] = useState(false);
  const queryClient = useQueryClient();
  const today = format(new Date(), "yyyy-MM-dd");
  const greeting = GREETINGS[new Date().getHours() % GREETINGS.length];

  const { data: todayCheckIn } = useQuery({
    queryKey: ["checkin-today"],
    queryFn: () => base44.entities.CheckIn.filter({ date: today }),
  });

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
      setCheckedIn(true);
    },
  });

  const moodLabel = (v) => {
    if (v <= 2) return "Zwaar";
    if (v <= 4) return "Matig";
    if (v <= 6) return "Gaat wel";
    if (v <= 8) return "Goed";
    return "Top";
  };

  return (
    <div className="min-h-screen pb-32" style={{ background: "radial-gradient(ellipse at 80% -10%, rgba(180,120,20,0.12), transparent 50%), radial-gradient(ellipse at 50% -5%, rgba(79,70,229,0.10), transparent 45%), #080d1e" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-6 flex items-center justify-between">
        <div>
          <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>
            {format(new Date(), "EEEE d MMMM", { locale: nl })}
          </p>
          <h1 className="text-2xl" style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic", color: "rgba(255,255,255,0.92)" }}>
            {greeting}
          </h1>
        </div>
        <LunaOrb size={38} state="idle" />
      </div>

      <div className="px-5 space-y-4 max-w-md mx-auto">
        {/* Daily check-in */}
        <GlassCard className="p-5">
          <p className="text-xs mb-3 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.30)", fontFamily: "'DM Sans', sans-serif" }}>
            Dagelijkse check-in
          </p>
          {checkedIn ? (
            <div className="text-center py-2">
              <p className="text-3xl mb-1" style={{ fontFamily: "'Lora', Georgia, serif", color: "rgba(255,255,255,0.92)" }}>
                {mood[0]}/10
              </p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif" }}>
                {moodLabel(mood[0])} · vandaag ingevuld
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif" }}>
                  Hoe voel je je? <span className="font-semibold" style={{ color: "rgba(255,255,255,0.92)" }}>{mood[0]}/10 – {moodLabel(mood[0])}</span>
                </p>
              </div>
              <Slider
                value={mood}
                onValueChange={setMood}
                min={1}
                max={10}
                step={1}
                className="mb-4"
              />
              <button
                onClick={() => createCheckIn.mutate(mood[0])}
                disabled={createCheckIn.isPending}
                className="w-full py-3 rounded-full text-sm font-medium text-white transition-all active:scale-[0.97]"
                style={{ background: "#6366f1", boxShadow: "0 0 16px rgba(99,102,241,0.35)", fontFamily: "'DM Sans', sans-serif" }}
              >
                {createCheckIn.isPending ? "Opslaan..." : "Bewaar check-in"}
              </button>
            </>
          )}
        </GlassCard>

        {/* CTA chat */}
        <Link to="/chat">
          <GlassCard className="p-5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all" style={{ border: "1px solid rgba(129,140,248,0.25)" }}>
            <div>
              <p className="text-base font-semibold mb-0.5" style={{ color: "rgba(255,255,255,0.92)", fontFamily: "'DM Sans', sans-serif" }}>
                Praat met Luna
              </p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.40)", fontFamily: "'DM Sans', sans-serif" }}>
                Je ruimte, geen oordeel.
              </p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#6366f1", boxShadow: "0 0 16px rgba(99,102,241,0.4)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </GlassCard>
        </Link>

        {/* Tips */}
        <GlassCard className="p-5">
          <p className="text-xs mb-3 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.30)", fontFamily: "'DM Sans', sans-serif" }}>
            Even pauzeren
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif" }}>
            Adem drie tellen in, hou drie tellen vast, adem zes tellen uit. Dat is alles.
          </p>
        </GlassCard>
      </div>

      <BottomNav />
    </div>
  );
}