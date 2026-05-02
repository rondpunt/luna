import { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, BookHeart, BarChart3, ChevronRight, Flame, FolderHeart } from "lucide-react";
import LunaPresenceBadge from "@/components/luna/LunaPresenceBadge";
import { format } from "date-fns";

const MOODS = [
  { label: "Moe", emoji: "😔", color: "#4A9EFF" },
  { label: "Onrustig", emoji: "😰", color: "#F5A623" },
  { label: "Vlak", emoji: "😐", color: "rgba(240,240,242,0.40)" },
  { label: "Hoopvol", emoji: "🙂", color: "#34C77B" },
  { label: "Overladen", emoji: "🤯", color: "#F04747" },
];

export default function Home() {
  const [selectedMood, setSelectedMood] = useState(null);

  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });
  const { data: checkIns = [] } = useQuery({
    queryKey: ["checkins-home"],
    queryFn: () => base44.entities.CheckIn.list("-date", 30),
  });

  const firstName = user?.full_name?.split(" ")[0] || "";

  // Streak berekenen
  const today = format(new Date(), "yyyy-MM-dd");
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const d = format(new Date(Date.now() - i * 86400000), "yyyy-MM-dd");
    if (checkIns.find((c) => c.date === d)) streak++;
    else if (i > 0) break;
  }

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood.label);
    // Save check-in
    base44.entities.CheckIn.create({ score: MOODS.indexOf(mood) + 1, date: today }).catch(() => {});
  };

  return (
    <div className="px-4 pt-6 pb-6 space-y-7">

      {/* Header */}
      <div className="px-1 space-y-1">
        <p className="text-[14px] font-medium" style={{ color: "var(--text-2)" }}>
          {new Date().getHours() < 12 ? "Goedemorgen" : new Date().getHours() < 18 ? "Goedemiddag" : "Goedeavond"}
          {firstName ? `, ${firstName}` : ""}
        </p>
        <h1 className="text-[30px] font-bold leading-tight" style={{ color: "var(--text)", letterSpacing: "-0.5px" }}>
          Hoe voel je je vandaag?
        </h1>
      </div>

      {/* Mood grid */}
      <div className="flex flex-wrap gap-2 px-1">
        {MOODS.map((m) => {
          const active = selectedMood === m.label;
          return (
            <Link
              key={m.label}
              to="/chat"
              onClick={() => handleMoodSelect(m)}
              className="flex items-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-medium btn-press transition-all"
              style={{
                background: active ? `${m.color}22` : "var(--bg-card)",
                border: `1px solid ${active ? m.color : "var(--line)"}`,
                color: active ? m.color : "var(--text-2)",
              }}
            >
              <span className="text-[16px]">{m.emoji}</span>
              <span>{m.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Luna presence */}
      <div className="px-1">
        <LunaPresenceBadge />
      </div>

      {/* Streak */}
      {streak > 1 && (
        <div
          className="mx-1 flex items-center gap-4 rounded-2xl px-4 py-4"
          style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "rgba(194,90,50,0.15)" }}
          >
            <Flame className="h-5 w-5" style={{ color: "#C25A32" }} />
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>
              {streak} dagen op rij
            </p>
            <p className="text-[13px] mt-0.5" style={{ color: "var(--text-2)" }}>
              Regelmatig babbelen helpt
            </p>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="px-1 space-y-2">
        <p className="text-[12px] font-semibold uppercase tracking-widest px-1 mb-3" style={{ color: "var(--text-3)" }}>
          Beginnen
        </p>
        <div className="list-group">
          {[
            { to: "/chat",     icon: MessageCircle, label: "Start een gesprek",     sub: "Luna luistert",         color: "#C25A32" },
            { to: "/journal",  icon: BookHeart,     label: "Schrijf in je dagboek", sub: "Vijf minuten is genoeg",color: "#4A9EFF" },
            { to: "/insights", icon: BarChart3,     label: "Bekijk je patronen",    sub: "Wat helpt jou echt?",   color: "#34C77B" },
            { to: "/chat",     icon: FolderHeart,   label: "Gespreksmappen",        sub: "Thema's en eerdere chats", color: "#F5A623" },
          ].map(({ to, icon: Icon, label, sub, color }) => (
            <Link key={label} to={to} className="list-row gap-3.5">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{ background: `${color}18` }}
              >
                <Icon className="h-[18px] w-[18px]" style={{ color }} strokeWidth={1.8} />
              </div>
              <div className="flex-1 py-0.5">
                <p className="text-[15px] font-medium" style={{ color: "var(--text)" }}>{label}</p>
                <p className="text-[13px] mt-0.5" style={{ color: "var(--text-2)" }}>{sub}</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0" style={{ color: "var(--text-3)" }} />
            </Link>
          ))}
        </div>
      </div>

      {/* Privacy note */}
      <div
        className="mx-1 rounded-2xl px-4 py-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}
      >
        <p className="text-[13px] font-semibold mb-1" style={{ color: "var(--text)" }}>🔒 Privacy eerst</p>
        <p className="text-[13px] leading-[1.5]" style={{ color: "var(--text-2)" }}>
          Je gesprekken en dagboek staan privé op je eigen account. Exporteer of verwijder alles wanneer je wil.
        </p>
      </div>

    </div>
  );
}