import { useState, useRef, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Send, Smile, ChevronLeft, FolderPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import EmojiPicker from "@/components/nora/EmojiPicker";
import LunaOrb from "@/components/luna/LunaOrb";
import { useLunaPresence, PRESENCE } from "@/hooks/useLunaPresence";

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function getQueryParams() {
  const p = new URLSearchParams(window.location.search);
  return { convId: p.get("conv"), folderId: p.get("folder") };
}

export default function Chat() {
  const navigate = useNavigate();
  const { convId: initConvId, folderId: initFolderId } = getQueryParams();

  const [conversationId, setConversationId] = useState(null); // agent conversation id
  const [dbConvId, setDbConvId] = useState(initConvId || null); // DB conversation id
  const [folderId] = useState(initFolderId || null);
  const [folder, setFolder] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const shownAssistantCount = useRef(0);

  const presence = useLunaPresence();

  // Load folder context
  useEffect(() => {
    if (!folderId) return;
    base44.entities.ChatFolder.filter({ id: folderId }).then((res) => {
      if (res?.[0]) setFolder(res[0]);
    }).catch(() => {});
  }, [folderId]);

  // Load or create agent conversation
  useEffect(() => {
    let active = true;
    presence.initPresence();

    const init = async () => {
      try {
        // If we have a DB conversation with an agent conversation ID, resume it
        if (dbConvId) {
          const convs = await base44.entities.Conversation.filter({ id: dbConvId }).catch(() => []);
          const dbConv = convs?.[0];
          if (dbConv?.agentConversationId) {
            // Resume existing agent conversation — load messages
            const agentConv = await base44.agents.getConversation(dbConv.agentConversationId);
            if (active && agentConv) {
              const existingMsgs = (agentConv.messages || []).filter((m) => m.role !== "system");
              if (existingMsgs.length > 0) {
                setMessages(existingMsgs.map((m) => ({ role: m.role, content: m.content })));
                shownAssistantCount.current = existingMsgs.filter((m) => m.role === "assistant").length;
                setStarted(true);
              }
              setConversationId(dbConv.agentConversationId);
              setLoading(false);
              setTimeout(() => presence.onLunaReply(), rand(600, 1000));
              return;
            }
          }
        }

        // Create a fresh agent conversation
        const folderCtx = folderId
          ? await base44.entities.ChatFolder.filter({ id: folderId }).then((r) => r?.[0]).catch(() => null)
          : null;

        const contextNote = folderCtx?.context
          ? `\n\n[Mapcontext voor dit gesprek — "${folderCtx.name}"]: ${folderCtx.context}`
          : "";

        const conv = await base44.agents.createConversation({
          agent_name: "nora_agent",
          metadata: {
            title: folderCtx ? `Gesprek in ${folderCtx.name}` : "Gesprek met Luna",
            system_suffix: contextNote,
          },
        });

        if (!active) return;
        setConversationId(conv.id);

        // Save/update agent conversation ID to DB conversation
        if (dbConvId) {
          await base44.entities.Conversation.update(dbConvId, { agentConversationId: conv.id }).catch(() => {});
        }
      } catch {
        /* silent fallback */
      } finally {
        if (active) {
          setLoading(false);
          setTimeout(() => presence.onLunaReply(), rand(600, 1000));
        }
      }
    };

    init();
    return () => { active = false; };
  }, []);

  // Subscribe to agent replies
  useEffect(() => {
    if (!conversationId) return;
    const unsub = base44.agents.subscribeToConversation(conversationId, (data) => {
      const assistantMsgs = (data.messages || []).filter((m) => m.role === "assistant");
      if (assistantMsgs.length > shownAssistantCount.current) {
        const latest = assistantMsgs[assistantMsgs.length - 1];
        shownAssistantCount.current = assistantMsgs.length;
        setTimeout(() => deliverReply(latest.content), rand(150, 400));
      }
    });
    return unsub;
  }, [conversationId]); // eslint-disable-line

  // Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const deliverReply = (replyText) => {
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
      }, rand(900, 1400));
    } else {
      setMessages((prev) => [...prev, { role: "assistant", content: replyText }]);
    }

    // Auto-update conversation metadata after 3 messages
    if (dbConvId && messages.length >= 3 && messages.length % 5 === 0) {
      autoUpdateConvTitle();
    }
  };

  const autoUpdateConvTitle = async () => {
    try {
      const recentUser = messages.filter((m) => m.role === "user").slice(-3).map((m) => m.content).join(" | ");
      if (!recentUser || !dbConvId) return;
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Geef een korte Nederlandstalige titel (max 6 woorden) voor dit gesprek op basis van: "${recentUser}". Geef enkel de titel, geen aanhalingstekens.`,
      }).catch(() => null);
      if (res?.result) {
        await base44.entities.Conversation.update(dbConvId, {
          title: res.result,
          last_message_at: new Date().toISOString(),
          message_count: messages.length,
        }).catch(() => {});
      }
    } catch { /* silent */ }
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
    if (!started) setStarted(true);
    presence.onUserMessage(txt.length);

    // Create DB conversation on first message if none exists
    let currentDbConvId = dbConvId;
    if (!currentDbConvId) {
      try {
        const user = await base44.auth.me();
        const newConv = await base44.entities.Conversation.create({
          userId: user.id,
          title: txt.slice(0, 50),
          folderId: folderId || undefined,
          folderName: folder?.name || undefined,
          agentConversationId: conversationId || undefined,
          last_message_at: new Date().toISOString(),
          message_count: 1,
        });
        currentDbConvId = newConv.id;
        setDbConvId(newConv.id);
      } catch { /* silent */ }
    } else {
      // Update last_message_at
      base44.entities.Conversation.update(currentDbConvId, {
        last_message_at: new Date().toISOString(),
        message_count: messages.length + 1,
      }).catch(() => {});
    }

    try {
      if (conversationId) {
        await base44.agents.addMessage({ id: conversationId }, userMsg);
      } else {
        // Fallback
        const res = await base44.functions.invoke("noraChat", {
          messages: [...messages, userMsg],
          style: "gentle",
          memoryContext: folder?.context || "",
        });
        const reply = typeof res?.data?.reply === "string"
          ? res.data.reply
          : res?.data?.reply?.content ?? "Ik ben er voor je. Vertel me meer.";
        setTimeout(() => deliverReply(reply), rand(350, 700));
      }
    } catch {
      setSending(false);
      presence.onLunaReply();
      setMessages((prev) => [...prev, { role: "assistant", content: "Er liep iets fout. Probeer het opnieuw." }]);
    }
  }, [input, sending, conversationId, messages, presence, dbConvId, folderId, folder, started]);

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

  const backLink = folderId ? `/chat/folder/${folderId}` : "/";
  const folderColor = folder?.color || "#C25A32";

  const welcomeMessage = folder
    ? `Goed dat je er bent. Je zit in de map "${folder.name}". ${folder.context ? "Ik heb jouw context al gelezen." : "Wat wil je vandaag delen?"}`
    : "Goed dat je er bent. Wat zit je dwars vandaag?";

  const starters = folder?.name?.toLowerCase().includes("angst")
    ? ["Ik piekerde de hele nacht", "Ik voel me angstig zonder reden", "Er is iets wat ik niet kan loslaten", "Ik weet niet hoe ik kalmer moet worden"]
    : folder?.name?.toLowerCase().includes("werk")
    ? ["Ik ben op van het werk", "Ik weet niet hoe ik neen moet zeggen", "Ik voel me ondergewaardeerd", "Ik denk aan stoppen"]
    : ["Ik voel me compleet overweldigd", "Ik weet niet eens wat ik voel", "Het gaat moeilijk op het werk", "Ik slaap slecht de laatste tijd"];

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
        <Link to={backLink} className="flex items-center gap-0.5 shrink-0 btn-press" style={{ color: folderColor }}>
          <ChevronLeft className="h-[22px] w-[22px]" strokeWidth={2.5} />
          <span className="text-[16px] font-medium">{folder ? folder.name : "Terug"}</span>
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
          <span
            className="text-[12px] px-3 py-1 rounded-full"
            style={{ color: "var(--text-3)", background: "var(--bg-card)", border: "1px solid var(--line-subtle)" }}
          >
            {folder ? `${folder.emoji || "📁"} ${folder.name} · privé` : "Vandaag · alles privé"}
          </span>
        </div>

        {/* Context pill */}
        {folder?.context && !started && (
          <div
            className="rounded-2xl px-4 py-3 mb-2 flex items-start gap-2.5"
            style={{ background: `${folderColor}0D`, border: `1px solid ${folderColor}25` }}
          >
            <span className="text-[16px] shrink-0 mt-0.5">✨</span>
            <div>
              <p className="text-[12px] font-semibold mb-0.5" style={{ color: folderColor }}>Luna kent jouw context</p>
              <p className="text-[12px] leading-[1.5]" style={{ color: "var(--text-2)" }}>
                {folder.context.length > 100 ? folder.context.slice(0, 100) + "…" : folder.context}
              </p>
            </div>
          </div>
        )}

        {/* Welcome */}
        {!loading && messages.length === 0 && (
          <Bubble message={{ role: "assistant", content: welcomeMessage }} />
        )}

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

        {/* Starters */}
        {!started && !loading && (
          <div className="pt-4 space-y-2">
            <p className="text-center text-[12px]" style={{ color: "var(--text-3)" }}>of kies een onderwerp</p>
            {starters.map((s) => (
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
              background: input.trim() && !sending ? (folder?.color || "#C25A32") : "var(--bg-elevated)",
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