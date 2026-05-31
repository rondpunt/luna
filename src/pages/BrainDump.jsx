import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUp, RotateCcw, Wind, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import PrivacyBadge from "@/components/ui/PrivacyBadge";
import { haptic } from "@/lib/haptics";

const SECTIONS = [
  { key: "todos",        label: "ACTIES",       color: "#F0925E" },
  { key: "feelings",     label: "GEVOELENS",    color: "#9B7FC4" },
  { key: "observations", label: "OBSERVATIES",  color: "#6A9AD9" },
  { key: "questions",    label: "OPEN VRAGEN",  color: "#F0C674" },
];

export default function BrainDump() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const [input, setInput] = useState("");
  const [dumps, setDumps] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }); }, [dumps]);

  const add = () => {
    const t = input.trim();
    if (!t) return;
    haptic.soft();
    setDumps((d) => [...d, t]);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
  };

  const structure = async () => {
    if (!dumps.length) return;
    haptic.medium();
    setProcessing(true);
    try {
      const raw = dumps.join("\n");
      const resp = await base44.functions.invoke("noraChat", {
        messages: [{ role: "user", content: raw }],
        style: "brain_dump_structure",
        memoryContext: "",
      });
      const parsed = resp?.data?.structured || JSON.parse(resp?.data?.reply || "{}");
      await base44.entities.BrainDump.create({ rawText: raw, aiStructured: JSON.stringify(parsed) }).catch(() => {});
      haptic.success();
      setResult(parsed);
    } catch {}
    setProcessing(false);
  };

  const reset = () => { setDumps([]); setResult(null); setInput(""); };

  return (
    <div className="flex flex-col" style={{ height: "100dvh", paddingTop: "env(safe-area-inset-top, 0px)", background: "var(--bg)" }}>
      <div className="fixed inset-0 -z-10" style={{ background: "#FFFBF7" }}>
        <div className="junie-blob" style={{ top: -80, right: -40, width: 240, height: 240, background: "#7BC096", opacity: 0.25 }} />
        <div className="junie-blob" style={{ bottom: 100, left: -60, width: 220, height: 220, background: "#F0C674", opacity: 0.22 }} />
      </div>

      {/* Header */}
      <header className="glass shrink-0 flex items-center px-4" style={{ height: 64, borderTop: "none", borderLeft: "none", borderRight: "none" }}>
        <button onClick={() => navigate("/home")} className="press" style={{ background: "none", border: "none", color: "var(--text-soft)", padding: 8 }} aria-label="Terug">
          <ArrowLeft size={20} strokeWidth={2} />
        </button>
        <div style={{ marginLeft: 6, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg, #7BC096, #5BAE7A)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(123, 192, 150, 0.32)" }}>
            <Wind size={16} style={{ color: "#FFFFFF" }} strokeWidth={2.4} />
          </div>
          <div>
            <p className="font-display-bold" style={{ fontSize: 18, color: "var(--text)", letterSpacing: "-0.01em", lineHeight: 1.05 }}>Brain Dump</p>
            <p style={{ fontSize: 11.5, color: "var(--text-muted)" }}>Gooi alles eruit.</p>
          </div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <PrivacyBadge />
        </div>
      </header>

      {/* Body */}
      {result ? (
        <ResultView result={result} onReset={reset} onChat={() => navigate("/chat")} />
      ) : (
        <>
          <div ref={listRef} className="flex-1 overflow-y-auto" style={{ padding: "24px 20px" }}>
            {dumps.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "12vh", textAlign: "center" }}>
                <div style={{ fontSize: 56, marginBottom: 18 }}>🌪️</div>
                <h2 className="font-display-bold" style={{ fontSize: 30, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 14 }}>
                  Stort het uit.<br/>
                  <span style={{
                    background: "linear-gradient(135deg, #7BC096, #6A9AD9)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>Geen volgorde.</span>
                </h2>
                <p style={{ fontSize: 14.5, color: "var(--text-soft)", lineHeight: 1.6, maxWidth: 280, margin: "0 auto" }}>
                  Typ wat in je opkomt. Druk op "Klaar" als alles eruit is — Junie structureert het voor je.
                </p>
              </motion.div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <AnimatePresence>
                  {dumps.map((d, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        padding: "14px 18px",
                        background: "linear-gradient(135deg, #7BC096, #5BAE7A)",
                        border: "none",
                        borderRadius: "22px 22px 6px 22px",
                        fontSize: 15,
                        color: "#FFFFFF",
                        lineHeight: 1.5,
                        alignSelf: "flex-end",
                        maxWidth: "88%",
                        boxShadow: "0 4px 14px rgba(123, 192, 150, 0.32)",
                      }}
                    >
                      {d}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Bottom actions */}
          <div style={{ padding: "12px 16px calc(12px + env(safe-area-inset-bottom, 0px))" }}>
            {dumps.length > 0 && !processing && (
              <button onClick={structure} className="btn btn-primary press" style={{ marginBottom: 12, fontSize: 15, height: 50 }}>
                Klaar — structureer dit ✨
              </button>
            )}
            {processing && (
              <div style={{ textAlign: "center", padding: "8px 0 14px", fontSize: 14, color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.16 }} style={{ width: 6, height: 6, borderRadius: "50%", background: "#7BC096" }} />
                ))}
                <span style={{ marginLeft: 8 }}>Even structureren…</span>
              </div>
            )}

            <div style={{
              display: "flex", alignItems: "flex-end", gap: 8,
              borderRadius: 28, padding: "8px 8px 8px 16px",
              background: "#FFFFFF",
              border: "1.5px solid var(--border-strong)",
              boxShadow: "0 4px 16px rgba(45,42,58,0.06)",
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); add(); } }}
                placeholder="Alles wat in je opkomt…"
                rows={1}
                disabled={processing}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 16, color: "var(--text)", lineHeight: 1.5, resize: "none", maxHeight: 120, overflowY: "auto", padding: "10px 0" }}
              />
              <button
                onClick={add}
                disabled={!input.trim() || processing}
                aria-label="Voeg toe"
                style={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  background: input.trim() ? "linear-gradient(135deg, #7BC096, #5BAE7A)" : "#F0E6D8",
                  border: "none", cursor: input.trim() ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                  boxShadow: input.trim() ? "0 4px 14px rgba(123, 192, 150, 0.42)" : "none",
                  marginBottom: 2,
                }}
              >
                <ArrowUp size={20} style={{ color: input.trim() ? "#FFFFFF" : "var(--text-muted)" }} strokeWidth={2.6} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ResultView({ result, onReset, onChat }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 overflow-y-auto"
      style={{ padding: "24px 20px 32px" }}
    >
      <p className="eyebrow" style={{ marginBottom: 8 }}>GESTRUCTUREERD</p>
      <h2 className="font-display-bold" style={{ fontSize: 28, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 22, lineHeight: 1.1 }}>
        Hier is wat <span style={{
          background: "linear-gradient(135deg, #7BC096, #6A9AD9)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>eruit kwam.</span>
      </h2>

      {SECTIONS.map(({ key, label, color }) => {
        const items = result[key];
        if (!items?.length) return null;
        return (
          <div key={key} style={{ marginBottom: 22 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color, textTransform: "uppercase", marginBottom: 12 }}>{label}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {items.map((item, i) => (
                <div key={i} style={{
                  padding: "14px 16px",
                  background: "#FFFFFF",
                  border: `1.5px solid ${color}38`,
                  borderLeft: `4px solid ${color}`,
                  borderRadius: 14,
                  fontSize: 14, color: "var(--text)", lineHeight: 1.55,
                  boxShadow: "0 2px 8px rgba(45,42,58,0.04)",
                }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <button onClick={onReset} className="btn btn-ghost press" style={{ flex: 1, height: 48, fontSize: 14 }}>
          <RotateCcw size={15} strokeWidth={2.2} />
          Opnieuw
        </button>
        <button onClick={onChat} className="btn btn-ghost-accent press" style={{ flex: 1, height: 48, fontSize: 14 }}>
          <MessageCircle size={15} strokeWidth={2.2} />
          Praat hierover
        </button>
      </div>
    </motion.div>
  );
}