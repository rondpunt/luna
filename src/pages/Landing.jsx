import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LunaOrb from "../components/luna/LunaOrb";
import { MessageCircle, UserPlus } from "lucide-react";

export default function Landing() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between px-6 py-8"
      style={{ backgroundColor: "var(--luna-bg-base)" }}
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <span
          className="text-xl font-semibold"
          style={{ color: "var(--luna-text-primary)", letterSpacing: "-0.02em" }}
        >
          luna
        </span>
        <Link
          to="/chat"
          className="text-sm"
          style={{ color: "var(--luna-text-muted)" }}
        >
          Inloggen
        </Link>
      </div>

      {/* Center content */}
      <motion.div
        className="flex flex-col items-center text-center flex-1 justify-center gap-8 -mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <LunaOrb size={180} state="idle" className="md:w-[220px] md:h-[220px]" />

        <div className="space-y-4">
          <h1
            className="text-4xl md:text-5xl font-semibold"
            style={{
              color: "var(--luna-text-primary)",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            Praat. Word gehoord.
          </h1>
          <p
            className="text-base max-w-[280px] mx-auto leading-relaxed"
            style={{ color: "var(--luna-text-secondary)" }}
          >
            Een rustige plek om te zeggen wat zwaar voelt. Geen oordeel, geen druk.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-[320px]">
          <Link
            to="/chat"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-medium text-white transition-all active:scale-[0.97]"
            style={{
              backgroundColor: "var(--luna-accent)",
              boxShadow: "0 4px 24px rgba(159,134,255,0.45), 0 1px 0 rgba(255,255,255,0.15) inset",
            }}
          >
            <MessageCircle className="w-5 h-5" />
            Praat met Luna
          </Link>
          <Link
            to="/chat"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-medium transition-all active:scale-[0.97]"
            style={{
              color: "var(--luna-text-primary)",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <UserPlus className="w-5 h-5" />
            Maak account
          </Link>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="space-y-3 text-center pb-4">
        <p
          className="text-xs tracking-wide"
          style={{ color: "rgba(244,242,255,0.3)" }}
        >
          Anoniem · Belgisch · GDPR · EU-servers
        </p>
        <p className="text-xs" style={{ color: "rgba(244,242,255,0.35)" }}>
          In acute nood? Bel{" "}
          <a href="tel:112" className="underline">112</a> of{" "}
          <a href="tel:1813" className="underline">Zelfmoordlijn 1813</a>
        </p>
      </div>
    </div>
  );
}