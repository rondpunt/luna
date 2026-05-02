import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { AnimatePresence, motion } from "framer-motion";
import { Send, RotateCcw } from "lucide-react";
import LunaOrb from "../components/luna/LunaOrb";
import ChatBubble from "../components/luna/ChatBubble";
import TypingIndicator from "../components/luna/TypingIndicator";
import CrisisModal from "../components/luna/CrisisModal";
import BottomNav from "../components/luna/BottomNav";

const SYSTEM_PROMPT = `Je bent Luna. Geen chatbot, geen robot — gewoon een rustige aanwezigheid die er is voor de persoon voor je.

Je spreekt zoals een goede vriend zou spreken: direct, warm, zonder omwegen. Je klinkt NOOIT als een app of een assistent.

STEM & TOON:
- Informeel Belgisch-Nederlands. Zeg "je/jou", nooit "u".
- Kort en raak. Geen lange uitleg, geen opsommingen, geen bold, geen emoji's.
- Soms is een halve zin krachtiger dan een volledige. Dat mag.
- Varieer je openingszin. Begin NOOIT twee keer op dezelfde manier.
- Je mag stilte laten: "Mm." of "Ja." of "Dat klinkt zwaar." zijn ook antwoorden.

WAT JE NOOIT DOET:
- Zeg nooit "Ik begrijp hoe je je voelt" of "Dat klinkt lastig" of "Goed bezig" — dat zijn dode woorden.
- Geef nooit advies tenzij de gebruiker letterlijk vraagt "wat kan ik doen?" of "hoe pak ik dit aan?".
- Herhaal niet wat de gebruiker zei in andere woorden als bevestiging. Dat voelt nep.
- Stel nooit meer dan één vraag tegelijk.

HOE JE REAGEERT:
Voel wat de onderstroom is — niet de woorden, maar wat eronder zit. Benoem dat in één zin. Daarna eventueel één open vraag, maar alleen als het echt iets toevoegt. Soms is benoemen genoeg.

Voorbeelden van hoe Luna praat:
User: "Ik ben zo moe maar ik kan niet slapen."
Luna: "Je hoofd gaat maar door terwijl je lijf al lang wil stoppen. Wanneer is dat begonnen?"

User: "Ik weet niet meer wat ik wil."
Luna: "Die leegte is ook een gevoel. Wat was het laatste waarvan je dacht: ja, dit voelt goed?"

User: "Het gaat wel."
Luna: "Gaat wel is soms net genoeg. En soms net niet."

User: "Ik heb ruzie gehad met mijn ma."
Luna: "Die combinatie van boos en verdrietig tegelijk is het zwaarste. Wat raakte je het meest?"

User: "Ik voel me eenzaam."
Luna: "In een vol leven of in een leeg weekend?"

User: "Ik weet het ook niet meer."
Luna: "Dat hoeft ook niet. Vertel me gewoon wat er door je hoofd gaat."

CRISIS PROTOCOL (OVERRIDE):
Als de gebruiker impliceert dat hij/zij zichzelf pijn wil doen, niet meer wil leven, of in levensgevaar is, NEGEER je alle bovenstaande regels en antwoord je EXACT met deze tekst:
"Dit is te zwaar om alleen te dragen. Ik wil dat je nu belt: Zelfmoordlijn 0800 32 123 of Tele-Onthaal 106 (beide gratis, 24/7 en anoniem). Ik blijf hier als je wilt, maar je hebt nu een echte stem nodig."`;

const CRISIS_KEYWORDS = ["zelfmoord", "suïcide", "dood wil", "niet meer willen leven", "mezelf pijn", "leven beëindigen", "niet meer wil leven"];

// Varied opening messages — rotates on new conversation
const OPENINGS = [
  "Hé. Wat speelt er bij je?",
  "Ik ben er. Wat wil je kwijt?",
  "Vertel. Hoe gaat het echt?",
  "Hé, ik luister. Wat is er?",
  "Wat leeft er bij je vandaag?",
];

function detectCrisis(text) {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
}

