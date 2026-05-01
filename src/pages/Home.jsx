import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings, Play } from "lucide-react";
import { motion } from "framer-motion";
import LunaOrb from "../components/luna/LunaOrb";
import Logo from "../components/luna/Logo";
import CheckInDots from "../components/luna/CheckInDots";
import BottomNav from "../components/luna/BottomNav";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Goeiemorgen.";
  if (hour >= 12 && hour < 18) return "Hé, fijn dat je er bent.";
  if (hour >= 18 && hour < 23) return "Goeie avond.";
  return "Het is laat. Je mag er zijn.";
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export default function Home() {
  const queryClient = useQueryClient();
  const today = getToday();

  const { data: checkIns = [] } = useQuery({
    queryKey: ["checkIns"],
    queryFn: () => base44.entities.CheckIn.list("-created_date", 50),
    initialData: [],
  });

  const todayCheckIn = checkIns.find((c) => c.date === today);

  const { data: messages = [] } = useQuery({
    queryKey: ["recentMessages"],
    queryFn: () => base44.entities.ChatMessage.list("-created_date", 1),
    initialData: [],
  });

  const saveCheckIn = useMutation({
    mutationFn: async (score) => {
      if (todayCheckIn) {
        await base44.entities.CheckIn.update(todayCheckIn.id, { score });
      } else {
        await base44.entities.CheckIn.create({ score, date: today });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["checkIns"] }),
  });

  // Calculate streak
  const streak = (() => {
    const dates = [...new Set(checkIns.map((c) => c.date))].sort().reverse();
    let count = 0;
    const todayDate = new Date(today);
    for (let i = 0; i < dates.length; i++) {
      const d = new Date(dates[i]);
      const diff = Math.floor((todayDate - d) / (1000 * 60 * 60 * 24));
      if (diff === i) count++;
      else break;
    }
    return count;
  })();

  // Weekly average
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekCheckIns = checkIns.filter((c) => new Date(c.date) >= weekAgo);
  const weekAvg =
    weekCheckIns.length > 0
      ? (weekCheckIns.reduce((s, c) => s + c.score, 0) / weekCheckIns.length).toFixed(1)
      : null;

  // Last conversation time
  const lastMessageTime = messages[0]?.created_date;
  const lastMessageRelative = lastMessageTime
    ? getRelativeTime(lastMessageTime)
    : null;

  return (
    <div
      className="min-h-screen flex flex-col pb-20"
      style={{ backgroundColor: "var(--luna-bg-base)" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <Logo showOrb />
        <Link to="/profiel">
          <Settings className="w-5 h-5" style={{ color: "var(--luna-text-muted)" }} />
        </Link>
      </header>

      <div className="flex-1 flex flex-col items-center px-6 max-w-md mx-auto w-full">
        {/* Orb */}
        <div className="py-8">
          <LunaOrb size={160} state="idle" />
        </div>

        {/* Greeting */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-semibold text-center mb-8"
          style={{ color: "var(--luna-text-primary)" }}
        >
          {getGreeting()}
        </motion.h1>

        {/* Check-in */}
        <div className="w-full mb-6">
          <CheckInDots
            currentScore={todayCheckIn?.score || null}
            onSelect={(score) => saveCheckIn.mutate(score)}
          />
        </div>

        {/* CTA */}
        <Link
          to="/chat"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-medium text-white transition-all active:scale-[0.97] mb-4"
          style={{
            backgroundColor: "var(--luna-accent)",
            boxShadow: "0 4px 24px rgba(159,134,255,0.45)",
          }}
        >
          <Play className="w-4 h-4" />
          Praat met Luna
        </Link>

        {/* Streak */}
        {streak >= 2 && (
          <p className="text-sm text-center mb-6" style={{ color: "var(--luna-text-muted)" }}>
            Reeks: {streak} dagen — fijn werk
          </p>
        )}

        {/* Stats cards */}
        {(lastMessageRelative || weekAvg) && (
          <div className="grid grid-cols-2 gap-3 w-full">
            {lastMessageRelative && (
              <div
                className="rounded-xl p-4"
                style={{
                  backgroundColor: "var(--luna-bg-elev)",
                  border: "1px solid var(--luna-border)",
                }}
              >
                <p className="text-xs mb-1" style={{ color: "var(--luna-text-muted)" }}>
                  Laatste gesprek
                </p>
                <p className="text-sm font-medium" style={{ color: "var(--luna-text-primary)" }}>
                  {lastMessageRelative}
                </p>
              </div>
            )}
            {weekAvg && (
              <div
                className="rounded-xl p-4"
                style={{
                  backgroundColor: "var(--luna-bg-elev)",
                  border: "1px solid var(--luna-border)",
                }}
              >
                <p className="text-xs mb-1" style={{ color: "var(--luna-text-muted)" }}>
                  Deze week
                </p>
                <p className="text-sm font-medium" style={{ color: "var(--luna-text-primary)" }}>
                  gemiddeld {weekAvg}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function getRelativeTime(dateStr) {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "zojuist";
  if (diffMin < 60) return `${diffMin} min geleden`;
  if (diffHr < 24) return `${diffHr} u geleden`;
  return `${diffDay} d geleden`;
}