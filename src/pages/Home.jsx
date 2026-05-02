import { Link } from "react-router-dom";
import { MessageCircle, BookHeart, BarChart3, ChevronRight, Flame } from "lucide-react";

const MOODS = [
  { label: "Zwaar", emoji: "😔" },
  { label: "Rusteloos", emoji: "😰" },
  { label: "Vlak", emoji: "😐" },
  { label: "Hoopvol", emoji: "🙂" },
  { label: "Overladen", emoji: "🤯" },
];

const QUICK = [
  { to: "/chat", icon: MessageCircle, label: "Start een gesprek", sub: "Nora luistert altijd" },
  { to: "/journal", icon: BookHeart, label: "Schrijf in je dagboek", sub: "5 minuten is genoeg" },
  { to: "/insights", icon: BarChart3, label: "Bekijk je patronen", sub: "Wat helpt jou echt?" },
];

export default function Home() {
  return (
    <div className="px-4 pt-6 pb-6 space-y-8">

      {/* Header */}
      <div className="px-1">
        <p className="text-[15px]" style={{ color: "rgba(235,235,245,0.60)" }}>Fijn dat je er bent</p>
        <h1 className="mt-0.5 text-[34px] font-bold leading-tight" style={{ color: "#fff", letterSpacing: "-0.5px" }}>
          Hoe voel je je?
        </h1>
      </div>

      {/* Mood selector — iOS pill style */}
      <div className="flex flex-wrap gap-2 px-1">
        {MOODS.map(({ label, emoji }) => (
          <Link
            key={label}
            to="/chat"
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-[15px] font-medium transition-all active:scale-95"
            style={{
              background: "rgba(120,120,128,0.24)",
              color: "#fff",
              border: "none",
            }}
          >
            <span>{emoji}</span>
            <span>{label}</span>
          </Link>
        ))}
      </div>

      {/* Streak — iOS card */}
      <div
        className="mx-1 flex items-center gap-3 rounded-2xl px-4 py-3.5"
        style={{ background: "#1C1C1E" }}
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: "rgba(194,90,50,0.22)" }}
        >
          <Flame className="h-5 w-5" style={{ color: "#C25A32" }} />
        </div>
        <div className="flex-1">
          <p className="text-[15px] font-semibold" style={{ color: "#fff" }}>8 dagen reeks</p>
          <p className="text-[13px]" style={{ color: "rgba(235,235,245,0.50)" }}>Regelmaat helpt Nora je beter kennen</p>
        </div>
        <Flame className="h-4 w-4" style={{ color: "rgba(194,90,50,0.40)" }} />
      </div>

      {/* Quick actions — iOS grouped list */}
      <div className="px-1">
        <p
          className="text-[13px] font-semibold uppercase tracking-wider mb-2 px-2"
          style={{ color: "rgba(235,235,245,0.55)" }}
        >
          Beginnen
        </p>
        <div className="ios-list">
          {QUICK.map(({ to, icon: Icon, label, sub }, i) => (
            <Link key={to} to={to} className="ios-list-row gap-3 active:bg-white/5">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ background: "rgba(194,90,50,0.22)" }}
              >
                <Icon className="h-[18px] w-[18px]" style={{ color: "#C25A32" }} />
              </div>
              <div className="flex-1 py-0.5">
                <p className="text-[15px] font-medium" style={{ color: "#fff" }}>{label}</p>
                <p className="text-[13px]" style={{ color: "rgba(235,235,245,0.50)" }}>{sub}</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0" style={{ color: "rgba(235,235,245,0.30)" }} />
            </Link>
          ))}
        </div>
      </div>

      {/* Privacy note */}
      <div
        className="mx-1 rounded-2xl px-4 py-3.5"
        style={{ background: "#1C1C1E" }}
      >
        <p className="text-[13px] font-semibold mb-1" style={{ color: "rgba(235,235,245,0.85)" }}>🔒 Privacy eerst</p>
        <p className="text-[13px] leading-5" style={{ color: "rgba(235,235,245,0.50)" }}>
          Je gesprekken en dagboek staan privé op jouw account. Exporteer of verwijder alles wanneer je wil.
        </p>
      </div>

    </div>
  );
}