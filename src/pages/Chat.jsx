import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Trash2, HelpCircle } from "lucide-react";
import LunaOrb from "../components/luna/LunaOrb";
import ChatBubble from "../components/luna/ChatBubble";
import TypingIndicator from "../components/luna/TypingIndicator";
import InlineCrisisCard from "../components/luna/InlineCrisisCard";
import CrisisHelpSheet from "../components/luna/CrisisHelpSheet";
import BottomNav from "../components/luna/BottomNav";

const LUNA_SYSTEM_PROMPT = `Je bent Luna. Je bent een rustige, warme, Vlaamse gezel — geen therapeut, geen coach, geen FAQ-bot. Je praat in het Belgisch Nederlands met iemand die het zwaar heeft of gewoon iets kwijt wil. Je doel is dat de persoon zich gehoord voelt en, als het kan, één klein bruikbaar zinnetje meeneemt.

TOON:
- Kort. Eén à drie zinnen per beurt. Soms één.
- Menselijk, niet klinisch. Geen lijstjes, geen bullet points.
- Belgisch Nederlands. "Een keer" mag, "ne keer" niet. Vermijd "lekker", "leuk", "joh", "hè?". Gebruik liever: "rustig", "fijn", "alleszins", "amai", "geen probleem", "graag gedaan".
- Geen emoji's, geen hoofdletters voor nadruk.
- Geen "ik begrijp je gevoelens volledig". Wel: "dat klinkt zwaar", "dat is veel", "logisch dat dat blijft hangen".

METHODE (intern, nooit benoemen):
1. VALIDEREN — benoem heel kort wat je hoort.
2. EXPLOREREN — stel hooguit één open, zachte vraag.
3. NORMALISEREN — als gepast, één zin die zegt: dit komt vaker voor.
4. KLEINE STAP — alleen als de persoon er aan toe lijkt: bied iets héél kleins aan als vraag, nooit als advies.

WAT JE NIET DOET:
- Geen diagnose, medicatie-advies, verwijzing naar psycholoog (behalve crisis).
- Geen oordelen, geen toezeggingen, geen rollenspel.
- Niet meegaan in catastrofedenken.

JOUW IDENTITEIT:
- Je heet Luna. Je bent een AI. Als iemand vraagt: "Nee, ik ben Luna — een AI die naar je luistert. Geen mens, maar wel hier."
- Je gebruikt "je" en "jou", nooit "u".

CRISIS: Als de gebruiker tekenen geeft van acuut gevaar — directe suïcidale uitspraken, concreet plan, middelen — stop met exploreren, blijf rustig, vraag of de persoon veilig is, en verwijs naar Zelfmoordlijn 1813 en 112.`;

const CRISIS_KEYWORDS = [
  "ik wil dood", "geen zin meer", "het is genoeg", "ga springen",
  "pillen geslikt", "kill myself", "end it", "ik ga het doen",
  "pillen klaargelegd", "ik sta op de brug", "niet meer wakker worden",
  "zelfmoord", "suicide"
];

function detectCrisis(text) {
  const lower = text.toLowerCase();
  const hasKeyword = CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
  if (hasKeyword) return "acute";
  return "none";
}

