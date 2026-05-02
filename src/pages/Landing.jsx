import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Heart, ShieldCheck, Star, Users } from "lucide-react";
import { motion } from "framer-motion";

function LunaOrbLight({ size = 140 }) {
  return (
    <motion.div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 38% 32%, rgba(255,255,255,0.98) 0%, rgba(190,210,255,0.85) 30%, rgba(160,190,245,0.65) 58%, rgba(140,175,235,0.40) 80%, rgba(120,160,225,0.20) 100%)",
        boxShadow:
          "0 8px 48px rgba(80,130,220,0.22), 0 2px 14px rgba(160,195,255,0.20), inset 0 1px 1px rgba(255,255,255,0.6)",
        position: "relative",
        flexShrink: 0,
      }}
      animate={{ scale: [1, 1.03, 1] }}
      transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity }}
    >
      <div style={{ position: "absolute", top: "18%", left: "16%", width: "52%", height: "52%", borderRadius: "60% 40% 55% 45% / 50% 60% 40% 55%", background: "radial-gradient(circle at 38% 38%, rgba(210,225,255,0.85) 0%, rgba(180,205,255,0.50) 55%, transparent 80%)", filter: "blur(7px)" }} />
      <div style={{ position: "absolute", top: "32%", left: "28%", width: "42%", height: "42%", borderRadius: "50%", background: "radial-gradient(circle, rgba(225,215,255,0.75) 0%, rgba(195,210,255,0.40) 60%, transparent 90%)", filter: "blur(9px)" }} />
      <div style={{ position: "absolute", bottom: -8, left: "18%", width: "64%", height: 12, background: "radial-gradient(ellipse, rgba(90,130,220,0.18) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(5px)" }} />
    </motion.div>
  );
}

const REVIEWS = [
  { name: "Lien V.", text: "Eindelijk een app die echt luistert. Geen platitudes, gewoon aanwezig." },
  { name: "Thomas M.", text: "Luna geeft me het gevoel dat ik niet alleen ben. Elke dag gebruik ik het." },
];

export default function Landing() {
  const handleStart = () => base44.auth.redirectToLogin("/home");

  return (
    <div
      className="min-h-screen flex flex-col items-center px-6 py-10"
      style={{ background: "linear-gradient(160deg, #e8f0fb 0%, #f0f4ff 45%, #e4eef9 100%)" }}
    >
      {/* Top bar */}
      <div className="w-full max-w-sm flex justify-end mb-6">
        <Link to="/prijzen" className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.80)", color: "#5b7cf6", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 2px 8px rgba(100,140,220,0.10)" }}>
          Luna Pro →
        </Link>
      </div>

      {/* Orb + headline */}
      <div className="flex flex-col items-center text-center w-full max-w-sm flex-1">
        <div className="mb-7 mt-2">
          <LunaOrbLight size={140} />
        </div>

        <h1 className="text-[30px] font-bold mb-3 leading-tight" style={{ color: "#1a2340", fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
          Hoi, ik ben Luna.
        </h1>
        <p className="text-base mb-2 leading-relaxed" style={{ color: "#5a6a8a", fontFamily: "'DM Sans', sans-serif", maxWidth: 260 }}>
          Ik ben hier om naar je te luisteren — zonder oordeel, zonder wachttijd.
        </p>
        <p className="text-sm mb-8 font-medium" style={{ color: "#9aa5be", fontFamily: "'DM Sans', sans-serif" }}>
          Voor mensen die meer voelen dan de meeste.
        </p>

        {/* Feature chips */}
        <div className="grid grid-cols-2 gap-3 w-full mb-6">
          {[
            { icon: Heart, label: "Empathie", desc: "Warm, direct & eerlijk", color: "#3b5bdb" },
            { icon: ShieldCheck, label: "Veiligheid", desc: "GDPR · Belgische servers", color: "#1e7a8c" },
            { icon: Star, label: "Altijd beschikbaar", desc: "24/7 · geen wachttijd", color: "#7c3aed" },
            { icon: Users, label: "Voor jou gemaakt", desc: "Aangepast aan jouw ritme", color: "#f97316" },
          ].map(({ icon: Icon, label, desc, color }) => (
            <div
              key={label}
              className="flex flex-col items-start gap-1.5 py-3.5 px-3.5 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.82)", boxShadow: "0 2px 10px rgba(100,140,220,0.09)" }}
            >
              <Icon className="w-4 h-4" style={{ color }} />
              <span className="text-sm font-semibold" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
              <span className="text-[11px]" style={{ color: "#8a96b0", fontFamily: "'DM Sans', sans-serif" }}>{desc}</span>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="w-full space-y-2 mb-7">
          {REVIEWS.map((r) => (
            <div
              key={r.name}
              className="rounded-2xl px-4 py-3 text-left"
              style={{ background: "rgba(255,255,255,0.75)", boxShadow: "0 1px 6px rgba(100,140,220,0.07)" }}
            >
              <p className="text-xs leading-relaxed mb-1" style={{ color: "#4a5a78", fontFamily: "'DM Sans', sans-serif" }}>
                "{r.text}"
              </p>
              <p className="text-[11px] font-semibold" style={{ color: "#9aa5be", fontFamily: "'DM Sans', sans-serif" }}>
                — {r.name}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleStart}
          className="w-full py-4 rounded-full text-base font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.97] mb-3"
          style={{
            background: "linear-gradient(135deg, #1e7a8c, #1a5f7a)",
            boxShadow: "0 6px 24px rgba(30,122,140,0.38)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Begin gratis — geen creditcard nodig
        </button>

        <p className="text-xs mb-2" style={{ color: "#9aa5be", fontFamily: "'DM Sans', sans-serif" }}>
          Al {Math.floor(Math.random() * 500 + 1800).toLocaleString("nl")} mensen gingen je voor
        </p>

        <p className="text-xs" style={{ color: "#b0bace", fontFamily: "'DM Sans', sans-serif" }}>
          Door verder te gaan ga je akkoord met onze{" "}
          <Link to="/privacy" style={{ color: "#5a7abf", textDecoration: "underline" }}>
            privacyvoorwaarden
          </Link>
          .
        </p>
      </div>

      {/* Bottom crisis */}
      <a
        href="tel:080032123"
        className="mt-8 text-xs px-4 py-2 rounded-full"
        style={{
          background: "rgba(220,60,60,0.07)",
          border: "1px solid rgba(220,60,60,0.14)",
          color: "rgba(180,50,50,0.68)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        In nood? Zelfmoordlijn 0800 32 123 (gratis, 24/7)
      </a>
    </div>
  );
}