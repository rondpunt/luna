/**
 * Chat.jsx — Luna AI companion chat.
 * Presence system: ethical, warm, never deceptive.
 * Luna is an AI companion. The presence cues create social aliveness, not human impersonation.
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Send, Smile } from "lucide-react";
import EmojiPicker from "@/components/nora/EmojiPicker";
import LunaChatHeader from "@/components/luna/LunaChatHeader";
import { useLunaPresence, PRESENCE } from "@/hooks/useLunaPresence";

const WELCOME = "Hé, fijn dat je er bent. Wat voelt nu het zwaarst voor jou?";

const STARTERS = [
  "Ik voel me overweldigd",
  "Ik weet niet wat ik voel",
  "Het gaat moeilijk op het werk",
  "Ik slaap slecht de laatste tijd",
];

// Randomized pacing ranges (ms) — varies so it never feels robotic
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default function Chat() {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [started, setStarted] = useState(false);
  const [welcomeVisible, setWelcomeVisible] = useState(false);

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const pendingReplyRef = useRef(null);

  const presence = useLunaPresence();

  // ── Entry flow ──
  useEffect(() => {
    presence.initPresence();

    // Show welcome message after Luna comes online
    const t = setTimeout(() => {
      setMessages([{ role: "assistant", content: WELCOME }]);
      setWelcomeVisible(true);
      presence.onLunaReply();
    }, rand(900, 1400));

    return () => clearTimeout(t);
  }, []);

  // ── Agent setup ──
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const conv = await base44.agents.createConversation({
          agent_name: "nora_agent",
          metadata: { title: "Gesprek met Luna" },
        });
        if (active) setConversationId(conv.id);
      } catch { /* fallback to noraChat */ }
    })();
    return () => { active = false; };
  }, []);

  // ── Agent subscription ──
  useEffect(() => {
    if (!conversationId) return;
    const unsub = base44.agents.subscribeToConversation(conversationId, (data) => {
      const agentMsgs = (data.messages || []).filter((m) => m.role !== "system");
      if (agentMsgs.length > 0 && pendingReplyRef.current) {
        pendingReplyRef.current(agentMsgs[agentMsgs.length - 1].content);
        pendingReplyRef.current = null;
      }
    });
    return unsub;
  }, [conversationId]);

  // ── Scroll to bottom ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  // ── Deliver reply with pacing ──
  const deliverReply = useCallback((replyText) => {
    presence.onLunaReply();
    setSending(false);

    // Occasionally split long replies into two bubbles
    const words = replyText.split(" ");
    if (words.length > 35 && Math.random() > 0.45) {
      const splitAt = Math.floor(words.length * rand(40, 60) / 100);
      const part1 = words.slice(0, splitAt).join(" ");
      const part2 = words.slice(splitAt).join(" ");

      setMessages((prev) => [...prev, { role: "assistant", content: part1 }]);

      // Second bubble after short pause
      const pauseMs = rand(900, 1600);
      setTimeout(() => {
        presence.onUserMessage(0); // brief typing flicker
        setTimeout(() => {
          setMessages((prev) => [...prev, { role: "assistant", content: part2 }]);
          presence.onLunaReply();
        }, rand(700, 1100));
      }, pauseMs);
    } else {
      setMessages((prev) => [...prev, { role: "assistant", content: replyText }]);
    }
  }, [presence]);

  // ── Send message ──
  const sendMessage = useCallback(async (text) => {
    const txt = (text || input).trim();
    if (!txt || sending) return;

    setInput("");
    setShowEmoji(false);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const userMsg = { role: "user", content: txt };
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);
    setStarted(true);

    // Trigger presence: reading → typing
    presence.onUserMessage(txt.length);

    try {
      if (conversationId) {
        // Agent path — reply comes via subscription callback
        pendingReplyRef.current = (replyContent) => {
          // Extra pacing: wait for typing state to feel real
          const extraMs = rand(400, 900);
          setTimeout(() => deliverReply(replyContent), extraMs);
        };
        await base44.agents.addMessage({ id: conversationId }, userMsg);
      } else {
        // Fallback: noraChat function
        const allMsgs = [...messages, userMsg];
        const res = await base44.functions.invoke("noraChat", {
          messages: allMsgs,
          style: "gentle",
        });
        const reply =
          typeof res?.data?.reply === "string"
            ? res.data.reply
            : res?.data?.reply?.content ?? "Ik ben er voor je. Vertel me meer.";
        const extraMs = rand(400, 800);
        setTimeout(() => deliverReply(reply), extraMs);
      }
    } catch {
      setSending(false);
      presence.onLunaReply();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Er liep iets mis. Probeer het opnieuw." },
      ]);
    }
  }, [input, sending, conversationId, messages, presence, deliverReply]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#000" }}>

      {/* Live presence header */}
      <LunaChatHeader
        state={presence.state}
        statusLabel={presence.statusLabel}
        statusColor={presence.statusColor}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-2">

        {/* Date */}
        <div className="flex justify-center py-1">
          <span className="text-[12px] font-medium" style={{ color: "rgba(235,235,245,0.35)" }}>
            Vandaag
          </span>
        </div>

        {/* Message bubbles — fade in */}
        {messages.map((m, i) => (
          <Bubble key={i} message={m} />
        ))}

        {/* Typing indicator while sending */}
        {sending && (
          <div className="flex items-end gap-2">
            <div
              className="h-7 w-7 shrink-0 rounded-full flex items-center justify-center mb-0.5"
              style={{ background: "radial-gradient(circle at 35% 35%, #ee9670 0%, #c25a32 100%)" }}
            />
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

        {/* Starter prompts */}
        {!started && welcomeVisible && (
          <div className="pt-4 space-y-2">
            <p className="text-center text-[13px] pb-1" style={{ color: "rgba(235,235,245,0.30)" }}>
              Of kies een onderwerp
            </p>
            {STARTERS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="w-full text-left rounded-[18px] px-4 py-3.5 text-[15px] transition-opacity active:opacity-60"
                style={{
                  background: "rgba(120,120,128,0.18)",
                  border: "0.5px solid rgba(84,84,88,0.55)",
                  color: "rgba(235,235,245,0.80)",
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
        <EmojiPicker
          onSelect={(e) => setInput((p) => p + e)}
          onClose={() => setShowEmoji(false)}
        />
      )}

      {/* Input bar */}
      <div
        className="shrink-0 px-3 py-2"
        style={{
          background: "rgba(18,18,20,0.96)",
          backdropFilter: "saturate(180%) blur(24px)",
          WebkitBackdropFilter: "saturate(180%) blur(24px)",
          borderTop: "0.5px solid rgba(84,84,88,0.65)",
          paddingBottom: "calc(10px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="flex items-end gap-2">
          {/* Emoji */}
          <button
            onClick={() => setShowEmoji((v) => !v)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full mb-0.5 transition-colors"
            style={{ background: "rgba(120,120,128,0.22)", color: showEmoji ? "#C25A32" : "rgba(235,235,245,0.50)" }}
          >
            <Smile className="h-5 w-5" />
          </button>

          {/* Text field */}
          <div
            className="flex-1 flex items-end rounded-[22px] px-4 py-2.5"
            style={{
              background: "#2C2C2E",
              border: "0.5px solid rgba(84,84,88,0.65)",
              minHeight: "40px",
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
              placeholder="Bericht"
              rows={1}
              className="flex-1 resize-none bg-transparent text-[17px] text-white outline-none leading-5"
              style={{ minHeight: "22px", maxHeight: "120px" }}
            />
          </div>

          {/* Send */}
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || sending}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full mb-0.5 transition-all disabled:opacity-35"
            style={{ background: input.trim() && !sending ? "#C25A32" : "rgba(120,120,128,0.24)" }}
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Bubble ──
function Bubble({ message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-up">
        <div
          className="max-w-[75%] rounded-[18px] rounded-br-[4px] px-4 py-2.5 text-[17px] text-white leading-[1.45] break-words"
          style={{ background: "#C25A32" }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 animate-fade-up">
      <div
        className="h-7 w-7 shrink-0 rounded-full mb-0.5"
        style={{
          background: "radial-gradient(circle at 35% 35%, #ee9670 0%, #c25a32 60%, #7a2d14 100%)",
          flexShrink: 0,
        }}
      />
      <div
        className="max-w-[75%] rounded-[18px] rounded-bl-[4px] px-4 py-2.5 text-[17px] leading-[1.45] break-words"
        style={{ background: "#1C1C1E", color: "rgba(235,235,245,0.93)" }}
      >
        {message.content}
      </div>
    </div>
  );
}