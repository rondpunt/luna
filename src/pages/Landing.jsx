import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import LunaOrb from "../components/luna/LunaOrb";
import GlassCard from "../components/luna/GlassCard";

export default function Landing() {
  const handleLogin = () => base44.auth.redirectToLogin("/home");

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 text-center"
      style={{
        background: "radial-gradient(ellipse at 80% -10%, rgba(180,120,20,0.12), transparent 50%), radial-gradient(ellipse at 50% -5%, rgba(79,70,229,0.10), transparent 45%), #080d1e",
      }}
    >
      <LunaOrb size={100} state="idle" className="mb-8" />

      <h1
        className="text-4xl mb-3"
        style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic", color: "rgba(255,255,255,0.92)" }}
      >
        luna
      </h1>
      <p className="text-base mb-2" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif" }}>
        Jouw ruimte. Altijd hier.
      </p>
      <p className="text-sm mb-10 max-w-xs" style={{ color: "rgba(255,255,255,0.30)", fontFamily: "'DM Sans', sans-serif" }}>
        Anonieme, empathische AI-gezel voor emotioneel welzijn. Geen oordeel. Geen diagnose.
      </p>

      <div className="w-full max-w-xs space-y-3">
        <button
          onClick={handleLogin}
          className="w-full py-4 rounded-full text-sm font-semibold text-white transition-all active:scale-[0.97]"
          style={{
            background: "#6366f1",
            boxShadow: "0 0 24px rgba(99,102,241,0.4)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Begin gratis
        </button>
        <button
          onClick={handleLogin}
          className="w-full py-4 rounded-full text-sm font-medium transition-all active:scale-[0.97]"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
            color: "rgba(255,255,255,0.60)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Inloggen
        </button>
      </div>

      <p className="text-xs mt-8" style={{ color: "rgba(255,255,255,0.20)", fontFamily: "'DM Sans', sans-serif" }}>
        🇧🇪 Belgisch · 🇪🇺 EU-servers · 🔒 Privé
      </p>

      <div className="flex gap-4 mt-4">
        <Link to="/privacy" className="text-xs" style={{ color: "rgba(255,255,255,0.20)", fontFamily: "'DM Sans', sans-serif" }}>Privacy</Link>
        <Link to="/voorwaarden" className="text-xs" style={{ color: "rgba(255,255,255,0.20)", fontFamily: "'DM Sans', sans-serif" }}>Voorwaarden</Link>
      </div>

      {/* Crisis */}
      <a
        href="tel:080032123"
        className="mt-6 px-4 py-2 rounded-full text-xs"
        style={{
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.15)",
          color: "rgba(248,113,113,0.70)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        In nood? Zelfmoordlijn 0800 32 123 (gratis, 24/7)
      </a>
    </div>
  );
}