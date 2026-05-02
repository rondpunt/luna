import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, TrendingUp, TrendingDown, Minus, ArrowUpDown, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const TREND_CONFIG = {
  stijgend: { icon: TrendingUp, color: "#22c55e", label: "Stijgend", bg: "#f0fdf4" },
  dalend: { icon: TrendingDown, color: "#ef4444", label: "Dalend", bg: "#fef2f2" },
  stabiel: { icon: Minus, color: "#3b82f6", label: "Stabiel", bg: "#eff6ff" },
  wisselend: { icon: ArrowUpDown, color: "#f59e0b", label: "Wisselend", bg: "#fffbeb" },
};

export default function WellbeingInsight({ messages = [], checkIns = [], isPro = false }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    const res = await base44.functions.invoke("analyzeWellbeing", {
      messages: messages.slice(-40),
      checkIns: checkIns.slice(0, 30),
    });
    setAnalysis(res.data?.analysis || null);
    setLoading(false);
    setHasLoaded(true);
  };

  const trend = analysis?.mood_trend ? TREND_CONFIG[analysis.mood_trend] : null;

  if (!isPro) {
    return (
      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: "rgba(255,255,255,0.90)", boxShadow: "0 2px 10px rgba(100,140,220,0.08)" }}
      >
        {/* Blurred preview */}
        <div style={{ filter: "blur(4px)", pointerEvents: "none", userSelect: "none" }}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4" style={{ color: "#5b7cf6" }} />
            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#b0bace", fontFamily: "'DM Sans', sans-serif" }}>
              AI Welzijnsanalyse
            </p>
          </div>
          <p className="text-sm leading-relaxed mb-2" style={{ color: "#4a5a78", fontFamily: "'DM Sans', sans-serif" }}>
            De afgelopen weken zie ik dat je veel bezig bent met werken en vermoeidheid. Er loopt een patroon door je gesprekken van...
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#4a5a78", fontFamily: "'DM Sans', sans-serif" }}>
            Wat me opvalt is dat je het moeilijkst hebt op momenten wanneer...
          </p>
        </div>

        {/* Lock overlay */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-3"
          style={{ backdropFilter: "blur(2px)", background: "rgba(240,244,255,0.82)" }}
        >
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: "rgba(91,124,246,0.12)" }}
          >
            <Lock className="w-5 h-5" style={{ color: "#5b7cf6" }} />
          </div>
          <div className="text-center px-6">
            <p className="text-sm font-bold mb-1" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>
              AI Welzijnsanalyse
            </p>
            <p className="text-xs mb-3" style={{ color: "#6b7a99", fontFamily: "'DM Sans', sans-serif" }}>
              Luna Pro analyseert je gesprekken en stemming om patronen en triggers te vinden — in menselijke taal.
            </p>
            <Link
              to="/prijzen"
              className="inline-block px-5 py-2.5 rounded-full text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, #5b7cf6, #3b5bdb)", boxShadow: "0 4px 14px rgba(91,124,246,0.30)", fontFamily: "'DM Sans', sans-serif" }}
            >
              Ontgrendelen · €4,99/mnd
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.90)", boxShadow: "0 2px 10px rgba(100,140,220,0.08)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" style={{ color: "#5b7cf6" }} />
          <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#b0bace", fontFamily: "'DM Sans', sans-serif" }}>
            AI Welzijnsanalyse
          </p>
        </div>
        {hasLoaded && (
          <button
            onClick={runAnalysis}
            disabled={loading}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ background: "#eef2ff" }}
          >
            <RefreshCw className="w-3.5 h-3.5" style={{ color: "#5b7cf6", animation: loading ? "spin 1s linear infinite" : "none" }} />
          </button>
        )}
      </div>

      <div className="px-5 pb-5">
        <AnimatePresence mode="wait">
          {!hasLoaded && !loading && (
            <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-sm mb-4" style={{ color: "#6b7a99", fontFamily: "'DM Sans', sans-serif" }}>
                Luna bekijkt je gesprekken en check-ins en geeft je een eerlijk, warm beeld van hoe het de afgelopen periode echt ging.
              </p>
              <button
                onClick={runAnalysis}
                className="w-full py-3 rounded-full text-sm font-bold text-white transition-all active:scale-[0.97]"
                style={{
                  background: "linear-gradient(135deg, #5b7cf6, #3b5bdb)",
                  boxShadow: "0 4px 16px rgba(91,124,246,0.28)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Analyseer mijn maand
              </button>
            </motion.div>
          )}

          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 py-6">
              <div
                className="w-10 h-10 rounded-full"
                style={{
                  background: "conic-gradient(#5b7cf6 0%, #eef2ff 60%)",
                  animation: "spin 1s linear infinite",
                  mask: "radial-gradient(farthest-side, transparent 65%, black 66%)",
                  WebkitMask: "radial-gradient(farthest-side, transparent 65%, black 66%)",
                }}
              />
              <p className="text-sm" style={{ color: "#8a96b0", fontFamily: "'DM Sans', sans-serif" }}>
                Luna leest je gesprekken...
              </p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </motion.div>
          )}

          {hasLoaded && !loading && analysis && (
            <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
              className="space-y-4">

              {/* Trend badge */}
              {trend && (
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ background: trend.bg }}
                >
                  <trend.icon className="w-3.5 h-3.5" style={{ color: trend.color }} />
                  <span className="text-xs font-semibold" style={{ color: trend.color, fontFamily: "'DM Sans', sans-serif" }}>
                    Tendens: {trend.label}
                  </span>
                </div>
              )}

              {/* Summary */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#c0cce0", fontFamily: "'DM Sans', sans-serif" }}>
                  Hoe het ging
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#2d3a5a", fontFamily: "'DM Sans', sans-serif" }}>
                  {analysis.summary}
                </p>
              </div>

              {/* Pattern */}
              {analysis.pattern && (
                <div
                  className="rounded-xl p-3.5"
                  style={{ background: "#fef9e7", border: "1px solid rgba(245,158,11,0.15)" }}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#d97706", fontFamily: "'DM Sans', sans-serif" }}>
                    Patroon dat Luna ziet
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "#78350f", fontFamily: "'DM Sans', sans-serif" }}>
                    {analysis.pattern}
                  </p>
                </div>
              )}

              {/* Strength */}
              <div
                className="rounded-xl p-3.5"
                style={{ background: "#f0fdf4", border: "1px solid rgba(34,197,94,0.15)" }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#16a34a", fontFamily: "'DM Sans', sans-serif" }}>
                  Wat Luna in jou ziet
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#14532d", fontFamily: "'DM Sans', sans-serif" }}>
                  {analysis.strength}
                </p>
              </div>

              {/* Invitation */}
              <div
                className="rounded-xl p-3.5"
                style={{ background: "#eef2ff", border: "1px solid rgba(91,124,246,0.15)" }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#5b7cf6", fontFamily: "'DM Sans', sans-serif" }}>
                  Om over na te denken
                </p>
                <p className="text-sm leading-relaxed italic" style={{ color: "#1e3a8a", fontFamily: "'DM Sans', sans-serif" }}>
                  {analysis.invitation}
                </p>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}