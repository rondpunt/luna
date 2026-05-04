import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowUp, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Orb } from "@/components/luna/Orb";
import CrisisSheet from "@/components/luna/CrisisSheet";
import { useLunaPresence, PRESENCE } from "@/hooks/useLunaPresence";
import { format } from "date-fns";

const FREE_DAILY_LIMIT = 10;

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

  const { statusLabel, statusColor, initPresence, onUserMessage, onLunaReply } = useLunaPresence();
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Init
  useEffect(() => {
    initPresence();

    const init = async () => {
      // Restore draft
      const draft = sessionStorage.getItem("luna_draft");
      if (draft) { setInput(draft); sessionStorage.removeItem("luna_draft"); }

      // Get or create conversation
      const paramConv = params.get("conv");
      let cid = paramConv;

      if (paramConv) {
        const msgs = await base44.entities.Message.filter({ conversation_id: paramConv });
        const sorted = msgs.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
        setMessages(sorted.map((m) => ({ role: m.role, content: m.content, id: m.id })));
      } else {
        const me = await base44.auth.me();
        const conv = await base44.entities.Conversation.create({
          userId: me?.id || "",
          title: "",
        });
        cid = conv.id;
      }
      setConvId(cid);

      // Check daily quota
      await checkQuota();
    };

    init().catch(() => {});
  }, []);

  // Save draft on unmount
  useEffect(() => {
    return () => {
      if (input.trim()) sessionStorage.setItem("luna_draft", input);
    };
  }, [input]);

  const checkQuota = async () => {
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const todayMsgs = await base44.entities.Message.filter({
        role: "user",
      });
      const todayCount = todayMsgs?.filter((m) => {
        const msgDate = m.created_date ? m.created_date.split("T")[0] : "";
        return msgDate === today;
      }).length || 0;
      setMsgCount(todayCount);
      setLimitReached(todayCount >= FREE_DAILY_LIMIT);
    } catch {}
  };

  // Load memory context for AI
  const loadMemoryContext = async () => {
    try {
      const memories = await base44.entities.Memory.list("-created_date", 20);
      if (!memories?.length) return "";
      return memories.map((m) => m.content || m.note || "").filter(Boolean).join("\n").slice(0, 1500);
    } catch { return ""; }
  };

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || typing) return;
    if (limitReached) return;

    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    const userMsg = { role: "user", content: text, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);
    onUserMessage(text.length);

    try {
      // Save user message
      if (convId) {
        await base44.entities.Message.create({
          conversation_id: convId,
          role: "user",
          content: text,
        });
        if (messages.length === 0) {
          await base44.entities.Conversation.update(convId, {
            title: text.slice(0, 60),
            last_message_at: new Date().toISOString(),
          });
        }
      }

      // Build message history for AI
      const history = [...messages, userMsg].slice(-12).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Load memory
      const memoryContext = await loadMemoryContext();

      // Call noraChat function
      const resp = await base44.functions.noraChat({
        messages: history,
        style: "gentle",
        memoryContext,
      });

      const assistantContent = resp?.reply || resp?.content || "...";
      const assistantMsg = { role: "assistant", content: assistantContent, id: Date.now() + 1 };
      setMessages((prev) => [...prev, assistantMsg]);
      onLunaReply();

      // Save assistant message
      if (convId) {
        await base44.entities.Message.create({
          conversation_id: convId,
          role: "assistant",
          content: assistantContent,
        });
        await base44.entities.Conversation.update(convId, {
          last_message_at: new Date().toISOString(),
          message_count: messages.length + 2,
        });
      }

      // Update quota
      setMsgCount((c) => c + 1);
      if (msgCount + 1 >= FREE_DAILY_LIMIT) setLimitReached(true);

    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Even geduld. Probeer het opnieuw.", id: Date.now() + 2 },
      ]);
      onLunaReply();
    } finally {
      setTyping(false);
    }
  }, [input, typing, messages, convId, limitReached, msgCount, onUserMessage, onLunaReply]);

  const clearConversation = async () => {
    setMessages([]);
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
    <div
      className="flex flex-col"
      style={{
        height: "100dvh",
        background: "#0B0B14",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      {/* Ambient */}
      <div className="fixed inset-0 -z-10" style={{ background: "#0B0B14" }}>
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(232,131,74,0.06), transparent 60%)",
          opacity: 0.6,
        }} />
      </div>

      {/* Glass header */}
      <header
        className="glass shrink-0 flex items-center px-4"
        style={{ height: 64, borderTop: "none", borderLeft: "none", borderRight: "none" }}
      >
        <Orb size="sm" />
        <div style={{ marginLeft: 12 }}>
          <p className="font-display" style={{ fontSize: 22, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1 }}>
            Luna
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
            <PresenceDot color={statusColor} />
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {statusLabel || "altijd er"}
            </span>
          </div>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          {/* Daily msg counter — free tier */}
          {msgsLeft <= FREE_DAILY_LIMIT && msgsLeft > 0 && (
            <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
              {msgsLeft} berichten over
            </span>
          )}

          <button
            onClick={() => setShowCrisis(true)}
            style={{ fontSize: 13, fontWeight: 500, color: "#D14D4D", background: "none", border: "none", cursor: "pointer" }}
            aria-label="Hulp nu — crisis lijn"
          >
            hulp
          </button>
          <button
            onClick={() => setShowClearConfirm(true)}
            aria-label="Gesprek wissen"
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "var(--surface)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Trash2 size={18} style={{ color: "var(--text-muted)" }} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto"
        style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 12 }}
      >
        {/* Empty state */}
        {isEmpty && (
          <div className="flex flex-col items-center fade-in" style={{ marginTop: 40 }}>
            <Orb size="md" />
            <div className="bubble-luna msg-enter" style={{ marginTop: 32, maxWidth: 320 }}>
              Hé. Geen druk. Je hoeft het nog niet goed te zeggen. Wat zit er nu het meest op je?
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={msg.role === "user" ? "bubble-user msg-enter" : "bubble-luna msg-enter"}
          >
            {msg.content}
          </div>
        ))}

        {typing && <TypingIndicator />}

        {/* Free tier limit reached */}
        {limitReached && !typing && (
          <div
            className="fade-in"
            style={{
              padding: "20px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 20,
              textAlign: "center",
              marginTop: 8,
            }}
          >
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 16 }}>
              Je hebt vandaag al even gepraat. Morgen mag het weer. Of upgrade voor onbeperkt.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                className="btn-ghost-accent btn"
                style={{ height: 36, fontSize: 13, flex: 1 }}
                onClick={() => navigate("/pricing")}
              >
                Upgrade
              </button>
              <button
                className="btn btn-ghost"
                style={{ height: 36, fontSize: 13, flex: 1 }}
                onClick={() => navigate("/")}
              >
                Misschien morgen
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      {!limitReached && (
        <div style={{
          padding: "12px 12px",
          paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
        }}>
          <div
            className="glass"
            style={{
              display: "flex", alignItems: "flex-end",
              gap: 8, borderRadius: 28, padding: "12px 16px",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 96) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
              }}
              placeholder="Schrijf wat in je opkomt…"
              rows={1}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                fontSize: 15, color: "var(--text)", lineHeight: 1.5,
                resize: "none", fontFamily: "'Geist', system-ui, sans-serif",
                maxHeight: 96, overflowY: "auto",
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || typing}
              aria-label="Verstuur"
              style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                background: input.trim() && !typing ? "#E8834A" : "rgba(232,131,74,0.20)",
                border: "none", cursor: input.trim() && !typing ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.15s",
              }}
            >
              <ArrowUp size={18} style={{ color: "#1A0E08" }} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* Crisis sheet */}
      {showCrisis && <CrisisSheet onClose={() => setShowCrisis(false)} />}

      {/* Clear confirm */}
      {showClearConfirm && (
        <>
          <div
            className="fixed inset-0 z-[60]"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
            onClick={() => setShowClearConfirm(false)}
          />
          <div
            className="fixed bottom-0 left-0 right-0 z-[70] fade-up"
            style={{
              background: "#14141E", borderRadius: "28px 28px 0 0",
              padding: "32px 24px calc(40px + env(safe-area-inset-bottom, 0px))",
              maxWidth: 480, margin: "0 auto",
            }}
          >
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", margin: "0 auto 24px" }} />
            <h3 className="font-display" style={{ fontSize: 24, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.02em" }}>
              Dit gesprek wissen?
            </h3>
            <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 24 }}>
              Dit kan niet ongedaan gemaakt worden.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowClearConfirm(false)} className="btn btn-ghost press" style={{ flex: 1, fontSize: 14 }}>
                Annuleren
              </button>
              <button
                onClick={clearConversation}
                className="btn press"
                style={{
                  flex: 1, fontSize: 14, fontWeight: 500,
                  background: "var(--crisis-soft)", border: "1px solid var(--crisis-border)",
                  color: "#D14D4D", borderRadius: "var(--r-pill)",
                }}
              >
                Wissen
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
