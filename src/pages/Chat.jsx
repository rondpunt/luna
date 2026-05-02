import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ChevronLeft, MoreVertical, Send, Smile } from "lucide-react";
import { Link } from "react-router-dom";
import EmojiPicker from "@/components/nora/EmojiPicker";

const WELCOME = "Hé, fijn dat je er bent. Wat voelt nu het zwaarst voor jou?";
const STARTERS = [
  "Ik voel me overweldigd",
  "Ik weet niet wat ik voel",
  "Ik heb het moeilijk op het werk",
  "Ik slaap slecht",
];

export default function Chat() {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([{ role: "assistant", content: WELCOME }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  // Create agent conversation on mount
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const conv = await base44.agents.createConversation({
          agent_name: "nora_agent",
          metadata: { title: "Gesprek met Nora" },
        });
        if (active) setConversationId(conv.id);
      } catch {
        // fallback to noraChat function if agent not available
      }
    })();
    return () => { active = false; };
  }, []);

  // Subscribe to agent conversation updates
  useEffect(() => {
    if (!conversationId) return;
    const unsub = base44.agents.subscribeToConversation(conversationId, (data) => {
      const agentMsgs = (data.messages || []).filter((m) => m.role !== "system");
      if (agentMsgs.length > 0) {
        setMessages([{ role: "assistant", content: WELCOME }, ...agentMsgs]);
        setSending(false);
      }
    });
    return unsub;
  }, [conversationId]);

  const sendMessage = async (text) => {
    const txt = text || input.trim();
    if (!txt || sending) return;
    setInput("");
    setShowEmoji(false);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const userMsg = { role: "user", content: txt };
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);
    setStarted(true);

    try {
      if (conversationId) {
        // Use agent
        await base44.agents.addMessage({ id: conversationId }, userMsg);
        // Response comes via subscription
      } else {
        // Fallback: noraChat function
        const allMsgs = [...messages, userMsg];
        const res = await base44.functions.invoke("noraChat", { messages: allMsgs, style: "gentle" });
        const reply =
          typeof res?.data?.reply === "string"
            ? res.data.reply
            : res?.data?.reply?.content || "Ik ben er voor je. Vertel me meer.";
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        setSending(false);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, er liep iets mis. Probeer het opnieuw." }]);
      setSending(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const insertEmoji = (emoji) => {
    setInput((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#000" }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "#1c1c1e" }}>
          <ChevronLeft className="h-5 w-5 text-white" />
        </Link>

        {/* Avatar + name */}
        <div className="flex items-center gap-2.5 flex-1">
          <div className="relative">
            <div
              className="h-9 w-9 rounded-full flex items-center justify-center text-base font-bold text-white"
              style={{ background: "linear-gradient(135deg, #ee9670, #c25a32)" }}
            >
              N
            </div>
            <span
              className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-black"
              style={{ background: "#34c759" }}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">Nora AI</p>
            <p className="text-[11px]" style={{ color: "#34c759" }}>Online</p>
          </div>
        </div>

        <button className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "#1c1c1e" }}>
          <MoreVertical className="h-4 w-4" style={{ color: "rgba(255,255,255,0.50)" }} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <Bubble key={i} message={m} />
        ))}

        {sending && (
          <div className="flex items-end gap-2">
            <div
              className="h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white mb-0.5"
              style={{ background: "linear-gradient(135deg, #ee9670, #c25a32)" }}
            >
              N
            </div>
            <div
              className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm px-4 py-3"
              style={{ background: "#1c1c1e", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="typing-dot" style={{ animationDelay: "0ms" }} />
              <span className="typing-dot" style={{ animationDelay: "180ms" }} />
              <span className="typing-dot" style={{ animationDelay: "360ms" }} />
            </div>
          </div>
        )}

        {/* Starter prompts — only before first user message */}
        {!started && (
          <div className="pt-4 space-y-2">
            <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.30)" }}>Of kies een onderwerp</p>
            {STARTERS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="w-full text-left rounded-2xl px-4 py-3 text-sm transition-all active:scale-[0.98]"
                style={{
                  background: "#1c1c1e",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Emoji picker */}
      {showEmoji && <EmojiPicker onSelect={insertEmoji} onClose={() => setShowEmoji(false)} />}

      {/* Input bar */}
      <div
        className="shrink-0 px-4 py-3"
        style={{
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div
          className="flex items-end gap-2 rounded-2xl px-3 py-2"
          style={{ background: "#1c1c1e", border: "1px solid rgba(255,255,255,0.10)" }}
        >
          <button
            ref={inputRef}
            onClick={() => setShowEmoji((v) => !v)}
            className="mb-0.5 shrink-0 transition-colors"
          >
            <Smile className="h-5 w-5" style={{ color: showEmoji ? "#c25a32" : "rgba(255,255,255,0.35)" }} />
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={handleKey}
            placeholder="Typ een bericht…"
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm outline-none leading-5 text-white"
            style={{ minHeight: "20px", maxHeight: "120px" }}
          />

          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || sending}
            className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all disabled:opacity-30"
            style={{ background: input.trim() ? "#c25a32" : "rgba(255,255,255,0.12)" }}
          >
            <Send className="h-3.5 w-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Bubble({ message }) {
  const isUser = message.role === "user";
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-[78%] rounded-2xl rounded-br-sm px-4 py-2.5 text-sm text-white leading-6 whitespace-pre-wrap break-words"
          style={{ background: "#c25a32" }}
        >
          {message.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-end gap-2">
      <div
        className="h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white mb-0.5"
        style={{ background: "linear-gradient(135deg, #ee9670, #c25a32)" }}
      >
        N
      </div>
      <div
        className="max-w-[78%] rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm leading-6 whitespace-pre-wrap break-words"
        style={{ background: "#1c1c1e", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.90)" }}
      >
        {message.content}
      </div>
    </div>
  );
}