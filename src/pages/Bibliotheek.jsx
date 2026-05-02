import { useState } from "react";
import { Search, Lock, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import BottomNav from "../components/luna/BottomNav";

const CATEGORIES = ["Alles", "Ademhaling", "Slaap", "Angst", "Stemming", "Gronden"];

const EXERCISES = [
  {
    id: 1,
    title: "Box Breathing",
    desc: "Kalm je zenuwstelsel in 4 minuten met deze militaire techniek.",
    duration: "4 min",
    category: "Ademhaling",
    emoji: "🌬️",
    color: "#e8f0fe",
    accent: "#3b5bdb",
    pro: false,
  },
  {
    id: 2,
    title: "5-4-3-2-1 Gronden",
    desc: "Kom terug in je lichaam wanneer gedachten overweldigen.",
    duration: "5 min",
    category: "Gronden",
    emoji: "🌿",
    color: "#e6f5f0",
    accent: "#1e7a8c",
    pro: false,
  },
  {
    id: 3,
    title: "De Slaapboot",
    desc: "Geleide visualisatie voor een rustiger inslapen.",
    duration: "12 min",
    category: "Slaap",
    emoji: "🌙",
    color: "#f0eeff",
    accent: "#7c3aed",
    pro: false,
  },
  {
    id: 4,
    title: "Angstgolf Surfen",
    desc: "Accepteer en observeer je angst zonder erdoor meegesleurd te worden.",
    duration: "8 min",
    category: "Angst",
    emoji: "🌊",
    color: "#fff7ed",
    accent: "#f97316",
    pro: true,
  },
  {
    id: 5,
    title: "Stemmingsdagboek",
    desc: "Schrijf je dag van je af en ontdek terugkerende patronen.",
    duration: "10 min",
    category: "Stemming",
    emoji: "📓",
    color: "#fef9e7",
    accent: "#d97706",
    pro: true,
  },
  {
    id: 6,
    title: "4-7-8 Ademhaling",
    desc: "Verlaag je hartslag en adem je stress letterlijk weg.",
    duration: "3 min",
    category: "Ademhaling",
    emoji: "💨",
    color: "#e8f0fe",
    accent: "#3b5bdb",
    pro: false,
  },
  {
    id: 7,
    title: "Progressieve Spierontspanning",
    desc: "Span en ontspan spiergroepen voor diepe lichamelijke rust.",
    duration: "15 min",
    category: "Slaap",
    emoji: "🧘",
    color: "#f0eeff",
    accent: "#7c3aed",
    pro: true,
  },
  {
    id: 8,
    title: "Gedachtenstop",
    desc: "Doorbreek negatieve gedachtenspiralen in het moment.",
    duration: "2 min",
    category: "Angst",
    emoji: "🛑",
    color: "#fef2f2",
    accent: "#ef4444",
    pro: false,
  },
];

export default function Bibliotheek() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Alles");

  const filtered = EXERCISES.filter((ex) => {
    const matchCat = activeCategory === "Alles" || ex.category === activeCategory;
    const matchSearch = ex.title.toLowerCase().includes(search.toLowerCase()) || ex.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const free = filtered.filter((e) => !e.pro);
  const pro = filtered.filter((e) => e.pro);

  return (
    <div
      className="min-h-screen pb-32"
      style={{ background: "linear-gradient(160deg, #f0f4ff 0%, #f5f7ff 60%, #eef2fb 100%)" }}
    >
      {/* Header */}
      <div className="px-5 pt-12 pb-3">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>
          Bibliotheek
        </h1>
        <p className="text-sm mb-4" style={{ color: "#8a96b0", fontFamily: "'DM Sans', sans-serif" }}>
          Bewezen technieken voor moeilijke momenten
        </p>

        {/* Search */}
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-2xl mb-4"
          style={{ background: "rgba(255,255,255,0.90)", border: "1px solid rgba(180,190,220,0.25)", boxShadow: "0 2px 8px rgba(100,140,220,0.06)" }}
        >
          <Search className="w-4 h-4 shrink-0" style={{ color: "#9aa5be" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek een oefening..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all"
              style={{
                background: activeCategory === cat ? "#1e7a8c" : "rgba(255,255,255,0.85)",
                color: activeCategory === cat ? "white" : "#6b7a99",
                boxShadow: activeCategory === cat ? "0 2px 10px rgba(30,122,140,0.25)" : "none",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 space-y-5 max-w-md mx-auto">

        {/* Free exercises */}
        {free.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#b0bace", fontFamily: "'DM Sans', sans-serif" }}>
              Gratis oefeningen
            </p>
            <div className="space-y-3">
              {free.map((ex) => (
                <div
                  key={ex.id}
                  className="rounded-2xl p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all"
                  style={{ background: "rgba(255,255,255,0.90)", boxShadow: "0 2px 10px rgba(100,140,220,0.08)" }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl"
                    style={{ background: ex.color }}
                  >
                    {ex.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold mb-0.5" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>
                      {ex.title}
                    </p>
                    <p className="text-xs leading-relaxed mb-1" style={{ color: "#8a96b0", fontFamily: "'DM Sans', sans-serif" }}>
                      {ex.desc}
                    </p>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" style={{ color: "#b0bace" }} />
                      <span className="text-[11px]" style={{ color: "#b0bace", fontFamily: "'DM Sans', sans-serif" }}>{ex.duration}</span>
                    </div>
                  </div>
                  <button
                    className="px-3 py-1.5 rounded-full text-xs font-semibold shrink-0"
                    style={{ background: ex.accent, color: "white", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Start
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pro exercises */}
        {pro.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#b0bace", fontFamily: "'DM Sans', sans-serif" }}>
                Luna Pro
              </p>
              <Link to="/prijzen" className="text-xs font-semibold" style={{ color: "#5b7cf6", fontFamily: "'DM Sans', sans-serif" }}>
                Ontgrendelen →
              </Link>
            </div>
            <div className="space-y-3">
              {pro.map((ex) => (
                <div
                  key={ex.id}
                  className="rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.70)", boxShadow: "0 2px 10px rgba(100,140,220,0.06)" }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl"
                    style={{ background: ex.color, opacity: 0.5 }}
                  >
                    {ex.emoji}
                  </div>
                  <div className="flex-1 min-w-0" style={{ opacity: 0.5 }}>
                    <p className="text-sm font-semibold mb-0.5" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>
                      {ex.title}
                    </p>
                    <p className="text-xs" style={{ color: "#8a96b0", fontFamily: "'DM Sans', sans-serif" }}>
                      {ex.desc}
                    </p>
                  </div>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "#f0f4ff" }}
                  >
                    <Lock className="w-4 h-4" style={{ color: "#5b7cf6" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Pro CTA */}
            <Link to="/prijzen">
              <div
                className="mt-4 rounded-2xl p-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
                style={{
                  background: "linear-gradient(135deg, #eef2ff 0%, #e8edff 100%)",
                  border: "1px solid rgba(91,124,246,0.20)",
                }}
              >
                <div>
                  <p className="text-sm font-bold" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>
                    Alles ontgrendelen voor €4,99/maand
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#6b7a99", fontFamily: "'DM Sans', sans-serif" }}>
                    Annuleer wanneer je wil · geen verborgen kosten
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 shrink-0" style={{ color: "#5b7cf6" }} />
              </div>
            </Link>
          </div>
        )}

      </div>
      <BottomNav />
    </div>
  );
}