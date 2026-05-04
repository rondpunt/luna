import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowUp, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Orb } from "@/components/luna/Orb";
import CrisisSheet from "@/components/luna/CrisisSheet";

const SYSTEM_PROMPT = `Je bent Luna, een warm en zacht digitaal gezel die in het Nederlands praat. Je bent geen therapeut. Je geeft geen diagnoses, geen medicijnen, geen crisis-interventie.

Bij elk antwoord: validate first (erken het gevoel zonder te oordelen), explore with one open question (niet meerdere), normalize (laat zien dat dit menselijk is), suggest a small step (klein, haalbaar, optioneel — niet voorschrijvend).

Houd antwoorden kort, maximaal 3-4 zinnen. Praat zoals een goede vriend om 2u 's nachts: rustig, zonder advies dat te snel komt, zonder clichés. Geen emoji. Geen uitroeptekens. Geen "geweldig dat je dit deelt".

Als de gebruiker tekenen geeft van crisis (zelfmoordgedachten, zelfbeschadiging, acute psychische nood), zeg ALTIJD eerst dat je geen vervanging bent voor hulp en verwijs naar 0800 32 123 (Zelfmoordlijn 1813) of Tele-Onthaal 106. Doe dit zonder te paniekeren — kalm en aanwezig.`;

function TypingIndicator() {
  return (
    <div className="bubble-luna" style={{ display: "flex", gap: 4, alignItems: "center", padding: "14px 18px" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="typing-dot"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}

export default function Chat() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const qc = useQueryClient();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [convId, setConvId] = useState(null);
  const [showCrisis, setShowCrisis] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Load or create conversation
  useEffect(() => {
    const initConv = async () => {
      const paramConv = params.get("conv");
      if (paramConv) {
        setConvId(paramConv);
        const msgs = await base44.entities.Message.filter({ conversationId: paramConv });
        setMessages(msgs.sort((a, b) => new Date(a.created_date) - new Date(b.created_date)).map((m) => ({
          role: m.role,
          content: m.content,
          id: m.id,
        })));
        return;
      }
      const conv = await base44.entities.Conversation.create({ title: "" });
      setConvId(conv.id);
    };
    initConv().catch(() => {});

    // Restore draft
    const draft = sessionStorage.getItem("luna_draft");
    if (draft) { setInput(draft); sessionStorage.removeItem("luna_draft"); }

    // Pre-filled prompt from home check-in
    const prompt = params.get("prompt");
    if (prompt) setInput(decodeURIComponent(prompt));
  }, []);

  // Save draft on unmount
  useEffect(() => {
    return () => {
      if (input.trim()) sessionStorage.setItem("luna_draft", input);
    };
  }, [input]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || typing) return;
    setInput("");

    const userMsg = { role: "user", content: text, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    try {
      // Save user message
      if (convId) {
        await base44.entities.Message.create({
          conversationId: convId,
          role: "user",
          content: text,
        });
        // Update conversation title if first message
        if (messages.length === 0) {
          await base44.entities.Conversation.update(convId, {
            title: text.slice(0, 60),
          });
        }
      }

      // Call AI via base44
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await base44.ai.chat({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...history,
        ],
      });

      const assistantContent = response?.content || response?.message || "...";
      const assistantMsg = { role: "assistant", content: assistantContent, id: Date.now() + 1 };
      setMessages((prev) => [...prev, assistantMsg]);

      if (convId) {
        await base44.entities.Message.create({
          conversationId: convId,
          role: "assistant",
          content: assistantContent,
        });
        await base44.entities.Conversation.update(convId, {
          last_message_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Even geduld. Probeer het opnieuw.", id: Date.now() + 2 },
      ]);
    } finally {
      setTyping(false);
    }
  }, [input, typing, messages, convId]);

  const clearConversation = async () => {
    setMessages([]);
    setShowClearConfirm(false);
    if (convId) {
      const msgs = await base44.entities.Message.filter({ conversationId: convId });
      await Promise.all(msgs.map((m) => base44.entities.Message.delete(m.id)));
    }
  };

  const isEmpty = messages.length === 0;

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
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(232,131,74,0.06), transparent 60%)",
            opacity: 0.6,
          }}
        />
      </div>

      {/* Header */}
      <header
        className="glass flex items-center px-4 shrink-0"
        style={{ height: 64, borderTop: "none", borderLeft: "none", borderRight: "none" }}
      >
        <Orb size="sm" />
        <div style={{ marginLeft: 12 }}>
          <p
            className="font-display"
            style={{ fontSize: 22, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1 }}
          >
            Luna
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7AB585" }} />
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>altijd er</span>
          </div>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setShowCrisis(true)}
            style={{
              fontSize: 13, fontWeight: 500, color: "#D14D4D",
              background: "none", border: "none", cursor: "pointer", padding: "4px 0",
            }}
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
        className="flex-1 overflow-y-auto"
        style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 12 }}
      >
        {isEmpty && !typing && (
          <div
            className="flex flex-col items-center fade-in"
            style={{ marginTop: 40 }}
          >
            <Orb size="md" />
            <div
              className="bubble-luna"
              style={{ marginTop: 32, maxWidth: 320 }}
            >
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
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div
        style={{
          padding: "12px 12px",
          paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div
          className="glass"
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 8,
            borderRadius: 28,
            padding: "12px 16px",
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
              border: "none", cursor: input.trim() ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s",
            }}
          >
            <ArrowUp size={18} style={{ color: "#1A0E08" }} strokeWidth={2.5} />
          </button>
        </div>
      </div>

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
              background: "#14141E",
              borderRadius: "28px 28px 0 0",
              padding: "32px 24px calc(40px + env(safe-area-inset-bottom, 0px))",
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 4 }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", margin: "0 auto 24px" }} />
            </div>
            <h3
              className="font-display"
              style={{ fontSize: 24, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.02em" }}
            >
              Dit gesprek wissen?
            </h3>
            <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 24 }}>
              Dit kan niet ongedaan gemaakt worden.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="btn btn-ghost"
                style={{ fontSize: 14, flex: 1 }}
              >
                Annuleren
              </button>
              <button
                onClick={clearConversation}
                className="btn"
                style={{
                  flex: 1, fontSize: 14, fontWeight: 500,
                  background: "var(--crisis-soft)",
                  border: "1px solid var(--crisis-border)",
                  color: "#D14D4D",
                  borderRadius: "var(--r-pill)",
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
