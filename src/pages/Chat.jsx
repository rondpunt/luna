import { useState, useRef, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Send, Smile, ChevronLeft, FolderPlus } from "lucide-react";
import { Link } from "react-router-dom";
import EmojiPicker from "@/components/nora/EmojiPicker";
import LunaOrb from "@/components/luna/LunaOrb";
import ChatErrorBanner from "@/components/chat/ChatErrorBanner";
import { useLunaPresence, PRESENCE } from "@/hooks/useLunaPresence";
import {
  saveUserMessage,
  saveAssistantMessage,
  loadMessages,
  ensureConversation,
  touchConversation,
  invokeNoraChatWithRetry,
} from "@/lib/chatPersistence";

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function getQueryParams() {
  const p = new URLSearchParams(window.location.search);
  return { convId: p.get("conv"), folderId: p.get("folder") };
}

/** Sync ?conv=<id> in URL zonder navigatie — zodat refresh thread bewaart. */
function syncConvIdToUrl(convId, folderId) {
  if (!convId) return;
  const url = new URL(window.location.href);
  if (url.searchParams.get("conv") === convId) return;
  url.searchParams.set("conv", convId);
  if (folderId) url.searchParams.set("folder", folderId);
  window.history.replaceState({}, "", url.toString());
}

export default function Chat() {
  const { convId: initConvId, folderId: initFolderId } = getQueryParams();

  /* ── state ── */
  const [dbConvId, setDbConvId] = useState(initConvId || null);
  const [agentConvId, setAgentConvId] = useState(null);
  const [folderId] = useState(initFolderId || null);
  const [folder, setFolder] = useState(null);
  const [messages, setMessages] = useState([]); // [{id?, role, content, _failed?}]
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  // refs voorkomen race-conditions bij snel dubbel-klikken / state-async
  const sendingRef = useRef(false);
  const dbConvIdRef = useRef(initConvId || null);
  const agentConvIdRef = useRef(null);
  const messagesRef = useRef([]);

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const presence = useLunaPresence();

  /* keep refs in sync */
  useEffect(() => { dbConvIdRef.current = dbConvId; }, [dbConvId]);
  useEffect(() => { agentConvIdRef.current = agentConvId; }, [agentConvId]);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  /* ── load folder ── */
  useEffect(() => {
    if (!folderId) return;
    base44.entities.ChatFolder.filter({ id: folderId })
      .then((res) => res?.[0] && setFolder(res[0]))
      .catch(() => {});
  }, [folderId]);

  /* ── boot: load thread from DB or create new agent conversation ── */
  useEffect(() => {
    let active = true;
    presence.initPresence();

    (async () => {
      try {
        // 1. Restore from DB (source of truth) als ?conv= in URL
        if (dbConvIdRef.current) {
          const [convs, persistedMsgs] = await Promise.all([
            base44.entities.Conversation.filter({ id: dbConvIdRef.current }).catch(() => []),
            loadMessages(dbConvIdRef.current),
          ]);
          const dbConv = convs?.[0];

          if (active && persistedMsgs.length > 0) {
            setMessages(persistedMsgs.map((m) => ({ id: m.id, role: m.role, content: m.content })));
            setStarted(true);
          }

          // Hergebruik bestaande agent conversation
          if (dbConv?.agentConversationId) {
            if (active) setAgentConvId(dbConv.agentConversationId);
            if (active) setLoading(false);
            return;
          }
        }

        // 2. Nieuwe agent conversation
        const folderCtx = folderId
          ? await base44.entities.ChatFolder.filter({ id: folderId }).then((r) => r?.[0]).catch(() => null)
          : null;

        const contextNote = folderCtx?.context
          ? `\n\n[Mapcontext voor dit gesprek — "${folderCtx.name}"]: ${folderCtx.context}`
          : "";

        const conv = await base44.agents
          .createConversation({
            agent_name: "nora_agent",
            metadata: {
              title: folderCtx ? `Gesprek in ${folderCtx.name}` : "Gesprek met Luna",
              system_suffix: contextNote,
            },
          })
          .catch(() => null);

        if (!active) return;
        if (conv?.id) {
          setAgentConvId(conv.id);
          if (dbConvIdRef.current) {
            base44.entities.Conversation
              .update(dbConvIdRef.current, { agentConversationId: conv.id })
              .catch(() => {});
          }
        }
      } finally {
        if (active) {
          setLoading(false);
          setTimeout(() => presence.onLunaReply(), rand(600, 1000));
        }
      }
    })();

    return () => { active = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── scroll ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  /* ── core: assistant turn (LLM call + persist + render) ── */
  const runAssistantTurn = useCallback(
    async ({ convDbId, threadForLLM }) => {
      const reply = await invokeNoraChatWithRetry({
        messages: threadForLLM,
        style: "gentle",
        memoryContext: folder?.context || "",
      });

      // Persist BEFORE rendering — geen ghost bubbles, geen lege assistant
      const saved = await saveAssistantMessage({ conversationId: convDbId, content: reply });

      setMessages((prev) => [...prev, { id: saved.id, role: "assistant", content: reply }]);
      presence.onLunaReply();
      return saved;
    },
    [folder, presence]
  );

  /* ── core: send ── */
  const sendMessage = useCallback(
    async (text) => {
      const txt = (text || input).trim();

      // Hard guard tegen dubbele submits (state is async, ref niet)
      if (!txt || sendingRef.current) return;
      sendingRef.current = true;
      setSending(true);
      setErrorMsg(null);

      setInput("");
      setShowEmoji(false);
      if (textareaRef.current) textareaRef.current.style.height = "auto";

      // Optimistic user bubble
      const userBubble = { role: "user", content: txt, _localKey: `u-${Date.now()}` };
      setMessages((prev) => [...prev, userBubble]);
      if (!started) setStarted(true);
      presence.onUserMessage(txt.length);

      let convDbId = dbConvIdRef.current;
      let userSavedId = null;

      try {
        // 1. Ensure DB conversation
        if (!convDbId) {
          const me = await base44.auth.me();
          convDbId = await ensureConversation({
            existingId: null,
            userId: me.id,
            title: txt,
            folderId,
            folderName: folder?.name,
            agentConversationId: agentConvIdRef.current,
          });
          setDbConvId(convDbId);
          dbConvIdRef.current = convDbId;
          syncConvIdToUrl(convDbId, folderId);
        }

        // 2. Persist user message
        const savedUser = await saveUserMessage({ conversationId: convDbId, content: txt });
        userSavedId = savedUser.id;
        setMessages((prev) =>
          prev.map((m) =>
            m._localKey === userBubble._localKey ? { id: savedUser.id, role: "user", content: txt } : m
          )
        );
      } catch (err) {
        // User-message persist faalde → markeer bubble als failed, geen LLM call
        setMessages((prev) =>
          prev.map((m) =>
            m._localKey === userBubble._localKey ? { ...m, _failed: true } : m
          )
        );
        setErrorMsg("Bericht kon niet worden opgeslagen. Probeer opnieuw.");
        setSending(false);
        sendingRef.current = false;
        presence.onLunaReply();
        return;
      }

      // 3. Run assistant turn (zelf retry binnen invokeNoraChatWithRetry)
      try {
        const threadForLLM = [...messagesRef.current, { role: "user", content: txt }]
          .filter((m) => !m._failed)
          .map((m) => ({ role: m.role, content: m.content }));

        await runAssistantTurn({ convDbId, threadForLLM });

        // 4. Touch metadata met écht aantal messages uit DB
        const real = await loadMessages(convDbId).catch(() => null);
        touchConversation({
          id: convDbId,
          message_count: real?.length ?? messagesRef.current.length,
        });
      } catch {
        setErrorMsg("Luna kon niet antwoorden. Probeer opnieuw.");
        presence.onLunaReply();
      } finally {
        setSending(false);
        sendingRef.current = false;
      }
    },
    [input, started, presence, folderId, folder, runAssistantTurn]
  );

  /* ── retry: alleen de assistant-turn opnieuw, geen dubbele user message ── */
  const handleRetry = useCallback(async () => {
    if (sendingRef.current) return;
    const convDbId = dbConvIdRef.current;
    if (!convDbId) return;

    const lastUser = [...messagesRef.current].reverse().find((m) => m.role === "user");
    if (!lastUser) return;

    sendingRef.current = true;
    setRetrying(true);
    setSending(true);
    setErrorMsg(null);
    presence.onUserMessage(lastUser.content.length);

    try {
      const threadForLLM = messagesRef.current
        .filter((m) => !m._failed)
        .map((m) => ({ role: m.role, content: m.content }));

      await runAssistantTurn({ convDbId, threadForLLM });

      const real = await loadMessages(convDbId).catch(() => null);
      touchConversation({
        id: convDbId,
        message_count: real?.length ?? messagesRef.current.length,
      });
    } catch {
      setErrorMsg("Het lukte nog niet. Probeer het zo nog eens.");
      presence.onLunaReply();
    } finally {
      setSending(false);
      sendingRef.current = false;
      setRetrying(false);
    }
  }, [presence, runAssistantTurn]);

  /* ── ui helpers ── */
  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const dotColor =
    {
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
    ? `Goed dat je er bent. Je zit in de map "${folder.name}". ${
        folder.context ? "Ik heb jouw context al gelezen." : "Wat wil je vandaag delen?"
      }`
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

        {messages.map((m, i) => (
          <Bubble key={m.id || m._localKey || `${m.role}-${i}`} message={m} />
        ))}

        {sending && !retrying && (
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
        <ChatErrorBanner message={errorMsg} onRetry={handleRetry} retrying={retrying} />

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
  const failed = message._failed;

  if (isUser) {
    return (
      <div className="flex justify-end msg-enter">
        <div
          className="max-w-[78%] rounded-[18px] rounded-br-[5px] px-4 py-3 text-[16px] text-white leading-[1.5] break-words"
          style={{
            background: failed ? "rgba(240,71,71,0.55)" : "#C25A32",
            opacity: failed ? 0.85 : 1,
          }}
        >
          {message.content}
          {failed && (
            <span className="block text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.85)" }}>
              Niet verzonden
            </span>
          )}
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