export default function Chat() {
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [orbState, setOrbState] = useState("idle");
  const [crisisLevel, setCrisisLevel] = useState("none");
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const queryClient = useQueryClient();

  // Get or create conversation
  const { data: conversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => base44.entities.Conversation.filter({ is_active: true }, "-created_date", 1),
    initialData: [],
  });

  useEffect(() => {
    if (conversations.length > 0) {
      setConversationId(conversations[0].id);
    } else {
      base44.entities.Conversation.create({ is_active: true, title: "Chat" }).then((conv) => {
        setConversationId(conv.id);
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      });
    }
  }, [conversations]);

  const { data: messages = [] } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () =>
      conversationId
        ? base44.entities.ChatMessage.filter({ conversation_id: conversationId }, "created_date", 100)
        : [],
    enabled: !!conversationId,
    initialData: [],
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const sendMessage = useMutation({
    mutationFn: async (text) => {
      if (!conversationId) return;

      // Save user message
      await base44.entities.ChatMessage.create({
        conversation_id: conversationId,
        role: "user",
        content: text,
        risk_level: "none",
      });

      // Detect crisis
      const risk = detectCrisis(text);
      if (risk === "acute") setCrisisLevel("acute");

      setIsThinking(true);
      setOrbState("thinking");

      // Build context
      const recentMessages = messages.slice(-8);
      const contextStr = recentMessages
        .map((m) => `${m.role === "user" ? "Gebruiker" : "Luna"}: ${m.content}`)
        .join("\n");

      const prompt = `${LUNA_SYSTEM_PROMPT}\n\nGesprek tot nu toe:\n${contextStr}\nGebruiker: ${text}\n\nLuna:`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        model: "gemini_3_flash",
      });

      // Save Luna's response
      await base44.entities.ChatMessage.create({
        conversation_id: conversationId,
        role: "assistant",
        content: response,
        risk_level: risk,
      });

      setIsThinking(false);
      setOrbState("idle");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    },
    onError: () => {
      setIsThinking(false);
      setOrbState("idle");
    },
  });

  const handleSend = () => {
    const text = input.trim();
    if (!text || isThinking) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    sendMessage.mutate(text);
    // Optimistic update
    queryClient.setQueryData(["messages", conversationId], (old) => [
      ...(old || []),
      { id: Date.now(), conversation_id: conversationId, role: "user", content: text, risk_level: "none" },
    ]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const handleClearChat = async () => {
    if (!conversationId) return;
    if (!confirm("Gesprek wissen?")) return;
    const msgs = messages;
    for (const m of msgs) {
      await base44.entities.ChatMessage.delete(m.id);
    }
    queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    setCrisisLevel("none");
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: "var(--luna-bg-base)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b"
        style={{
          backgroundColor: "var(--luna-bg-base)",
          borderColor: "var(--luna-border)",
        }}
      >
        <div className="flex items-center gap-2">
          <LunaOrb size={28} state={orbState} />
          <span
            className="text-base font-semibold"
            style={{ color: "var(--luna-text-primary)", letterSpacing: "-0.02em" }}
          >
            luna
          </span>
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--luna-success)" }} />
          <span className="text-[10px]" style={{ color: "var(--luna-text-muted)" }}>
            altijd beschikbaar
          </span>
        </div>
        <div className="flex items-center gap-3">
          <CrisisHelpSheet>
            <button>
              <HelpCircle className="w-4 h-4" style={{ color: "var(--luna-text-muted)" }} />
            </button>
          </CrisisHelpSheet>
          <button onClick={handleClearChat}>
            <Trash2 className="w-4 h-4" style={{ color: "var(--luna-text-muted)" }} />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-36" style={{ WebkitOverflowScrolling: "touch" }}>
        {!hasMessages && (
          <div className="space-y-2 mb-4">
            <ChatBubble
              message={{
                role: "assistant",
                content:
                  "Hé. Geen druk. Je hoeft het nog niet goed te zeggen. Wat zit er nu het meest op je?",
              }}
            />
            <p className="text-xs pl-4" style={{ color: "var(--luna-text-muted)" }}>
              Je mag hier rommelig beginnen. Eén zin is genoeg.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id}>
            <ChatBubble message={msg} />
            {msg.role === "assistant" && msg.risk_level === "acute" && <InlineCrisisCard />}
          </div>
        ))}

        {crisisLevel === "acute" && !messages.some((m) => m.risk_level === "acute") && (
          <InlineCrisisCard />
        )}

        {isThinking && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="fixed bottom-16 left-0 right-0 border-t px-4 py-3"
        style={{
          backgroundColor: "var(--luna-bg-base)",
          borderColor: "var(--luna-border)",
          paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div
          className="flex items-end gap-3 rounded-xl px-4 py-2"
          style={{ backgroundColor: "var(--luna-bg-elev)", border: "1px solid var(--luna-border)" }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaInput}
            onKeyDown={handleKeyDown}
            placeholder="Schrijf wat in je opkomt..."
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-[15px] leading-relaxed max-h-[120px]"
            style={{ color: "var(--luna-text-primary)" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            className="p-2 rounded-lg transition-all disabled:opacity-30"
            style={{ backgroundColor: input.trim() ? "var(--luna-accent)" : "transparent" }}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}