import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Heart, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

function LunaOrbLight({ size = 160 }) {
  return (
    <motion.div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 40% 35%, rgba(255,255,255,0.95) 0%, rgba(200,210,255,0.85) 30%, rgba(180,200,240,0.70) 55%, rgba(160,185,230,0.50) 75%, rgba(140,170,220,0.30) 100%)",
        boxShadow:
          "0 8px 40px rgba(100,140,220,0.25), 0 2px 12px rgba(180,200,255,0.20)",
        position: "relative",
      }}
      animate={{
        scale: [1, 1.025, 1],
      }}
      transition={{
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      {/* Inner glow shapes */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "18%",
          width: "55%",
          height: "55%",
          borderRadius: "60% 40% 55% 45% / 50% 60% 40% 55%",
          background:
            "radial-gradient(circle at 40% 40%, rgba(200,215,255,0.8) 0%, rgba(170,195,250,0.5) 50%, transparent 80%)",
          filter: "blur(6px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "30%",
          width: "40%",
          height: "40%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(230,220,255,0.7) 0%, rgba(200,210,255,0.4) 60%, transparent 90%)",
          filter: "blur(8px)",
        }}
      />
      {/* Reflection base */}
      <div
        style={{
          position: "absolute",
          bottom: -6,
          left: "20%",
          width: "60%",
          height: 10,
          background:
            "radial-gradient(ellipse, rgba(100,140,220,0.20) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(4px)",
        }}
      />
    </motion.div>
  );
}

export default function Landing() {
  const handleStart = () => base44.auth.redirectToLogin("/home");

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between px-6 py-10"
      style={{
        background: "linear-gradient(160deg, #e8f0fb 0%, #f0f4ff 40%, #e4eef9 100%)",
      }}
    >
      {/* Top spacer */}
      <div />

      {/* Center content */}
      <div className="flex flex-col items-center text-center w-full max-w-sm">
        {/* Orb */}
        <div className="mb-8">
          <LunaOrbLight size={160} />
        </div>

        {/* Headline */}
        <h1
          className="text-[28px] font-bold mb-3 leading-snug"
          style={{ color: "#1a2340", fontFamily: "'DM Sans', -apple-system, sans-serif" }}
        >
          Hoi, ik ben Luna.
        </h1>
        <p
          className="text-base mb-8 leading-relaxed"
          style={{ color: "#5a6a8a", fontFamily: "'DM Sans', sans-serif", maxWidth: 260 }}
        >
          Ik ben hier om naar je te luisteren en je te ondersteunen.
        </p>

        {/* Feature chips */}
        <div className="grid grid-cols-2 gap-3 w-full mb-10">
          <div
            className="flex flex-col items-center gap-2 py-4 px-3 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.80)",
              boxShadow: "0 2px 12px rgba(100,140,220,0.10)",
            }}
          >
            <Heart className="w-5 h-5" style={{ color: "#3b5bdb" }} />
            <span className="text-sm font-medium" style={{ color: "#2d3a5a", fontFamily: "'DM Sans', sans-serif" }}>
              Empathie
            </span>
          </div>
          <div
            className="flex flex-col items-center gap-2 py-4 px-3 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.80)",
              boxShadow: "0 2px 12px rgba(100,140,220,0.10)",
            }}
          >
            <ShieldCheck className="w-5 h-5" style={{ color: "#1e7a8c" }} />
            <span className="text-sm font-medium" style={{ color: "#2d3a5a", fontFamily: "'DM Sans', sans-serif" }}>
              Veiligheid
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleStart}
          className="w-full py-4 rounded-full text-base font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
          style={{
            background: "linear-gradient(135deg, #1e7a8c, #1a6678)",
            boxShadow: "0 4px 20px rgba(30,122,140,0.35)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Start <span style={{ fontSize: 18 }}>→</span>
        </button>

        <p
          className="text-xs mt-4"
          style={{ color: "#9aa5be", fontFamily: "'DM Sans', sans-serif" }}
        >
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
        className="text-xs px-4 py-2 rounded-full"
        style={{
          background: "rgba(220,60,60,0.07)",
          border: "1px solid rgba(220,60,60,0.15)",
          color: "rgba(180,50,50,0.70)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        In nood? Zelfmoordlijn 0800 32 123 (gratis, 24/7)
      </a>
    </div>
  );
}