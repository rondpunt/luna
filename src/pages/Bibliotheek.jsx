import { useState } from "react";
import { Search, Clock, Play } from "lucide-react";
import BottomNav from "../components/luna/BottomNav";

const featured = [
  {
    id: 1,
    title: "Omgaan met emoties",
    description: "Een korte oefening voor gemeentelijke controle van je emoties.",
    color: "#e8eeff",
    accent: "#5b7cf6",
    emoji: "💜",
    cta: "Starter",
  },
  {
    id: 2,
    title: "Slaap & Rust",
    description: "Een rustige begeleiding voor een goede nacht slaap.",
    color: "#e6f5f0",
    accent: "#2ecc8c",
    emoji: "🌙",
    cta: "Start",
  },
];

const popular = [
  { id: 1, title: "Praktijkdenken", duration: "10 minuten • 25 min", color: "#5b7cf6", icon: "🧠" },
  { id: 2, title: "Stressverlies", duration: "6 minuten", color: "#2ecc8c", icon: "🌿" },
];

const nieuw = [
  { id: 1, title: "Focus & Concentratie", subtitle: "Verhoog je concentratie en doe meer in minder tijd.", img: "🎯" },
  { id: 2, title: "Zomaathe vloedgolven", subtitle: "Leer hoe je met grote stressgolven omgaat.", img: "🌊" },
];

export default function Bibliotheek() {
  const [search, setSearch] = useState("");

  return (
    <div
      className="min-h-screen pb-32"
      style={{ background: "linear-gradient(160deg, #f0f4ff 0%, #f5f7ff 60%, #eef2fb 100%)" }}
    >
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>
          Bibliotheek
        </h1>
        <p className="text-sm mb-4" style={{ color: "#8a96b0", fontFamily: "'DM Sans', sans-serif" }}>
          Vind een oefening in onze collectie
        </p>

        {/* Search */}
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(180,190,220,0.30)" }}
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
      </div>

      <div className="px-5 space-y-6 max-w-md mx-auto">
        {/* Featured cards */}
        <div className="space-y-3">
          {featured.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl p-5 flex items-start justify-between"
              style={{ background: item.color, boxShadow: "0 2px 12px rgba(100,140,220,0.08)" }}
            >
              <div className="flex-1 pr-4">
                <h3 className="font-semibold text-base mb-1" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>
                  {item.title}
                </h3>
                <p className="text-xs mb-3 leading-relaxed" style={{ color: "#5a6a8a", fontFamily: "'DM Sans', sans-serif" }}>
                  {item.description}
                </p>
                <button
                  className="px-4 py-1.5 rounded-full text-xs font-semibold text-white"
                  style={{ background: item.accent, fontFamily: "'DM Sans', sans-serif" }}
                >
                  {item.cta}
                </button>
              </div>
              <span className="text-4xl">{item.emoji}</span>
            </div>
          ))}
        </div>

        {/* Popular */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>
              Populair
            </h2>
            <button className="text-xs" style={{ color: "#5b7cf6", fontFamily: "'DM Sans', sans-serif" }}>
              Bekijk alles
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {popular.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl p-4"
                style={{ background: "rgba(255,255,255,0.85)", boxShadow: "0 2px 8px rgba(100,140,220,0.08)" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center mb-3"
                  style={{ background: item.color + "22" }}
                >
                  <span className="text-lg">{item.icon}</span>
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>
                  {item.title}
                </p>
                <p className="text-[11px]" style={{ color: "#9aa5be", fontFamily: "'DM Sans', sans-serif" }}>
                  {item.duration}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Nieuw */}
        <div>
          <h2 className="font-semibold text-sm mb-3" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>
            Nieuw in de Bibliotheek
          </h2>
          <div className="space-y-2">
            {nieuw.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.85)", boxShadow: "0 2px 8px rgba(100,140,220,0.06)" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl"
                  style={{ background: "#f0f4ff" }}
                >
                  {item.img}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium mb-0.5 truncate" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>
                    {item.title}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "#8a96b0", fontFamily: "'DM Sans', sans-serif" }}>
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}