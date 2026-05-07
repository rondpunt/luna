import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowUp, Trash2, Send } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Orb } from "@/components/luna/Orb";
import CrisisSheet from "@/components/luna/CrisisSheet";
import { useLunaPresence, PRESENCE } from "@/hooks/useLunaPresence";
import { format } from "date-fns";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { buildLunaUserState, formatLunaUserState } from "@/lib/lunaUserState";

const FREE_DAILY_LIMIT = 10;

const MODES = [
  { key: "normal",      label: "Gesprek",       desc: "Luna luistert en reageert." },
  { key: "body_double", label: "Body Double",    desc: "Luna is stil aanwezig terwijl je werkt." },
  { key: "brain_dump",  label: "Brain Dump",     desc: "Gooi alles eruit. Luna structureert daarna." },
];

function TypingIndicator() {
  return (
    <div className="bubble-luna" style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span key={i} className="typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
    </div>
  );
}

function PresenceDot({ color }) {
  return <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, transition: "background 0.4s" }} />;
}

// Brain dump structured result view
function BrainDumpResult({ data, onClose }) {
  const sections = [
    { key: "todos", label: "Acties", color: "#E8834A" },
    { key: "feelings", label: "Gevoelens", color: "#A46BA8" },
    { key: "observations", label: "Observaties", color: "#6B8FD4" },
    { key: "questions", label: "Open vragen", color: "#8A8278" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-5 py-6 overflow-y-auto flex-1"
    >
      <p className="eyebrow" style={{ marginBottom: 16 }}>BRAIN DUMP — GESTRUCTUREERD</p>
      {sections.map(({ key, label, color }) => {
        const items = data[key];
        if (!items?.length) return null;
        return (
          <div key={key} style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", color, textTransform: "uppercase", marginBottom: 8 }}>{label}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {items.map((item, i) => (
                <div key={i} style={{ padding: "10px 14px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 14, color: "var(--text)", lineHeight: 1.5 }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <button onClick={onClose} className="btn btn-ghost" style={{ fontSize: 14, marginTop: 8 }}>Nieuw gesprek</button>
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
  const [showCrisis, setShowCrisis] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const [mode, setMode] = useState("normal");
  const [brainDumpDone, setBrainDumpDone] = useState(false);
  const [brainDumpResult, setBrainDumpResult] = useState(null);
  const [processing, setProcessing] = useState(false);

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

  // Mode switch: send opening message
  useEffect(() => {
    if (!convId || messages.length > 0) return;
    if (mode === "body_double") {
      setMessages([{ role: "assistant", content: "Ik ben hier. Vertel waar je mee bezig bent — of niet. Ik laat je werken.", id: "bd-init" }]);
    } else if (mode === "brain_dump") {
      setMessages([{ role: "assistant", content: "Stort het uit. Geen volgorde, geen logica. Ik luister. Druk op 'Klaar' als je klaar bent.", id: "dump-init" }]);
    }
  }, [mode, convId]);

  useEffect(() => {
    return () => { if (input.trim()) sessionStorage.setItem("luna_draft", input); };
  }, [input]);

  const checkQuota = async () => {
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const todayMsgs = await base44.entities.Message.filter({ role: "user" });
      const todayCount = todayMsgs?.filter((m) => (m.created_date || "").split("T")[0] === today).length || 0;
      setMsgCount(todayCount);
      setLimitReached(todayCount >= FREE_DAILY_LIMIT);
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

  // Brain dump: process the full dump
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
      // Save to BrainDump entity
      await base44.entities.BrainDump.create({ rawText: dumpText, aiStructured: JSON.stringify(parsed) }).catch(() => {});
      setBrainDumpResult(parsed);
      setBrainDumpDone(true);
    } catch {}
    setProcessing(false);
  };

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || typing) return;
    if (limitReached && mode === "normal") return;
    // Brain dump: just accumulate, don't send to AI
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
      const assistantContent = resp?.data?.reply || "Luna kon net niet antwoorden. Probeer het nog eens.";
      const assistantMsg = { role: "assistant", content: assistantContent, id: Date.now() + 1 };
      setMessages((prev) => [...prev, assistantMsg]);
      onLunaReply();
      if (convId) {
        await base44.entities.Message.create({ conversation_id: convId, role: "assistant", content: assistantContent });
        await base44.entities.Conversation.update(convId, { last_message_at: new Date().toISOString(), message_count: messages.length + 2 });
      }
      setMsgCount((c) => c + 1);
      if (msgCount + 1 >= FREE_DAILY_LIMIT) setLimitReached(true);
    } catch (error) {
      console.error("Luna chat error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Luna kon net niet antwoorden. Probeer het nog eens.", id: Date.now() + 2 }]);
      onLunaReply();
    } finally {
      setTyping(false);
    }
  }, [input, typing, messages, convId, limitReached, msgCount, mode, onUserMessage, onLunaReply, user?.id]);

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
  const msgsLeft = FREE_DAILY_LIMIT - msgCount;

  return (
    <div className="flex flex-col" style={{ height: "100dvh", background: "#0B0B14", paddingTop: "env(safe-area-inset-top, 0px)" }}>
      {/* Ambient */}
      <div className="fixed inset-0 -z-10" style={{ background: "#0B0B14" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(232,131,74,0.06), transparent 60%)", opacity: 0.6 }} />
      </div>

      {/* Glass header */}
      <header className="glass shrink-0 flex items-center px-4" style={{ height: 64, borderTop: "none", borderLeft: "none", borderRight: "none" }}>
        <Orb size="sm" />
        <div style={{ marginLeft: 12 }}>
          <p className="font-display" style={{ fontSize: 22, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1 }}>Luna</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
            <PresenceDot color={statusColor} />
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{statusLabel || "altijd er"}</span>
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          {msgsLeft <= FREE_DAILY_LIMIT && msgsLeft > 0 && (
            <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{msgsLeft} berichten over</span>
          )}
          <button onClick={() => setShowCrisis(true)} style={{ fontSize: 13, fontWeight: 500, color: "#D14D4D", background: "none", border: "none", cursor: "pointer" }} aria-label="Hulp nu — crisis lijn">hulp</button>
          <button onClick={() => setShowClearConfirm(true)} aria-label="Gesprek wissen" style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Trash2 size={18} style={{ color: "var(--text-muted)" }} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Mode selector */}
      <div style={{ padding: "8px 16px", display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none" }}>
        {MODES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { if (key !== mode) { setMode(key); setMessages([]); setBrainDumpDone(false); setBrainDumpResult(null); } }}
            style={{ height: 30, padding: "0 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0, background: mode === key ? "rgba(232,131,74,0.10)" : "transparent", border: mode === key ? "1px solid rgba(232,131,74,0.28)" : "1px solid rgba(255,255,255,0.08)", color: mode === key ? "#E8834A" : "var(--text-muted)", cursor: "pointer", transition: "all 0.15s" }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Brain dump result */}
      {brainDumpDone && brainDumpResult ? (
        <BrainDumpResult data={brainDumpResult} onClose={() => { setBrainDumpDone(false); setBrainDumpResult(null); setMessages([]); }} />
      ) : (
        <>
          {/* Messages */}
          <div ref={containerRef} className="flex-1 overflow-y-auto" style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
            {isEmpty && mode === "normal" && (
              <div className="flex flex-col items-center fade-in" style={{ marginTop: 40 }}>
                <Orb size="md" />
                <div className="bubble-luna msg-enter" style={{ marginTop: 32, maxWidth: 320 }}>
                  Hé. Geen druk. Je hoeft het nog niet goed te zeggen. Wat zit er nu het meest op je?
                </div>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={msg.role === "user" ? "bubble-user msg-enter" : "bubble-luna msg-enter"}>
                {msg.role === "assistant" ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : msg.content}
              </div>
            ))}
            {typing && <TypingIndicator />}
            {limitReached && !typing && mode === "normal" && (
              <div className="fade-in" style={{ padding: "20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, textAlign: "center", marginTop: 8 }}>
                <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 16 }}>Je hebt vandaag al even gepraat. Morgen mag het weer. Of upgrade voor onbeperkt.</p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  <button className="btn-ghost-accent btn" style={{ height: 36, fontSize: 13, flex: 1 }} onClick={() => navigate("/pricing")}>Upgrade</button>
                  <button className="btn btn-ghost" style={{ height: 36, fontSize: 13, flex: 1 }} onClick={() => navigate("/")}>Misschien morgen</button>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          {(!limitReached || mode !== "normal") && (
            <div style={{ padding: "12px 12px", paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}>
              {/* Brain dump: show "Klaar" button when has content */}
              {mode === "brain_dump" && messages.filter(m => m.role === "user").length > 0 && !processing && (
                <button
                  onClick={processBrainDump}
                  className="btn btn-primary press"
                  style={{ marginBottom: 10, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                >
                  <Send size={14} strokeWidth={2} />
                  Klaar — structureer dit
                </button>
              )}
              {processing && (
                <div style={{ textAlign: "center", padding: "10px 0 8px", fontSize: 13, color: "var(--text-muted)" }}>
                  Even structureren…
                </div>
              )}
              <div className="glass" style={{ display: "flex", alignItems: "flex-end", gap: 8, borderRadius: 28, padding: "12px 16px" }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 96) + "px";
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder={mode === "brain_dump" ? "Alles wat in je opkomt…" : mode === "body_double" ? "Optioneel check-in…" : "Schrijf wat in je opkomt…"}
                  rows={1}
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 15, color: "var(--text)", lineHeight: 1.5, resize: "none", fontFamily: "'Geist', system-ui, sans-serif", maxHeight: 96, overflowY: "auto" }}
                />
                <button
                  onClick={send}
                  disabled={!input.trim() || typing}
                  aria-label="Verstuur"
                  style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, background: input.trim() && !typing ? "#E8834A" : "rgba(232,131,74,0.20)", border: "none", cursor: input.trim() && !typing ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}
                >
                  <ArrowUp size={18} style={{ color: "#1A0E08" }} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Crisis sheet */}
      {showCrisis && <CrisisSheet onClose={() => setShowCrisis(false)} />}

      {/* Clear confirm */}
      {showClearConfirm && (
        <>
          <div className="fixed inset-0 z-[60]" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }} onClick={() => setShowClearConfirm(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-[70] fade-up" style={{ background: "#14141E", borderRadius: "28px 28px 0 0", padding: "32px 24px calc(40px + env(safe-area-inset-bottom, 0px))", maxWidth: 480, margin: "0 auto" }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", margin: "0 auto 24px" }} />
            <h3 className="font-display" style={{ fontSize: 24, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.02em" }}>Dit gesprek wissen?</h3>
            <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 24 }}>Dit kan niet ongedaan gemaakt worden.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowClearConfirm(false)} className="btn btn-ghost press" style={{ flex: 1, fontSize: 14 }}>Annuleren</button>
              <button onClick={clearConversation} className="btn press" style={{ flex: 1, fontSize: 14, fontWeight: 500, background: "var(--crisis-soft)", border: "1px solid var(--crisis-border)", color: "#D14D4D", borderRadius: "var(--r-pill)" }}>Wissen</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}