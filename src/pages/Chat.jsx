import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ChevronLeft, MoreVertical, Send, Smile } from "lucide-react";
import { Link } from "react-router-dom";
import NoraLogo from "@/components/nora/NoraLogo";
import EmojiPicker from "@/components/nora/EmojiPicker";

const WELCOME = "Hé, fijn dat je er bent. Hoe voel je je vandaag?";

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setShowEmoji(false);
    setSending(true);
    try {
      const res = await base44.functions.invoke("noraChat", {
        messages: next,
        style: "gentle",
      });
      const reply =
        typeof res?.data?.reply === "string"
          ? res.data.reply
          : res?.data?.reply?.content || "Ik ben er voor je. Vertel me meer.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, ik kon je bericht even niet verwerken. Probeer opnieuw." },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const insertEmoji = (emoji) => {
    setInput((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ background: "#0d0d0d" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "#141414",
        }}
      >
        <Link to="/" className="p-1">
          <ChevronLeft className="h-5 w-5 text-white/60" />
        </Link>

        <div className="relative">
          <NoraLogo className="h-9 w-9" />
          <span
            className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-[#141414]"
            style={{ background: "#c25a32" }}
          />
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold text-white leading-tight">Nora AI</p>
          <p className="text-[11px]" style={{ color: "#c25a32" }}>Online</p>
        </div>

        <button className="p-1">
          <MoreVertical className="h-5 w-5 text-white/40" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
        {messages.map((m, i) => (
          <ChatBubble key={i} message={m} />
        ))}

        {sending && (
          <div className="flex items-end gap-2">
            <NoraLogo className="h-7 w-7 shrink-0 mb-0.5" />
            <div
              className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm px-4 py-3"
              style={{ background: "#1e1e1e", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <span className="typing-dot" style={{ animationDelay: "0ms" }} />
              <span className="typing-dot" style={{ animationDelay: "180ms" }} />
              <span className="typing-dot" style={{ animationDelay: "360ms" }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Emoji picker */}
      {showEmoji && (
        <EmojiPicker onSelect={insertEmoji} onClose={() => setShowEmoji(false)} />
      )}

      {/* Input bar */}
      <div
        className="shrink-0 px-4 py-3"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "#141414",
          paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div
          className="flex items-end gap-2 rounded-2xl px-3 py-2"
          style={{ background: "#1e1e1e", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <button
            onClick={() => setShowEmoji((v) => !v)}
            className="mb-0.5 shrink-0"
          >
            <Smile className="h-5 w-5" style={{ color: showEmoji ? "#c25a32" : "rgba(255,255,255,0.35)" }} />
          </button>

          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={handleKey}
            placeholder="Typ een bericht…"
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-white/90 outline-none leading-5"
            style={{
              minHeight: "20px",
              maxHeight: "120px",
              overflowY: "auto",
            }}
          />

          <button
            onClick={send}
            disabled={!input.trim() || sending}
            className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all disabled:opacity-30"
            style={{ background: input.trim() ? "#c25a32" : "rgba(255,255,255,0.10)" }}
          >
            <Send className="h-3.5 w-3.5 text-white" />
          </button>
        </div>
      </div>

      <style>{`
        .typing-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255,255,255,0.35);
          animation: typingBounce 1.2s ease-in-out infinite;
        }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
          30% { transform: translateY(-6px); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}

function ChatBubble({ message }) {
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
      <NoraLogo className="h-7 w-7 shrink-0 mb-0.5" />
      <div
        className="max-w-[78%] rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm leading-6 whitespace-pre-wrap break-words"
        style={{
          background: "#1e1e1e",
          border: "1px solid rgba(255,255,255,0.05)",
          color: "rgba(255,255,255,0.88)",
        }}
      >
        {message.content}
      </div>
    </div>
  );
}