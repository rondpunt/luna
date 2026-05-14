import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowUp, Trash2, Send, HelpCircle, ArrowLeft, Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import BodyDoubleFocus from "@/components/luna/BodyDoubleFocus";
import { useLunaPresence } from "@/hooks/useLunaPresence";
import { useFeatureVisibility } from "@/hooks/useFeatureVisibility";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { buildLunaUserState, formatLunaUserState } from "@/lib/lunaUserState";
import PrivacyBadge from "@/components/ui/PrivacyBadge";
import ToolsMenuSheet from "@/components/ui/ToolsMenuSheet";
import { haptic } from "@/lib/haptics";

const FREE_MESSAGE_LIMIT = 10;
const MIN_USAGE_DAYS_BEFORE_PAYWALL = 5;

const MODES = [
  { key: "normal",      label: "Gesprek",       desc: "Open chat — luisteren en reageren." },
  { key: "body_double", label: "Body Double",    desc: "Een aparte focusruimte: stille aanwezigheid zonder de chat te vullen." },
  { key: "brain_dump",  label: "Brain Dump",     desc: "Gooi alles eruit. Daarna gestructureerd." },
];

function TypingIndicator() {
  return (
    <div className="bubble-luna" style={{ display: "flex", gap: 4, alignItems: "center", padding: "14px 18px" }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--text-muted)" }}
        />
      ))}
    </div>
  );
}

function PresenceDot({ color }) {
  return <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, transition: "background 0.4s", boxShadow: `0 0 8px ${color}` }} />;
}

