import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUp, RotateCcw, Wind, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";

const SECTIONS = [
  { key: "todos",        label: "ACTIES",       color: "#D4AF89" },
  { key: "feelings",     label: "GEVOELENS",    color: "#B89572" },
  { key: "observations", label: "OBSERVATIES",  color: "#8A9482" },
  { key: "questions",    label: "OPEN VRAGEN",  color: "#9C7AAA" },
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
    setDumps((d) => [...d, t]);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
  };

  const structure = async () => {
    if (!dumps.length) return;
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
      setResult(parsed);
    } catch {}
    setProcessing(false);
  };

  const reset = () => { setDumps([]); setResult(null); setInput(""); };

  return (
    <div className="flex flex-col" style={{ height: "100dvh", paddingTop: "env(safe-area-inset-top, 0px)" }}>
      {/* Header */}
      <header className="glass shrink-0 flex items-center px-4" style={{ height: 64, borderTop: "none", borderLeft: "none", borderRight: "none" }}>
        <button onClick={() => navigate("/home")} className="press" style={{ background: "none", border: "none", color: "var(--text-muted)", padding: 8 }}>
          <ArrowLeft size={20} strokeWidth={1.5} />
        </button>
        <div style={{ marginLeft: 6, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(212,175,137,0.12)", border: "1px solid rgba(212,175,137,0.24)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Wind size={16} style={{ color: "#D4AF89" }} strokeWidth={1.8} />
          </div>
          <div>
            <p className="font-display" style={{ fontSize: 20, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>Brain Dump</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Gooi alles eruit.</p>
          </div>
        </div>
      </header>

      {/* Body */}
      {result ? (
        <ResultView result={result} onReset={reset} onChat={() => navigate("/chat")} />
      ) : (
        <>
          <div ref={listRef} className="flex-1 overflow-y-auto" style={{ padding: "24px 20px" }}>
            {dumps.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "16vh", textAlign: "center" }}>
                <p className="eyebrow" style={{ marginBottom: 18 }}>BRAIN DUMP</p>
                <h2 className="font-display" style={{ fontSize: 32, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 14 }}>
                  Stort het uit.<br/>
                  <span className="font-display-italic" style={{ color: "#D4AF89" }}>Geen volgorde.</span>
                </h2>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 280, margin: "0 auto" }}>
                  Typ wat in je opkomt. Druk op "Klaar" als alles eruit is.
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
                        background: "rgba(212,175,137,0.07)",
                        border: "1px solid rgba(212,175,137,0.16)",
                        borderRadius: 18,
                        fontSize: 15,
                        color: "var(--text)",
                        lineHeight: 1.5,
                        alignSelf: "flex-end",
                        maxWidth: "88%",
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
                Klaar — structureer dit
              </button>
            )}
            {processing && (
              <div style={{ textAlign: "center", padding: "8px 0 14px", fontSize: 14, color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.16 }} style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4AF89" }} />
                ))}
                <span style={{ marginLeft: 8 }}>Even structureren…</span>
              </div>
            )}

            <div className="glass" style={{ display: "flex", alignItems: "flex-end", gap: 10, borderRadius: 28, padding: "10px 10px 10px 18px", border: "1px solid rgba(242,237,228,0.12)" }}>
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
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 16, color: "var(--text)", lineHeight: 1.5, resize: "none", maxHeight: 120, overflowY: "auto", padding: "8px 0" }}
              />
              <button
                onClick={add}
                disabled={!input.trim() || processing}
                aria-label="Voeg toe"
                style={{
                  width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                  background: input.trim() ? "linear-gradient(135deg, #E8C9A3, #C29871)" : "rgba(242,237,228,0.06)",
                  border: "none", cursor: input.trim() ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                  boxShadow: input.trim() ? "0 4px 14px rgba(212,175,137,0.32)" : "none",
                }}
              >
                <ArrowUp size={20} style={{ color: input.trim() ? "#1A120A" : "var(--text-muted)" }} strokeWidth={2.5} />
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
      <h2 className="font-display" style={{ fontSize: 30, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 22, lineHeight: 1.1 }}>
        Hier is wat <span className="font-display-italic" style={{ color: "#D4AF89" }}>eruit kwam.</span>
      </h2>

      {SECTIONS.map(({ key, label, color }) => {
        const items = result[key];
        if (!items?.length) return null;
        return (
          <div key={key} style={{ marginBottom: 22 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", color, textTransform: "uppercase", marginBottom: 12 }}>{label}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {items.map((item, i) => (
                <div key={i} style={{
                  padding: "14px 16px",
                  background: `${color}0E`,
                  border: `1px solid ${color}24`,
                  borderRadius: 16,
                  fontSize: 14, color: "var(--text)", lineHeight: 1.55,
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
          <RotateCcw size={15} strokeWidth={1.8} />
          Opnieuw
        </button>
        <button onClick={onChat} className="btn btn-ghost-accent press" style={{ flex: 1, height: 48, fontSize: 14 }}>
          <MessageCircle size={15} strokeWidth={1.8} />
          Praat hierover
        </button>
      </div>
    </motion.div>
  );
}