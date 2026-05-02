import { useState, useRef, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Send, Smile, ChevronLeft, FolderPlus } from "lucide-react";
import { Link } from "react-router-dom";
import EmojiPicker from "@/components/nora/EmojiPicker";
import LunaOrb from "@/components/luna/LunaOrb";
import { useLunaPresence, PRESENCE } from "@/hooks/useLunaPresence";

const WELCOME = "Goed dat je er bent. Wat zit je dwars vandaag?";

const STARTERS = [
  "Ik voel me compleet overweldigd",
  "Ik weet niet eens wat ik voel",
  "Het gaat moeilijk op het werk",
  "Ik slaap slecht de laatste tijd",
];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default function Chat() {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([{ role: "assistant", content: WELCOME }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [started, setStarted] = useState(false);
  const [showFolderHint, setShowFolderHint] = useState(false);

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  // How many assistant msgs from the agent we have already shown
  const shownAssistantCount = useRef(0);
  const userMessageCount = useRef(0);

  const presence = useLunaPresence();

  // Entry presence animation
  useEffect(() => {
    presence.initPresence();
    const t = setTimeout(() => presence.onLunaReply(), rand(800, 1300));
    return () => clearTimeout(t);
  }, []);

  // Create agent conversation
  useEffect(() => {
    let active = true;
    base44.agents.createConversation({
      agent_name: "nora_agent",
      metadata: { title: "Gesprek met Luna" },
    }).then((conv) => {
      if (active) setConversationId(conv.id);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  // Subscription — only react to truly NEW assistant messages
  useEffect(() => {
    if (!conversationId) return;
    const unsub = base44.agents.subscribeToConversation(conversationId, (data) => {
      const assistantMsgs = (data.messages || []).filter((m) => m.role === "assistant");
      if (assistantMsgs.length > shownAssistantCount.current) {
        const latest = assistantMsgs[assistantMsgs.length - 1];
        shownAssistantCount.current = assistantMsgs.length;
        // Small delay for natural feel
        setTimeout(() => deliverAgentReply(latest.content), rand(200, 500));
      }
    });
    return unsub;
  }, [conversationId]); // eslint-disable-line

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const deliverAgentReply = (replyText) => {
    if (!replyText?.trim()) return;
    setSending(false);
    presence.onLunaReply();

    const words = replyText.split(" ");
    if (words.length > 40 && Math.random() > 0.4) {
      const cut = Math.floor(words.length * rand(38, 55) / 100);
      const p1 = words.slice(0, cut).join(" ");
      const p2 = words.slice(cut).join(" ");
      setMessages((prev) => [...prev, { role: "assistant", content: p1 }]);
      setTimeout(() => {
        presence.onUserMessage(0);
        setTimeout(() => {
          setMessages((prev) => [...prev, { role: "assistant", content: p2 }]);
          presence.onLunaReply();
        }, rand(700, 1100));
      }, rand(900, 1500));
    } else {
      setMessages((prev) => [...prev, { role: "assistant", content: replyText }]);
    }

    userMessageCount.current += 1;
    if (userMessageCount.current >= 5 && !showFolderHint) {
      setShowFolderHint(true);
    }
  };

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
    presence.onUserMessage(txt.length);

    try {
      if (conversationId) {
        // Agent path — reply arrives via subscription
        await base44.agents.addMessage({ id: conversationId }, userMsg);
      } else {
        // Fallback: direct noraChat function
        const allMsgs = [...messages, userMsg];
        const res = await base44.functions.invoke("noraChat", { messages: allMsgs, style: "gentle" });
        const reply = typeof res?.data?.reply === "string"
          ? res.data.reply
          : res?.data?.reply?.content ?? "Ik ben er voor je. Vertel me meer.";
        setTimeout(() => deliverAgentReply(reply), rand(350, 700));
      }
    } catch {
      setSending(false);
      presence.onLunaReply();
      setMessages((prev) => [...prev, { role: "assistant", content: "Er liep iets fout. Probeer het opnieuw." }]);
    }
  }, [input, sending, conversationId, messages, presence]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const dotColor = {
    [PRESENCE.ONLINE]:       "#34C77B",
    [PRESENCE.READING]:      "#4A9EFF",
    [PRESENCE.TYPING]:       "#F5A623",
    [PRESENCE.CONNECTING]:   "rgba(240,240,242,0.50)",
    [PRESENCE.QUIETLY_HERE]: "rgba(240,240,242,0.40)",
    [PRESENCE.AWAY]:         "rgba(240,240,242,0.30)",
  }[presence.state] || "rgba(240,240,242,0.30)";

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "var(--bg)" }}>

      {/* Header */}
      <div
        className="flex items-center shrink-0 px-4 gap-3"
        style={{
          background: "rgba(10,10,11,0.94)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          paddingTop: "calc(14px + env(safe-area-inset-top, 0px))",
          paddingBottom: "13px",
        }}
      >
        <Link to="/" className="flex items-center gap-0.5 shrink-0 btn-press" style={{ color: "#C25A32" }}>
          <ChevronLeft className="h-[22px] w-[22px]" strokeWidth={2.5} />
          <span className="text-[16px] font-medium">Terug</span>
        </Link>

        <div className="flex flex-1 flex-col items-center gap-0.5">
          <div style={{ opacity: presence.state === PRESENCE.IDLE ? 0 : 1, transition: "opacity 0.5s" }}>
            <LunaOrb state={presence.state} size={30} />
          </div>
          <p className="text-[13px] font-semibold" style={{ color: "var(--text)", letterSpacing: "-0.1px" }}>Luna</p>
          <div className="flex items-center gap-1.5 h-[16px]">
            {presence.statusLabel && (
              <>
                {[PRESENCE.ONLINE, PRESENCE.READING, PRESENCE.TYPING].includes(presence.state) && (
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{
                      background: dotColor,
                      animation: presence.state === PRESENCE.TYPING ? "presencePulse 1s infinite" : "none",
                    }}
                  />
                )}
                <span className="text-[11px] font-medium transition-all" style={{ color: dotColor }}>
                  {presence.statusLabel}
                </span>
              </>
            )}
          </div>
        </div>

        <Link
          to="/chat/folders"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl btn-press"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <FolderPlus className="h-[18px] w-[18px]" style={{ color: "rgba(240,240,242,0.55)" }} strokeWidth={1.8} />
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-2">
        <div className="flex justify-center pb-2">
          <span className="text-[12px] px-3 py-1 rounded-full" style={{ color: "var(--text-3)", background: "var(--bg-card)", border: "1px solid var(--line-subtle)" }}>
            Vandaag · alles privé
          </span>
        </div>

        {messages.map((m, i) => <Bubble key={i} message={m} />)}

        {sending && (
          <div className="flex items-end gap-2.5 msg-enter">
            <OrbAvatar />
            <div className="flex items-center gap-1.5 rounded-[18px] rounded-bl-[5px] px-4 py-3.5" style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}>
              <span className="typing-dot" style={{ animationDelay: "0ms" }} />
              <span className="typing-dot" style={{ animationDelay: "180ms" }} />
              <span className="typing-dot" style={{ animationDelay: "360ms" }} />
            </div>
          </div>
        )}

        {!started && (
          <div className="pt-5 space-y-2">
            <p className="text-center text-[12px]" style={{ color: "var(--text-3)" }}>of kies een onderwerp</p>
            {STARTERS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="w-full text-left rounded-[16px] px-4 py-3.5 text-[15px] transition-all btn-press"
                style={{ background: "var(--bg-card)", border: "1px solid var(--line)", color: "var(--text-2)" }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {showFolderHint && started && (
          <div className="msg-enter mt-4">
            <button
              onClick={() => setShowFolderHint(false)}
              className="w-full rounded-2xl px-4 py-3 text-left flex items-center gap-3"
              style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.25)" }}
            >
              <span className="text-[18px]">📂</span>
              <div className="flex-1">
                <p className="text-[13px] font-semibold" style={{ color: "#F5A623" }}>Dit gesprek bewaren?</p>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--text-2)" }}>Sla het op in een map om later verder te gaan.</p>
              </div>
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {showEmoji && (
        <EmojiPicker onSelect={(e) => setInput((p) => p + e)} onClose={() => setShowEmoji(false)} />
      )}

      {/* Input bar */}
      <div
        className="shrink-0"
        style={{
          background: "rgba(10,10,11,0.96)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "10px 12px",
          paddingBottom: "calc(10px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="flex items-end gap-2">
          <button
            onClick={() => setShowEmoji((v) => !v)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full btn-press"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
          >
            <Smile className="h-[18px] w-[18px]" style={{ color: showEmoji ? "#C25A32" : "var(--text-2)" }} />
          </button>

          <div
            className="flex-1 flex items-end rounded-[22px] px-4 py-2.5"
            style={{ background: "var(--bg-input)", border: "1px solid var(--line)", minHeight: "42px" }}
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
              className="flex-1 resize-none bg-transparent text-[16px] text-white outline-none leading-[1.4]"
              style={{ minHeight: "22px", maxHeight: "120px" }}
            />
          </div>

          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || sending}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full btn-press transition-all"
            style={{
              background: input.trim() && !sending ? "#C25A32" : "var(--bg-elevated)",
              border: "1px solid var(--line)",
            }}
          >
            <Send className="h-4 w-4" style={{ color: input.trim() && !sending ? "#fff" : "var(--text-3)" }} />
          </button>
        </div>
      </div>
    </div>
  );
}

function OrbAvatar() {
  return (
    <div
      className="h-7 w-7 shrink-0 rounded-full mb-0.5"
      style={{
        background: "radial-gradient(circle at 35% 35%, #ee9670 0%, #c25a32 55%, #7a2d14 100%)",
        boxShadow: "0 0 10px 3px rgba(194,90,50,0.25)",
        flexShrink: 0,
      }}
    />
  );
}

function Bubble({ message }) {
  const isUser = message.role === "user";
  if (isUser) {
    return (
      <div className="flex justify-end msg-enter">
        <div
          className="max-w-[78%] rounded-[18px] rounded-br-[5px] px-4 py-3 text-[16px] text-white leading-[1.5] break-words"
          style={{ background: "#C25A32" }}
        >
          {message.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-end gap-2.5 msg-enter">
      <OrbAvatar />
      <div
        className="max-w-[78%] rounded-[18px] rounded-bl-[5px] px-4 py-3 text-[16px] leading-[1.5] break-words"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)", color: "var(--text)" }}
      >
        {message.content}
      </div>
    </div>
  );
}