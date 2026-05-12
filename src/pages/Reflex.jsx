import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Zap, Send, RotateCcw, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { buildLunaUserState, formatLunaUserState } from "@/lib/lunaUserState";

const SITUATION_CHIPS = [
  "Iemand zei iets kwetsends",
  "Kritiek op mijn werk",
  "Ik moet nee zeggen",
  "Ruzie met partner of vriend",
  "Buur of huisgenoot klaagt",
  "Iemand overschrijdt mijn grens",
  "Ik voel me genegeerd",
  "Ik wil iets vragen maar durf niet",
];

export default function Reflex() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [selectedChip, setSelectedChip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });

  const loadMemoryContext = async () => {
    const parts = [];
    try {
      const storedTags = JSON.parse(sessionStorage.getItem("luna_selected_tags") || "[]");
      if (storedTags.length) {
        parts.push(formatLunaUserState(buildLunaUserState(storedTags)));
      } else if (user?.id) {
        const rows = await base44.entities.UserSelectedTags.filter({ userId: user.id }, "-created_date", 1);
        if (rows?.[0]?.tags?.length) parts.push(formatLunaUserState(buildLunaUserState(rows[0].tags)));
      }
    } catch {}
    try {
      const memories = await base44.entities.Memory.list("-created_date", 15);
      if (memories?.length) parts.push(memories.map((m) => m.content || "").filter(Boolean).join("\n").slice(0, 1200));
    } catch {}
    return parts.filter(Boolean).join("\n");
  };

  const onChipTap = (chip) => {
    setSelectedChip(chip);
    setInput(chip);
  };

  const submit = async () => {
    const situation = input.trim();
    if (!situation || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const memoryContext = await loadMemoryContext();
      const resp = await base44.functions.invoke("noraChat", {
        messages: [{ role: "user", content: situation }],
        style: "reflex",
        memoryContext,
      });
      const raw = resp?.data?.structured || JSON.parse(resp?.data?.reply || "{}");
      const parsed = raw?.innerlijk && raw?.actie ? raw : (raw?.response?.innerlijk ? raw.response : null);
      if (parsed?.innerlijk && parsed?.actie) {
        setResult(parsed);
      } else {
        setError("Kon geen advies opstellen. Probeer iets specifieker te omschrijven.");
      }
    } catch (e) {
      setError("Iets ging mis. Probeer opnieuw.");
    }
    setLoading(false);
  };

  const reset = () => {
    setInput("");
    setSelectedChip(null);
    setResult(null);
    setError(null);
  };

  const openChatAbout = () => {
    sessionStorage.setItem("luna_draft", input);
    navigate("/chat");
  };

  return (
    <div className="fade-in" style={{ paddingTop: "calc(20px + env(safe-area-inset-top, 0px))", paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <button
          onClick={() => navigate("/home")}
          className="press"
          aria-label="Terug naar home"
          style={{ width: 40, height: 40, borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <ArrowLeft size={18} style={{ color: "var(--text-muted)" }} strokeWidth={1.8} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Zap size={14} style={{ color: "#D4AF89" }} strokeWidth={2} fill="#D4AF89" />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.01em" }}>Reflex</span>
        </div>
        <div style={{ width: 40 }} />
      </div>

      {/* Title — only when no result */}
      <AnimatePresence mode="wait">
        {!result && !loading && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: 28 }}
          >
            <p className="eyebrow" style={{ marginBottom: 8 }}>CONCRETE SITUATIE</p>
            <h1 className="font-display" style={{ fontSize: 30, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 10 }}>
              Wat speelt er nu?
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.5 }}>
              Kies een situatie of typ zelf. Je krijgt direct hoe je het kan zien en wat je kan zeggen.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chips */}
      {!result && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}
        >
          {SITUATION_CHIPS.map((chip) => {
            const active = selectedChip === chip;
            return (
              <button
                key={chip}
                onClick={() => onChipTap(chip)}
                className="press"
                style={{
                  padding: "10px 14px",
                  borderRadius: 999,
                  background: active ? "rgba(212,175,137,0.13)" : "rgba(242,237,228,0.035)",
                  border: active ? "1px solid rgba(212,175,137,0.32)" : "1px solid rgba(242,237,228,0.07)",
                  color: active ? "#D4AF89" : "var(--text-muted)",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "'Geist', system-ui, sans-serif",
                }}
              >
                {chip}
              </button>
            );
          })}
        </motion.div>
      )}

      {/* Input + submit */}
      {!result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); if (selectedChip && e.target.value !== selectedChip) setSelectedChip(null); }}
            placeholder="Beschrijf wat er gebeurde of waar je vastloopt…"
            rows={4}
            disabled={loading}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: "16px 18px",
              fontSize: 15,
              lineHeight: 1.5,
              color: "var(--text)",
              outline: "none",
              resize: "none",
              fontFamily: "'Geist', system-ui, sans-serif",
              marginBottom: 14,
            }}
          />
          <button
            onClick={submit}
            disabled={!input.trim() || loading}
            className="btn btn-primary press"
            style={{ height: 52, fontSize: 15, fontWeight: 500, opacity: !input.trim() || loading ? 0.5 : 1 }}
          >
            {loading ? "Even kijken…" : "Geef me advies"}
            {!loading && <Send size={15} strokeWidth={2} />}
          </button>
          {error && (
            <p style={{ marginTop: 14, fontSize: 13, color: "var(--crisis)", textAlign: "center" }}>{error}</p>
          )}
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 60, gap: 20 }}
        >
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ display: "flex", gap: 8 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.18 }}
                style={{ width: 10, height: 10, borderRadius: "50%", background: "#D4AF89" }}
              />
            ))}
          </motion.div>
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Even kijken…</p>
        </motion.div>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Echo of situation */}
            <div style={{
              padding: "14px 18px",
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 18,
              marginBottom: 18,
              fontSize: 14,
              color: "var(--text-muted)",
              lineHeight: 1.5,
              fontStyle: "italic",
            }}>
              "{input}"
            </div>

            {/* Result card */}
            <div style={{
              background: "linear-gradient(145deg, rgba(61,42,77,0.25), rgba(212,175,137,0.06))",
              border: "1px solid rgba(212,175,137,0.20)",
              borderRadius: 26,
              padding: "28px 24px",
              marginBottom: 18,
            }}>
              <div style={{ marginBottom: 22 }}>
                <p className="eyebrow" style={{ marginBottom: 10 }}>VAN BINNENUIT</p>
                <p style={{ fontSize: 16, color: "var(--text)", lineHeight: 1.6 }}>{result.innerlijk}</p>
              </div>
              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 22 }} />
              <div>
                <p className="eyebrow" style={{ marginBottom: 10 }}>WAT JE KAN DOEN</p>
                <p style={{ fontSize: 16, color: "var(--text)", lineHeight: 1.6 }}>{result.actie}</p>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={reset} className="btn btn-ghost press" style={{ flex: 1, height: 48, fontSize: 14, gap: 8 }}>
                <RotateCcw size={15} strokeWidth={1.8} />
                Andere
              </button>
              <button onClick={openChatAbout} className="btn btn-ghost-accent press" style={{ flex: 1, height: 48, fontSize: 14, gap: 8 }}>
                <MessageCircle size={15} strokeWidth={1.8} />
                Praat verder
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}