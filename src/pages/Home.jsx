import { Link } from "react-router-dom";
import { MessageCircle, BookHeart, BarChart3, ChevronRight, Flame } from "lucide-react";

const MOODS = ["😔 Zwaar", "😰 Rusteloos", "😐 Vlak", "🙂 Hoopvol", "🤯 In m'n hoofd"];

const QUICK = [
  { to: "/chat", icon: MessageCircle, label: "Start een gesprek", sub: "Nora luistert altijd" },
  { to: "/journal", icon: BookHeart, label: "Schrijf in je dagboek", sub: "5 minuten is genoeg" },
  { to: "/insights", icon: BarChart3, label: "Bekijk je patronen", sub: "Wat helpt jou echt?" },
];

export default function Home() {
  return (
    <div className="px-5 pt-6 space-y-8">
      {/* Greeting */}
      <div>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.50)" }}>Fijn dat je er bent ✦</p>
        <h1 className="mt-1 text-2xl font-bold text-white">Hoe voel je je nu?</h1>
      </div>

      {/* Mood chips */}
      <div className="flex flex-wrap gap-2">
        {MOODS.map((m) => (
          <Link
            key={m}
            to="/chat"
            className="rounded-full px-4 py-2 text-sm font-medium text-white transition-all active:scale-95"
            style={{ background: "#1c1c1e", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            {m}
          </Link>
        ))}
      </div>

      {/* Streak */}
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3"
        style={{ background: "#1c1c1e", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: "rgba(194,90,50,0.20)" }}
        >
          <Flame className="h-5 w-5 text-[#c25a32]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">8 dagen reeks</p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>Regelmaat helpt Nora je beter te leren kennen</p>
        </div>
      </div>

      {/* Section label */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
          Waar wil je beginnen?
        </p>
        <div className="space-y-2">
          {QUICK.map(({ to, icon: Icon, label, sub }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all active:scale-[0.98]"
              style={{ background: "#1c1c1e", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "rgba(194,90,50,0.18)" }}
              >
                <Icon className="h-4 w-4 text-[#c25a32]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{sub}</p>
              </div>
              <ChevronRight className="h-4 w-4" style={{ color: "rgba(255,255,255,0.25)" }} />
            </Link>
          ))}
        </div>
      </div>

      {/* Privacy note */}
      <div
        className="rounded-2xl px-4 py-3"
        style={{ background: "#1c1c1e", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p className="text-xs font-semibold text-white mb-1">🔒 Privacy eerst</p>
        <p className="text-xs leading-5" style={{ color: "rgba(255,255,255,0.45)" }}>
          Je gesprekken en dagboek staan privé op jouw account. Je kunt je data altijd exporteren of verwijderen.
        </p>
      </div>
    </div>
  );
}