function getRandomOpening() {
  return OPENINGS[Math.floor(Math.random() * OPENINGS.length)];
}

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => [
    { role: "assistant", content: getRandomOpening() }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [orbState, setOrbState] = useState("idle");
  const [showCrisis, setShowCrisis] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isThinking) return;

    if (detectCrisis(text)) setShowCrisis(true);

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setIsThinking(true);
    setOrbState("thinking");

    const historyText = newMessages
      .slice(-12)
      .map(m => `${m.role === "user" ? "Gebruiker" : "Luna"}: ${m.content}`)
      .join("\n");

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `${SYSTEM_PROMPT}\n\n---\nGesprekshistorie:\n${historyText}\n---\n\nLuna:`,
      model: "claude_sonnet_4_6",
    });

    const reply = typeof res === "string" ? res : res?.text || "";
    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    setIsThinking(false);
    setOrbState("warm");
    setTimeout(() => setOrbState("idle"), 800);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetConversation = () => {
    setMessages([{ role: "assistant", content: getRandomOpening() }]);
    setInput("");
    setOrbState("idle");
  };

  return (
    <div
      className="flex flex-col h-screen"
      style={{ background: "linear-gradient(160deg, #f0f4ff 0%, #f5f7ff 60%, #eef2fb 100%)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{
          background: "rgba(245,248,255,0.97)",
          borderBottom: "1px solid rgba(180,190,220,0.22)",
          backdropFilter: "blur(20px)",
        }}
      >
        <LunaOrb size={30} state={orbState} />
        <div className="flex-1">
          <p className="text-sm font-semibold leading-tight" style={{ color: "#1a2340", fontFamily: "'DM Sans', sans-serif" }}>
            Luna
          </p>
          <p className="text-[11px]" style={{ color: isThinking ? "#1e7a8c" : "#9aa5be", fontFamily: "'DM Sans', sans-serif" }}>
            {isThinking ? "aan het nadenken..." : "online"}
          </p>
        </div>
        <button
          onClick={resetConversation}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{ background: "rgba(180,190,220,0.15)" }}
          title="Nieuw gesprek"
        >
          <RotateCcw className="w-3.5 h-3.5" style={{ color: "#9aa5be" }} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ paddingBottom: 130 }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <ChatBubble role={msg.role} content={msg.content} />
            </motion.div>
          ))}
        </AnimatePresence>
        {isThinking && <TypingIndicator />}

        {/* Orb anchor */}
        <div className="flex flex-col items-center gap-2 mt-8 mb-2">
          <LunaOrb size={48} state={orbState} />
          <p className="text-[11px]" style={{ color: "#b0bace", fontFamily: "'DM Sans', sans-serif" }}>
            {orbState === "thinking" ? "Luna denkt na..." : "Luna is hier voor je"}
          </p>
        </div>

        <div ref={bottomRef} />
      </div>

      {/* Quick prompts — shown only at start */}
      {messages.length === 1 && (
        <div
          className="shrink-0 px-4 pb-2 flex gap-2 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {["Ik voel me overweldigd", "Ik slaap slecht", "Ik ben moe van alles", "Ik weet niet wat ik voel"].map((p) => (
            <button
              key={p}
              onClick={() => { setInput(p); setTimeout(() => textareaRef.current?.focus(), 50); }}
              className="shrink-0 px-3 py-2 rounded-full text-xs font-medium transition-all active:scale-95"
              style={{
                background: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(180,190,220,0.30)",
                color: "#5a6a8a",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 2px 6px rgba(100,140,220,0.07)",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        className="shrink-0 px-4 pt-3"
        style={{
          paddingBottom: "calc(72px + env(safe-area-inset-bottom, 0px))",
          background: "rgba(245,248,255,0.97)",
          borderTop: "1px solid rgba(180,190,220,0.20)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-end gap-2 max-w-md mx-auto">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            placeholder="Schrijf hier..."
            className="flex-1 resize-none rounded-2xl px-4 py-3 text-sm outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.92)",
              border: "1px solid rgba(180,190,220,0.30)",
              color: "#1a2340",
              fontFamily: "'DM Sans', sans-serif",
              maxHeight: 120,
              lineHeight: 1.5,
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isThinking}
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90 disabled:opacity-35"
            style={{
              background: input.trim() && !isThinking
                ? "linear-gradient(135deg, #1e7a8c, #1a6678)"
                : "rgba(180,190,220,0.30)",
              boxShadow: input.trim() && !isThinking ? "0 4px 12px rgba(30,122,140,0.28)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            <Send className="w-4 h-4" style={{ color: input.trim() && !isThinking ? "white" : "#9aa5be" }} />
          </button>
        </div>
        <p className="text-center mt-2 text-[10px]" style={{ color: "#c0c8d8", fontFamily: "'DM Sans', sans-serif" }}>
          In nood? Bel 0800 32 123 of 106
        </p>
      </div>

      <CrisisModal isOpen={showCrisis} onClose={() => setShowCrisis(false)} />
      <BottomNav />
    </div>
  );
}