import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowUp, Trash2, Send, Mic, Copy, Check } from "lucide-react";
import { base44, invokeNoraChat } from "@/api/base44Client";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { buildLunaPreferenceMemoryHint } from "@/lib/lunaPreferenceHints";
import { fetchUserPreferencesRow, USER_PREFERENCES_QUERY_KEY } from "@/hooks/useChatSettings";
import { Orb } from "@/components/luna/Orb";
import { logCrisisContextSilently } from "@/lib/logCrisisContext";
import { useLunaPresence } from "@/hooks/useLunaPresence";
import { motion, useReducedMotion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import ChatErrorBanner from "@/components/chat/ChatErrorBanner";
import { usePremium } from "@/hooks/usePremium";
import { useConversationQuota, FREE_DAILY_MESSAGE_LIMIT } from "@/hooks/useConversationQuota";
import { useClipboard } from "@/hooks/useClipboard";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

/**
 * Luna-chat gaat via `noraChat` met o.a. `style` (gentle | body_double | brain_dump_structure) en `memoryContext`.
 * Persoonlijke voorkeuren worden niet als apart API-veld meegestuurd; we vullen `memoryContext` compact aan (zelfde contract).
 */

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

function MessageBubble({ msg, onCopy, copiedId }) {
  const isAssistant = msg.role === "assistant";
  return (
    <div className={msg.role === "user" ? "bubble-user" : "bubble-luna"} style={{ position: "relative" }}>
      {isAssistant ? (
        <ReactMarkdown>{msg.content}</ReactMarkdown>
      ) : msg.content}
      {isAssistant && msg.content && (
        <button
          type="button"
          className="haptic-press"
          aria-label="Bericht kopiëren"
          onClick={() => onCopy(msg.content, msg.id)}
          style={{
            marginTop: 8,
            fontSize: 11,
            padding: "4px 8px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text-muted)",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}
          {copiedId === msg.id ? "Gekopieerd" : "Kopieer"}
        </button>
      )}
    </div>
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
  const [mode, setMode] = useState("normal");
  const [brainDumpDone, setBrainDumpDone] = useState(false);
  const [brainDumpResult, setBrainDumpResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [chatError, setChatError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [brainDumpError, setBrainDumpError] = useState(null);
  const reduceMotion = useReducedMotion();

  const { isPlus } = usePremium();
  const { limitReached, msgsLeft, refresh: refreshQuota } = useConversationQuota(isPlus);
  const { copy } = useClipboard();
  useDocumentTitle("Chat");

  const { data: prefsRow } = useQuery({
    queryKey: USER_PREFERENCES_QUERY_KEY,
    queryFn: fetchUserPreferencesRow,
    staleTime: 120_000,
  });
  const preferenceHint = useMemo(() => buildLunaPreferenceMemoryHint(prefsRow), [prefsRow]);

  const { statusLabel, statusColor, initPresence, onUserMessage, onLunaReply } = useLunaPresence();

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
        const sorted = msgs.sort((a, b) => Date.parse(String(a.created_date)) - Date.parse(String(b.created_date)));
        setMessages(sorted.map((m) => ({ role: m.role, content: m.content, id: m.id })));
      } else {
        const me = await base44.auth.me();
        const conv = await base44.entities.Conversation.create({ userId: me?.id || "", title: "", mode: "normal" });
        cid = conv.id;
      }
      setConvId(cid);
      refreshQuota();
    };
    init().catch(() => {});
  }, [params, refreshQuota]);

  // Mode switch: send opening message
  useEffect(() => {
    if (!convId || messages.length > 0) return;
    if (mode === "body_double") {
      setMessages([{ role: "assistant", content: "Ik ben hier. Vertel waar je mee bezig bent — of niet. Ik laat je werken.", id: "bd-init" }]);
    } else if (mode === "brain_dump") {
      setMessages([{ role: "assistant", content: "Stort het uit. Geen volgorde, geen logica. Ik luister. Druk op 'Klaar' als je klaar bent.", id: "dump-init" }]);
    }
  }, [mode, convId, messages.length]);

  useEffect(() => {
    return () => { if (input.trim()) sessionStorage.setItem("luna_draft", input); };
  }, [input]);

  const loadMemoryContext = useCallback(async () => {
    const maxChars = isPlus ? 3200 : 1500;
    const hint = preferenceHint || "";
    const budget = Math.max(0, maxChars - hint.length - 4);
    try {
      const memories = await base44.entities.Memory.list("-created_date", 20);
      const joined = (memories || []).map((m) => m.content || "").filter(Boolean).join("\n");
      const body = joined.slice(0, budget);
      return [hint, body].filter(Boolean).join("\n\n");
    } catch {
      return hint.slice(0, maxChars);
    }
  }, [isPlus, preferenceHint]);

  const processBrainDump = async () => {
    const dumpText = messages.filter(m => m.role === "user").map(m => m.content).join("\n");
    if (!dumpText.trim()) return;
    setProcessing(true);
    setBrainDumpError(null);
    try {
      const resp = await invokeNoraChat({
        messages: [{ role: "user", content: dumpText }],
        style: "brain_dump_structure",
        memoryContext: "",
        premium: isPlus,
      });
      const raw = resp?.reply || resp?.content || "{}";
      let parsed;
      try { parsed = JSON.parse(raw.replace(/```json\n?/g,"").replace(/```/g,"")); }
      catch { parsed = { todos: [], feelings: [], observations: [raw], questions: [] }; }
      await base44.entities.BrainDump.create({ rawText: dumpText, aiStructured: JSON.stringify(parsed) }).catch(() => {});
      setBrainDumpResult(parsed);
      setBrainDumpDone(true);
    } catch {
      setBrainDumpError("Structureren lukte even niet. Check je verbinding en probeer opnieuw.");
    }
    setProcessing(false);
  };

  const handleCopyMessage = async (text, id) => {
    const ok = await copy(text);
    if (ok) {
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || typing) return;
    if (limitReached && mode === "normal") return;
    if (mode === "brain_dump") {
      setInput("");
      if (inputRef.current) inputRef.current.style.height = "auto";
      setMessages(prev => [...prev, { role: "user", content: text, id: Date.now() }]);
      if (convId) logCrisisContextSilently({ conversation_id: convId, message_id: undefined, role: "user", content: text });
      return;
    }
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    const userMsg = { role: "user", content: text, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);
    onUserMessage(text.length);
    setChatError(null);
    try {
      if (convId) {
        const savedUser = await base44.entities.Message.create({
          conversation_id: convId,
          role: "user",
          content: text,
        });
        logCrisisContextSilently({
          conversation_id: convId,
          message_id: savedUser?.id,
          role: "user",
          content: text,
        });
        if (messages.length === 0) {
          await base44.entities.Conversation.update(convId, { title: text.slice(0, 60), last_message_at: new Date().toISOString() });
        }
      }
      const history = [...messages, userMsg].slice(-12).map(m => ({ role: m.role, content: m.content }));
      const memoryContext = await loadMemoryContext();
      const resp = await invokeNoraChat({
        messages: history,
        style: mode === "body_double" ? "body_double" : "gentle",
        memoryContext,
        premium: isPlus,
      });
      const assistantContent = resp?.reply || resp?.content || "...";
      const assistantMsg = { role: "assistant", content: assistantContent, id: Date.now() + 1 };
      setMessages((prev) => [...prev, assistantMsg]);
      onLunaReply();
      if (convId) {
        const savedAsst = await base44.entities.Message.create({
          conversation_id: convId,
          role: "assistant",
          content: assistantContent,
        });
        logCrisisContextSilently({
          conversation_id: convId,
          message_id: savedAsst?.id,
          role: "assistant",
          content: assistantContent,
        });
        await base44.entities.Conversation.update(convId, { last_message_at: new Date().toISOString(), message_count: messages.length + 2 });
      }
      qc.invalidateQueries({ queryKey: ["conversation-quota"] });
    } catch {
      setChatError("Luna kon even niet antwoorden. Controleer je verbinding en tik op Opnieuw.");
    } finally {
      setTyping(false);
    }
  }, [input, typing, messages, convId, limitReached, mode, onUserMessage, onLunaReply, isPlus, qc, loadMemoryContext]);

  const retryAssistant = useCallback(async () => {
    if (retrying || typing || !messages.length) return;
    setRetrying(true);
    setChatError(null);
    setTyping(true);
    try {
      const history = messages.slice(-12).map((m) => ({ role: m.role, content: m.content }));
      const memoryContext = await loadMemoryContext();
      const resp = await invokeNoraChat({
        messages: history,
        style: mode === "body_double" ? "body_double" : "gentle",
        memoryContext,
        premium: isPlus,
      });
      const assistantContent = resp?.reply || resp?.content || "...";
      const assistantMsg = { role: "assistant", content: assistantContent, id: Date.now() + 1 };
      setMessages((prev) => [...prev, assistantMsg]);
      onLunaReply();
      if (convId) {
        const savedAsst = await base44.entities.Message.create({
          conversation_id: convId,
          role: "assistant",
          content: assistantContent,
        });
        logCrisisContextSilently({
          conversation_id: convId,
          message_id: savedAsst?.id,
          role: "assistant",
          content: assistantContent,
        });
        await base44.entities.Conversation.update(convId, {
          last_message_at: new Date().toISOString(),
          message_count: messages.length + 1,
        });
      }
      qc.invalidateQueries({ queryKey: ["conversation-quota"] });
    } catch {
      setChatError("Nog steeds geen verbinding. Probeer zo weer.");
    } finally {
      setTyping(false);
      setRetrying(false);
    }
  }, [retrying, typing, messages, convId, mode, onLunaReply, isPlus, qc, loadMemoryContext]);

  const clearConversation = async () => {
    setMessages([]);
    setBrainDumpDone(false);
    setBrainDumpResult(null);
    setBrainDumpError(null);
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

  return (
    <div className="flex flex-col" style={{ height: "100dvh", background: "#0B0B14", paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <div className="fixed inset-0 -z-10" style={{ background: "#0B0B14" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(232,131,74,0.06), transparent 60%)", opacity: 0.6 }} />
      </div>

      <header className="glass shrink-0 flex items-center px-4" style={{ height: 64, borderTop: "none", borderLeft: "none", borderRight: "none" }}>
        <Orb size="sm" />
        <div style={{ marginLeft: 12 }}>
          <p className="font-display" style={{ fontSize: 22, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1 }}>Luna</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
            <PresenceDot color={statusColor} />
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{statusLabel || "altijd er"}</span>
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {isPlus && (
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: "#E8834A", border: "1px solid rgba(232,131,74,0.35)", borderRadius: 999, padding: "4px 10px" }}>
              PLUS
            </span>
          )}
          {!isPlus && msgsLeft != null && msgsLeft <= FREE_DAILY_MESSAGE_LIMIT && (
            <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
              {msgsLeft} gratis vandaag
            </span>
          )}
          {isPlus && (
            <span style={{ fontSize: 10, color: "var(--text-faint)", maxWidth: 120, textAlign: "right", lineHeight: 1.25 }}>
              Langere antwoorden
            </span>
          )}
          <button onClick={() => setShowClearConfirm(true)} aria-label="Gesprek wissen" style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Trash2 size={18} style={{ color: "var(--text-muted)" }} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <div style={{ padding: "8px 16px", display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", touchAction: "pan-x" }}>
        {MODES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => { if (key !== mode) { setMode(key); setMessages([]); setBrainDumpDone(false); setBrainDumpResult(null); setBrainDumpError(null); } }}
            style={{ height: 30, padding: "0 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0, background: mode === key ? "rgba(232,131,74,0.10)" : "transparent", border: mode === key ? "1px solid rgba(232,131,74,0.28)" : "1px solid rgba(255,255,255,0.08)", color: mode === key ? "#E8834A" : "var(--text-muted)", cursor: "pointer", transition: "all 0.15s" }}
          >
            {label}
          </button>
        ))}
      </div>

      {brainDumpDone && brainDumpResult ? (
        <BrainDumpResult data={brainDumpResult} onClose={() => { setBrainDumpDone(false); setBrainDumpResult(null); setMessages([]); }} />
      ) : (
        <>
          <div ref={containerRef} className="flex-1 overflow-y-auto" style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
            {isEmpty && mode === "normal" && (
              <div className="flex flex-col items-center fade-in" style={{ marginTop: 40 }}>
                <Orb size="md" />
                <div className="bubble-luna msg-enter" style={{ marginTop: 32, maxWidth: 320 }}>
                  Hé. Geen druk. Je hoeft het nog niet goed te zeggen. Wat zit er nu het meest op je?
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.22,
                  ease: [0.32, 0.72, 0, 1],
                  delay: reduceMotion ? 0 : Math.min(i * 0.035, 0.12),
                }}
                style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start" }}
              >
                <MessageBubble msg={msg} onCopy={handleCopyMessage} copiedId={copiedId} />
              </motion.div>
            ))}
            {typing && <TypingIndicator />}
            {limitReached && !typing && mode === "normal" && (
              <div className="fade-in" style={{ padding: "20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, textAlign: "center", marginTop: 8 }}>
                <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 8 }}>Dagelijkse limiet bereikt ({FREE_DAILY_MESSAGE_LIMIT} berichten).</p>
                <p style={{ fontSize: 13, color: "var(--text-faint)", marginBottom: 16 }}>Met Luna Plus chat je onbeperkt, met langere context.</p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  <button className="btn-ghost-accent btn" style={{ height: 36, fontSize: 13, flex: 1 }} onClick={() => navigate("/pricing")}>Upgrade</button>
                  <button className="btn btn-ghost" style={{ height: 36, fontSize: 13, flex: 1 }} onClick={() => navigate("/")}>Later</button>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {(!limitReached || mode !== "normal") && (
            <div style={{ padding: "12px 12px", paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}>
              <ChatErrorBanner message={chatError} onRetry={retryAssistant} retrying={retrying} />
              {brainDumpError && (
                <p role="alert" style={{ fontSize: 13, color: "#D14D4D", marginBottom: 10, textAlign: "center", lineHeight: 1.45 }}>
                  {brainDumpError}
                </p>
              )}
              {mode === "brain_dump" && messages.filter(m => m.role === "user").length > 0 && !processing && (
                <button
                  type="button"
                  onClick={processBrainDump}
                  className="btn btn-primary press haptic-press"
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
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <button
                  type="button"
                  disabled
                  title="Stemnotities komen binnenkort"
                  className="haptic-press"
                  aria-disabled
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.45,
                    cursor: "not-allowed",
                  }}
                >
                  <Mic size={18} style={{ color: "var(--text-muted)" }} strokeWidth={1.5} />
                </button>
                <span style={{ fontSize: 11, color: "var(--text-faint)" }}>Stem — binnenkort</span>
              </div>
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
                  type="button"
                  onClick={send}
                  disabled={!input.trim() || typing}
                  aria-label="Verstuur"
                  className="haptic-press"
                  style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, background: input.trim() && !typing ? "#E8834A" : "rgba(232,131,74,0.20)", border: "none", cursor: input.trim() && !typing ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}
                >
                  <ArrowUp size={18} style={{ color: "#1A0E08" }} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {showClearConfirm && (
        <>
          <div className="fixed inset-0 z-[60]" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }} onClick={() => setShowClearConfirm(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-[70] fade-up" style={{ background: "#14141E", borderRadius: "28px 28px 0 0", padding: "32px 24px calc(40px + env(safe-area-inset-bottom, 0px))", maxWidth: 480, margin: "0 auto" }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", margin: "0 auto 24px" }} />
            <h3 className="font-display" style={{ fontSize: 24, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.02em" }}>Dit gesprek wissen?</h3>
            <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 24 }}>Dit kan niet ongedaan gemaakt worden.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={() => setShowClearConfirm(false)} className="btn btn-ghost press" style={{ flex: 1, fontSize: 14 }}>Annuleren</button>
              <button type="button" onClick={clearConversation} className="btn press" style={{ flex: 1, fontSize: 14, fontWeight: 500, background: "var(--crisis-soft)", border: "1px solid var(--crisis-border)", color: "#D14D4D", borderRadius: "var(--r-pill)" }}>Wissen</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