function BrainDumpResult({ data, onClose }) {
  const sections = [
    { key: "todos", label: "Acties", color: "#E8834A" },
    { key: "feelings", label: "Gevoelens", color: "#A46BA8" },
    { key: "observations", label: "Observaties", color: "#6B8FD4" },
    { key: "questions", label: "Open vragen", color: "#D4A86B" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      className="px-5 py-6 overflow-y-auto flex-1"
    >
      <p className="eyebrow" style={{ marginBottom: 20 }}>BRAIN DUMP — GESTRUCTUREERD</p>
      {sections.map(({ key, label, color }) => {
        const items = data[key];
        if (!items?.length) return null;
        return (
          <div key={key} style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", color, textTransform: "uppercase", marginBottom: 10 }}>{label}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {items.map((item, i) => (
                <div key={i} style={{ padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, fontSize: 14, color: "var(--text)", lineHeight: 1.5 }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <button onClick={onClose} className="btn btn-ghost press" style={{ fontSize: 14, marginTop: 12 }}>Nieuw gesprek</button>
    </motion.div>
  );
}

export default function Chat() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const qc = useQueryClient();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [convId, setConvId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { showPremium } = useFeatureVisibility();
  const [messageCount, setMessageCount] = useState(0);
  const [usageDays, setUsageDays] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const [mode, setMode] = useState("normal");
  const [showBodyDoubleInfo, setShowBodyDoubleInfo] = useState(false);
  const [brainDumpDone, setBrainDumpDone] = useState(false);
  const [brainDumpResult, setBrainDumpResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showTools, setShowTools] = useState(false);

  const { statusLabel, statusColor, initPresence, onUserMessage, onLunaReply } = useLunaPresence();
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    initPresence();
    const init = async () => {
      const draft = sessionStorage.getItem("luna_draft");
      if (draft) { setInput(draft); sessionStorage.removeItem("luna_draft"); }
      const paramConv = params.get("conv");
      let cid = paramConv;
      if (paramConv) {
        const msgs = await base44.entities.Message.filter({ conversation_id: paramConv });
        const sorted = msgs.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
        setMessages(sorted.map((m) => ({ role: m.role, content: m.content, id: m.id })));
      } else {
        const me = await base44.auth.me();
        const conv = await base44.entities.Conversation.create({ userId: me?.id || "", title: "", mode: "normal" });
        cid = conv.id;
      }
      setConvId(cid);
      await checkQuota();
    };
    init().catch(() => {});
  }, []);

  useEffect(() => {
    if (!convId || messages.length > 0) return;
    if (mode === "body_double") {
      setMessages([{ role: "assistant", content: "Ik ben hier. Vertel waar je mee bezig bent — of niet. Ik laat je werken.", id: "bd-init" }]);
    } else if (mode === "brain_dump") {
      setMessages([{ role: "assistant", content: "Stort het uit. Geen volgorde, geen logica. Druk op 'Klaar' als je klaar bent.", id: "dump-init" }]);
    }
  }, [mode, convId]);

  useEffect(() => {
    return () => { if (input.trim()) sessionStorage.setItem("luna_draft", input); };
  }, [input]);

  const checkQuota = async () => {
    try {
      const userMsgs = await base44.entities.Message.filter({ role: "user" });
      const total = userMsgs?.length || 0;
      const distinctDays = new Set((userMsgs || []).map((m) => (m.created_date || "").split("T")[0]).filter(Boolean)).size;
      setMessageCount(total);
      setUsageDays(distinctDays);
      setLimitReached(total >= FREE_MESSAGE_LIMIT && distinctDays >= MIN_USAGE_DAYS_BEFORE_PAYWALL);
    } catch {}
  };

  const loadMemoryContext = async () => {
    const contextParts = [];
    try {
      const storedTags = JSON.parse(sessionStorage.getItem("luna_selected_tags") || "[]");
      if (storedTags.length) {
        contextParts.push(formatLunaUserState(buildLunaUserState(storedTags)));
      } else if (user?.id) {
        const rows = await base44.entities.UserSelectedTags.filter({ userId: user.id }, "-created_date", 1);
        if (rows?.[0]?.tags?.length) {
          contextParts.push(formatLunaUserState(buildLunaUserState(rows[0].tags)));
        }
      }
    } catch {}
    try {
      const memories = await base44.entities.Memory.list("-created_date", 20);
      if (memories?.length) contextParts.push(memories.map((m) => m.content || "").filter(Boolean).join("\n").slice(0, 1500));
    } catch {}
    return contextParts.filter(Boolean).join("\n");
  };

  const processBrainDump = async () => {
    const dumpText = messages.filter(m => m.role === "user").map(m => m.content).join("\n");
    if (!dumpText.trim()) return;
    setProcessing(true);
    try {
      const resp = await base44.functions.invoke("noraChat", {
        messages: [{ role: "user", content: dumpText }],
        style: "brain_dump_structure",
        memoryContext: "",
      });
      const parsed = resp?.data?.structured || JSON.parse(resp?.data?.reply || "{}");
      await base44.entities.BrainDump.create({ rawText: dumpText, aiStructured: JSON.stringify(parsed) }).catch(() => {});
      setBrainDumpResult(parsed);
      setBrainDumpDone(true);
    } catch {}
    setProcessing(false);
  };

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || typing) return;
    if (limitReached && mode === "normal" && showPremium) return;
    if (mode === "brain_dump") {
      setInput("");
      if (inputRef.current) inputRef.current.style.height = "auto";
      setMessages(prev => [...prev, { role: "user", content: text, id: Date.now() }]);
      return;
    }
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    const userMsg = { role: "user", content: text, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);
    onUserMessage(text.length);
    try {
      if (convId) {
        await base44.entities.Message.create({ conversation_id: convId, role: "user", content: text });
        if (messages.length === 0) {
          await base44.entities.Conversation.update(convId, { title: text.slice(0, 60), last_message_at: new Date().toISOString() });
        }
      }
      const history = [...messages, userMsg].slice(-12).map(m => ({ role: m.role, content: m.content }));
      const memoryContext = await loadMemoryContext();
      const resp = await base44.functions.invoke("noraChat", {
        messages: history,
        style: mode === "body_double" ? "body_double" : "gentle",
        memoryContext,
      });
      const assistantContent = resp?.data?.reply || "Even niet gelukt om te antwoorden. Probeer het nog eens.";
      const assistantMsg = { role: "assistant", content: assistantContent, id: Date.now() + 1 };
      setMessages((prev) => [...prev, assistantMsg]);
      onLunaReply();
      if (convId) {
        await base44.entities.Message.create({ conversation_id: convId, role: "assistant", content: assistantContent });
        await base44.entities.Conversation.update(convId, { last_message_at: new Date().toISOString(), message_count: messages.length + 2 });
      }
      const nextCount = messageCount + 1;
      const today = format(new Date(), "yyyy-MM-dd");
      const nextUsageDays = Math.max(usageDays, new Set([...messages.filter((m) => m.role === "user").map((m) => m.created_date?.split?.("T")?.[0]).filter(Boolean), today]).size || usageDays || 1);
      setMessageCount(nextCount);
      setUsageDays(nextUsageDays);
      if (nextCount >= FREE_MESSAGE_LIMIT && nextUsageDays >= MIN_USAGE_DAYS_BEFORE_PAYWALL) setLimitReached(true);
    } catch (error) {
      console.error("chat error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Even niet gelukt om te antwoorden. Probeer het nog eens.", id: Date.now() + 2 }]);
      onLunaReply();
    } finally {
      setTyping(false);
    }
  }, [input, typing, messages, convId, limitReached, messageCount, usageDays, mode, onUserMessage, onLunaReply, user?.id]);

  const clearConversation = async () => {
    setMessages([]);
    setBrainDumpDone(false);
    setBrainDumpResult(null);
    setShowClearConfirm(false);
    if (convId) {
      try {
        const msgs = await base44.entities.Message.filter({ conversation_id: convId });
        await Promise.all(msgs.map((m) => base44.entities.Message.delete(m.id)));
        await base44.entities.Conversation.update(convId, { title: "", message_count: 0 });
      } catch {}
    }
  };

  const isEmpty = messages.length === 0 && !typing;

  if (mode === "body_double") {
    return <BodyDoubleFocus onBack={() => { setMode("normal"); setShowBodyDoubleInfo(false); }} />;
  }

  return (
    <div className="flex flex-col" style={{ height: "100dvh", background: "var(--bg)", paddingTop: "env(safe-area-inset-top, 0px)" }}>
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10" style={{ background: "#080810" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 0%, rgba(232,131,74,0.06), transparent 60%)" }} />
      </div>

      {/* Header */}
      <header className="glass shrink-0 flex items-center px-4" style={{ height: 68, borderTop: "none", borderLeft: "none", borderRight: "none", zIndex: 10 }}>
        <button onClick={() => navigate("/home")} className="press" style={{ background: "none", border: "none", color: "var(--text-muted)", marginRight: 8, padding: 8 }}>
          <ArrowLeft size={20} strokeWidth={1.5} />
        </button>
        <div style={{ marginLeft: 4 }}>
          <p className="font-display" style={{ fontSize: 22, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>Nieuw gesprek</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <PresenceDot color={statusColor} />
              <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{statusLabel || "Aanwezig"}</span>
            </div>
            <PrivacyBadge />
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setShowClearConfirm(true)} className="press" aria-label="Gesprek wissen" style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(242,237,228,0.04)", border: "1px solid rgba(242,237,228,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Trash2 size={16} style={{ color: "var(--text-muted)" }} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Modes */}
      <div style={{ padding: "10px 16px 4px", display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
        {MODES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { if (key !== mode) { setMode(key); setShowBodyDoubleInfo(false); setMessages([]); setBrainDumpDone(false); setBrainDumpResult(null); } }}
            style={{
              height: 34, padding: "0 16px", borderRadius: 17, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0,
              background: mode === key ? "rgba(212,175,137,0.13)" : "rgba(242,237,228,0.03)",
              border: mode === key ? "1px solid rgba(212,175,137,0.32)" : "1px solid rgba(242,237,228,0.06)",
              color: mode === key ? "#D4AF89" : "var(--text-muted)", cursor: "pointer", transition: "all 0.15s",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            {label}
            {key === "body_double" && (
              <span onClick={(e) => { e.stopPropagation(); setShowBodyDoubleInfo(!showBodyDoubleInfo); }} style={{ display: "inline-flex", alignItems: "center" }}>
                <HelpCircle size={14} strokeWidth={1.8} />
              </span>
            )}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {showBodyDoubleInfo && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
            <div style={{ margin: "4px 16px 8px", padding: "14px 16px", borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", color: "var(--text-muted)", fontSize: 13, lineHeight: 1.5 }}>
              Body Double betekent: 66 blijft rustig naast je terwijl jij iets doet. Geen zwaar gesprek, alleen korte steun of één volgende stap als je vastloopt.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {brainDumpDone && brainDumpResult ? (
        <BrainDumpResult data={brainDumpResult} onClose={() => { setBrainDumpDone(false); setBrainDumpResult(null); setMessages([]); }} />
      ) : (
        <>
          <div ref={containerRef} className="flex-1 overflow-y-auto" style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
            {isEmpty && mode === "normal" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center" style={{ marginTop: "20vh" }}>
                <p className="eyebrow" style={{ color: "#D4AF89", marginBottom: 18 }}>66</p>
                <div className="font-display" style={{ fontSize: 38, color: "var(--text)", letterSpacing: "-0.025em", lineHeight: 1.1, textAlign: "center", maxWidth: 340 }}>
                  Wat zit er nu<br/>
                  <span className="font-display-italic" style={{ color: "#D4AF89" }}>op je?</span>
                </div>
                <div style={{ marginTop: 18, maxWidth: 280, textAlign: "center", fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>
                  Geen druk. Schrijf wat in je opkomt.
                </div>
              </motion.div>
            )}
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={msg.role === "user" ? "bubble-user" : "bubble-luna"}
              >
                {msg.role === "assistant" ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
              </motion.div>
            ))}
            {typing && <TypingIndicator />}
            {limitReached && !typing && mode === "normal" && showPremium && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "24px", background: "linear-gradient(145deg, rgba(61,42,77,0.30), rgba(212,175,137,0.04))", border: "1px solid rgba(212,175,137,0.22)", borderRadius: 24, textAlign: "center" }}>
                <p style={{ fontSize: 15, color: "var(--text)", marginBottom: 16 }}>Je hebt je dagelijkse berichtenlimiet bereikt. Upgrade om onbeperkt door te praten.</p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  <button className="btn btn-primary press" style={{ height: 44, fontSize: 14, flex: 1 }} onClick={() => navigate("/pricing")}>Bekijk opties</button>
                  <button className="btn btn-ghost press" style={{ height: 44, fontSize: 14, flex: 1 }} onClick={() => navigate("/home")}>Misschien later</button>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {(!limitReached || mode !== "normal" || !showPremium) && (
            <div style={{ padding: "12px 16px", paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}>
              {mode === "brain_dump" && messages.filter(m => m.role === "user").length > 0 && !processing && (
                <button onClick={processBrainDump} className="btn btn-primary press" style={{ marginBottom: 12, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 48 }}>
                  <Send size={16} strokeWidth={2} /> Klaar — structureer dit
                </button>
              )}
              {processing && <div style={{ textAlign: "center", padding: "10px 0 12px", fontSize: 14, color: "var(--text-muted)" }}>Even structureren…</div>}
              
              <div className="glass" style={{ display: "flex", alignItems: "flex-end", gap: 8, borderRadius: 28, padding: "10px 10px 10px 12px", border: "1px solid rgba(255,255,255,0.12)" }}>
                <button
                  onClick={() => { haptic.soft(); setShowTools(true); }}
                  aria-label="Tools openen"
                  style={{
                    width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                    background: "rgba(212,175,137,0.10)",
                    border: "1px solid rgba(212,175,137,0.22)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", marginBottom: 3,
                  }}
                >
                  <Plus size={17} style={{ color: "#D4AF89" }} strokeWidth={2} />
                </button>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder={mode === "brain_dump" ? "Alles wat in je opkomt…" : mode === "body_double" ? "Optioneel bericht…" : "Schrijf iets..."}
                  rows={1}
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 16, color: "var(--text)", lineHeight: 1.5, resize: "none", fontFamily: "'Geist', system-ui, sans-serif", maxHeight: 120, overflowY: "auto", padding: "8px 0" }}
                />
                <button
                  onClick={() => { haptic.medium(); send(); }}
                  disabled={!input.trim() || typing}
                  aria-label="Verstuur"
                  style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, background: input.trim() && !typing ? "linear-gradient(135deg, #F09050, #D2682E)" : "rgba(255,255,255,0.06)", border: "none", cursor: input.trim() && !typing ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", boxShadow: input.trim() && !typing ? "0 4px 12px rgba(232,131,74,0.3)" : "none" }}
                >
                  <ArrowUp size={20} style={{ color: input.trim() && !typing ? "#1A0E08" : "var(--text-muted)" }} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <ToolsMenuSheet open={showTools} onClose={() => setShowTools(false)} />

      <AnimatePresence>
        {showClearConfirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60]" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)" }} onClick={() => setShowClearConfirm(false)} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed bottom-0 left-0 right-0 z-[70]" style={{ background: "#0F0F1A", borderRadius: "32px 32px 0 0", padding: "32px 24px calc(40px + env(safe-area-inset-bottom, 0px))", maxWidth: 480, margin: "0 auto", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", margin: "0 auto 24px" }} />
              <h3 className="font-display" style={{ fontSize: 28, color: "var(--text)", marginBottom: 12, letterSpacing: "-0.02em" }}>Gesprek wissen?</h3>
              <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 28, lineHeight: 1.5 }}>Dit kan niet ongedaan gemaakt worden. Dit gesprek wordt leeggemaakt.</p>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setShowClearConfirm(false)} className="btn btn-ghost press" style={{ flex: 1, fontSize: 15, height: 50 }}>Annuleren</button>
                <button onClick={clearConversation} className="btn btn-ghost-crisis press" style={{ flex: 1, fontSize: 15, height: 50 }}>Wissen</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}