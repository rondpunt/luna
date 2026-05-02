import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ChevronLeft, Send, Smile } from "lucide-react";
import { Link } from "react-router-dom";
import EmojiPicker from "@/components/nora/EmojiPicker";

const WELCOME = "Hé, fijn dat je er bent. Wat voelt nu het zwaarst voor jou?";
const STARTERS = [
  "Ik voel me overweldigd",
  "Ik weet niet wat ik voel",
  "Ik heb het moeilijk op het werk",
  "Ik slaap al dagen slecht",
];

export default function Chat() {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([{ role: "assistant", content: WELCOME }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const emojiRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

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
        // fallback to noraChat
      }
    })();
    return () => { active = false; };
  }, []);

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
    const txt = (text || input).trim();
    if (!txt || sending) return;
    setInput("");
    setShowEmoji(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    const userMsg = { role: "user", content: txt };
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);
    setStarted(true);

    try {
      if (conversationId) {
        await base44.agents.addMessage({ id: conversationId }, userMsg);
      } else {
        const allMsgs = [...messages, userMsg];
        const res = await base44.functions.invoke("noraChat", { messages: allMsgs, style: "gentle" });
        const reply =
          typeof res?.data?.reply === "string"
            ? res.data.reply
            : res?.data?.reply?.content ?? "Ik ben er voor je. Vertel me meer.";
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

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#000" }}>
      {/* iOS Chat header */}
      <div
        className="flex items-center gap-3 px-4 shrink-0"
        style={{
          background: "rgba(0,0,0,0.88)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
          borderBottom: "0.5px solid rgba(84,84,88,0.65)",
          paddingTop: "calc(12px + env(safe-area-inset-top, 0px))",
          paddingBottom: "12px",
        }}
      >
        <Link
          to="/"
          className="flex items-center gap-1 text-[17px] font-medium"
          style={{ color: "#C25A32" }}
        >
          <ChevronLeft className="h-[22px] w-[22px]" strokeWidth={2.5} />
          <span className="text-[17px]">Start</span>
        </Link>

        {/* Center: avatar + name */}
        <div className="flex flex-1 flex-col items-center">
          <div className="relative">
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-[13px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #ee9670, #c25a32)" }}
            >
              N
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-[1.5px] border-black"
              style={{ background: "#30D158" }}
            />
          </div>
          <p className="text-[12px] font-semibold mt-0.5" style={{ color: "#fff" }}>Nora</p>
        </div>

        <div className="w-16" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.map((m, i) => (
          <Bubble key={i} message={m} />
        ))}

        {sending && (
          <div className="flex items-end gap-2">
            <div
              className="h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-[12px] font-bold text-white mb-0.5"
              style={{ background: "linear-gradient(135deg, #ee9670, #c25a32)" }}
            >
              N
            </div>
            <div
              className="flex items-center gap-1.5 rounded-[18px] rounded-bl-[4px] px-4 py-3"
              style={{ background: "#1C1C1E" }}
            >
              <span className="typing-dot" style={{ animationDelay: "0ms" }} />
              <span className="typing-dot" style={{ animationDelay: "200ms" }} />
              <span className="typing-dot" style={{ animationDelay: "400ms" }} />
            </div>
          </div>
        )}

        {!started && (
          <div className="pt-6 space-y-2">
            <p
              className="text-center text-[13px] mb-3"
              style={{ color: "rgba(235,235,245,0.35)" }}
            >
              Of kies een onderwerp
            </p>
            {STARTERS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="w-full text-left rounded-2xl px-4 py-3 text-[15px] transition-all active:scale-[0.98]"
                style={{
                  background: "#1C1C1E",
                  color: "rgba(235,235,245,0.85)",
                  border: "none",
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
      {showEmoji && (
        <EmojiPicker onSelect={(e) => setInput((p) => p + e)} onClose={() => setShowEmoji(false)} />
      )}

      {/* iOS-style input bar */}
      <div
        className="shrink-0"
        style={{
          background: "rgba(28,28,30,0.94)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
          borderTop: "0.5px solid rgba(84,84,88,0.65)",
          paddingLeft: "8px",
          paddingRight: "8px",
          paddingTop: "8px",
          paddingBottom: "max(8px, env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="flex items-end gap-2">
          {/* Emoji button */}
          <button
            onClick={() => setShowEmoji((v) => !v)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full mb-0.5"
            style={{ background: "rgba(120,120,128,0.24)" }}
          >
            <Smile className="h-5 w-5" style={{ color: showEmoji ? "#C25A32" : "rgba(235,235,245,0.65)" }} />
          </button>

          {/* Text input bubble */}
          <div
            className="flex flex-1 items-end rounded-[22px] px-3 py-2"
            style={{
              background: "#2C2C2E",
              border: "0.5px solid rgba(84,84,88,0.65)",
              minHeight: "36px",
            }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKey}
              placeholder="Bericht…"
              rows={1}
              className="flex-1 resize-none bg-transparent text-[15px] leading-5 outline-none text-white"
              style={{ minHeight: "20px", maxHeight: "120px" }}
            />
          </div>

          {/* Send button — iOS style */}
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || sending}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full mb-0.5 transition-all"
            style={{
              background: input.trim() && !sending ? "#C25A32" : "rgba(120,120,128,0.24)",
            }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
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
          className="max-w-[75%] rounded-[18px] rounded-br-[4px] px-4 py-2.5 text-[15px] leading-[1.4] text-white break-words"
          style={{ background: "#C25A32" }}
        >
          {message.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-end gap-2">
      <div
        className="h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-[12px] font-bold text-white mb-0.5"
        style={{ background: "linear-gradient(135deg, #ee9670, #c25a32)" }}
      >
        N
      </div>
      <div
        className="max-w-[75%] rounded-[18px] rounded-bl-[4px] px-4 py-2.5 text-[15px] leading-[1.4] break-words"
        style={{ background: "#1C1C1E", color: "rgba(235,235,245,0.92)" }}
      >
        {message.content}
      </div>
    </div>
  );
}