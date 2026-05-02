import { Link } from "react-router-dom";
import { MessageCircle, Mic, BookHeart } from "lucide-react";
import { t } from "@/lib/i18n";

export default function Home() {
  return (
    <div className="px-5 pt-6">
      {/* Begroeting */}
      <p className="text-sm text-muted-foreground">{t.home.welcome}</p>
      <h1 className="mt-1 text-2xl font-semibold text-[#1a3326]">{t.home.moodPrompt}</h1>

      {/* Stemming chips */}
      <div className="mt-5 flex flex-wrap gap-2">
        {t.home.moods.map((mood) => (
          <button
            key={mood}
            className="rounded-full bg-white px-4 py-2 text-sm capitalize text-[#1a3326]"
            style={{ border: "1px solid rgba(63,138,85,0.18)" }}
          >
            {mood}
          </button>
        ))}
      </div>

      {/* Vandaag */}
      <p className="mt-8 text-xs font-medium uppercase tracking-[0.16em] text-[#5b7a66]">
        {t.home.todayPath}
      </p>
      <div className="mt-3 space-y-2">
        {[
          { to: "/chat", icon: MessageCircle, label: t.home.resumeChat },
          { to: "/voice", icon: Mic, label: t.home.startVoice },
          { to: "/journal", icon: BookHeart, label: t.home.journal5 },
        ].map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4"
            style={{ border: "1px solid rgba(63,138,85,0.12)" }}
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: "rgba(63,138,85,0.10)" }}
            >
              <Icon className="h-4 w-4 text-[#3f8a55]" />
            </div>
            <span className="text-sm text-[#1a3326]">{label}</span>
          </Link>
        ))}
      </div>

      {/* Reeks (subtiele lijn) */}
      <div className="mt-8 flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">{t.home.streak}</span>
        <span className="text-2xl font-semibold text-[#1a3326]">{t.home.streakDays(8)}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{t.home.streakNote}</p>
    </div>
  );
}