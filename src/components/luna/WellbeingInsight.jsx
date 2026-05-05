import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, TrendingUp, TrendingDown, Minus, ArrowUpDown, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const TREND_CONFIG = {
  stijgend: { icon: TrendingUp, color: "#6BAD8A", label: "Stijgend", bg: "rgba(107,173,138,0.12)" },
  dalend: { icon: TrendingDown, color: "#D46B6B", label: "Dalend", bg: "rgba(212,107,107,0.12)" },
  stabiel: { icon: Minus, color: "#6B8FD4", label: "Stabiel", bg: "rgba(107,143,212,0.12)" },
  wisselend: { icon: ArrowUpDown, color: "#D4A86B", label: "Wisselend", bg: "rgba(212,168,107,0.12)" },
};

export default function WellbeingInsight({ messages = [], checkIns = [], isPro = false }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke("analyzeWellbeing", {
        messages: messages.slice(-40),
        checkIns: checkIns.slice(0, 30),
      });
      setAnalysis(res.data?.analysis || null);
      setHasLoaded(true);
    } catch {
      setAnalysis(null);
      setHasLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  const trend = analysis?.mood_trend ? TREND_CONFIG[analysis.mood_trend] : null;

  if (!isPro) {
    return (
      <div
        className="rounded-2xl p-5 relative overflow-hidden surface"
        style={{ border: "1px solid var(--border)" }}
      >
        <div style={{ filter: "blur(3px)", pointerEvents: "none", userSelect: "none", opacity: 0.45 }}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4" style={{ color: "#E8834A" }} strokeWidth={1.5} />
            <p className="eyebrow" style={{ marginBottom: 0 }}>AI-WELZIJNSANALYSE</p>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            De afgelopen weken zie ik patronen in hoe je je voelt en waar je energie naartoe gaat…
          </p>
        </div>

        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-3 px-5"
          style={{ backdropFilter: "blur(6px)", background: "rgba(11,11,20,0.82)" }}
        >
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: "rgba(232,131,74,0.12)", border: "1px solid rgba(232,131,74,0.25)" }}
          >
            <Lock className="w-5 h-5" style={{ color: "#E8834A" }} strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>
              Volledige analyse — Luna Plus
            </p>
            <p className="text-xs mb-3" style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>
              Patronen, triggers en een warme samenvatting op basis van je gesprekken en check-ins.
            </p>
            <Link
              to="/pricing"
              className="inline-block px-5 py-2.5 rounded-full text-xs font-semibold"
              style={{ background: "#E8834A", color: "#1A0E08" }}
            >
              Ontgrendelen
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden surface" style={{ border: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" style={{ color: "#E8834A" }} strokeWidth={1.5} />
          <p className="eyebrow" style={{ marginBottom: 0 }}>AI-WELZIJNSANALYSE</p>
        </div>
        {hasLoaded && (
          <button
            type="button"
            onClick={runAnalysis}
            disabled={loading}
            className="w-9 h-9 rounded-full flex items-center justify-center press haptic-press"
            style={{ background: "rgba(232,131,74,0.10)", border: "1px solid rgba(232,131,74,0.22)" }}
            aria-label="Opnieuw analyseren"
          >
            <RefreshCw className="w-4 h-4" style={{ color: "#E8834A", animation: loading ? "spin 1s linear infinite" : "none" }} />
          </button>
        )}
      </div>

      <div className="px-5 pb-5">
        <AnimatePresence mode="wait">
          {!hasLoaded && !loading && (
            <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-sm mb-4" style={{ color: "var(--text-muted)", lineHeight: 1.55 }}>
                Luna leest je recente chats en check-ins en geeft een eerlijk, warm beeld — geen diagnose.
              </p>
              <button
                type="button"
                onClick={runAnalysis}
                className="w-full py-3 rounded-full text-sm font-semibold press haptic-press"
                style={{ background: "#E8834A", color: "#1A0E08" }}
              >
                Analyseer mijn periode
              </button>
            </motion.div>
          )}

          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 py-6">
              <div
                className="w-10 h-10 rounded-full"
                style={{
                  background: "conic-gradient(#E8834A 0%, rgba(232,131,74,0.15) 60%)",
                  animation: "spin 1s linear infinite",
                  mask: "radial-gradient(farthest-side, transparent 65%, black 66%)",
                  WebkitMask: "radial-gradient(farthest-side, transparent 65%, black 66%)",
                }}
              />
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Even lezen…</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </motion.div>
          )}

          {hasLoaded && !loading && analysis && (
            <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
              className="space-y-4">

              {trend && (
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ background: trend.bg, border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <trend.icon className="w-3.5 h-3.5" style={{ color: trend.color }} />
                  <span className="text-xs font-semibold" style={{ color: trend.color }}>
                    Tendens: {trend.label}
                  </span>
                </div>
              )}

              <div>
                <p className="eyebrow-muted" style={{ marginBottom: 8 }}>HOE HET GING</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
                  {analysis.summary}
                </p>
              </div>

              {analysis.pattern && (
                <div className="rounded-xl p-3.5" style={{ background: "rgba(212,168,107,0.08)", border: "1px solid rgba(212,168,107,0.2)" }}>
                  <p className="eyebrow-muted" style={{ marginBottom: 8 }}>PATROON</p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                    {analysis.pattern}
                  </p>
                </div>
              )}

              <div className="rounded-xl p-3.5" style={{ background: "rgba(107,173,138,0.08)", border: "1px solid rgba(107,173,138,0.2)" }}>
                <p className="eyebrow-muted" style={{ marginBottom: 8 }}>WAT LUNA IN JOU ZIET</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                  {analysis.strength}
                </p>
              </div>

              <div className="rounded-xl p-3.5" style={{ background: "rgba(232,131,74,0.06)", border: "1px solid rgba(232,131,74,0.2)" }}>
                <p className="eyebrow-muted" style={{ marginBottom: 8 }}>OM OVER NA TE DENKEN</p>
                <p className="text-sm leading-relaxed italic" style={{ color: "var(--text-2)" }}>
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
