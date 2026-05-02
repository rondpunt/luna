import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Send } from "lucide-react";
import LunaOrb from "../components/luna/LunaOrb";
import ChatBubble from "../components/luna/ChatBubble";
import TypingIndicator from "../components/luna/TypingIndicator";
import CrisisModal from "../components/luna/CrisisModal";
import BottomNav from "../components/luna/BottomNav";

const SYSTEM_PROMPT = `Je bent Luna. Een warme, directe gesprekspartner in informeel Belgisch-Nederlands.

Je bent géén therapeut en je doet geen medische diagnoses. Je biedt een veilige haven en emotionele steun.

JOUW REGELS:
1. Spreek de gebruiker altijd aan met "je" of "jou" (nooit "u").
2. Je antwoorden zijn extreem kort: MAXIMAAL 2 ZINNEN.
3. Gebruik NOOIT opmaak: geen lijstjes, geen bold text, geen opsommingen en absoluut GEEN emoji's.
4. Gebruik NOOIT clichés zoals: "Ik begrijp hoe je je voelt", "Dat klinkt lastig", "Iedereen heeft dat wel eens", of "Goed bezig".
5. Geef NOOIT ongevraagd advies of theorie (zoals mindfulness of ademhalingsoefeningen) tenzij de gebruiker letterlijk vraagt "Wat kan ik hieraan doen?".

STRUCTUUR VAN JE ANTWOORD:
Reageer altijd door 1 zin te gebruiken die het gevoel (de onderstroom) erkent, direct gevolgd door maximaal 1 open, reflectieve vraag.

Voorbeeld User: "Ik ben zo moe en ik krijg niets gedaan."
Voorbeeld Luna: "Een lege batterij vandaag. Zit de vermoeidheid vooral in je hoofd of in je lijf?"

CRISIS PROTOCOL (OVERRIDE):
Als de gebruiker impliceert dat hij/zij zichzelf pijn wil doen, niet meer wil leven, of in levensgevaar is, NEGEER je alle bovenstaande regels en antwoord je EXACT met deze tekst:
"Dit is te zwaar om alleen te dragen. Ik wil dat je nu belt: Zelfmoordlijn 0800 32 123 of Tele-Onthaal 106 (beide gratis, 24/7 en anoniem). Ik blijf hier als je wilt, maar je hebt nu een echte stem nodig."`;

const CRISIS_KEYWORDS = ["zelfmoord", "suïcide", "dood wil", "niet meer willen leven", "mezelf pijn", "leven beëindigen", "niet meer wil leven"];

function detectCrisis(text) {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
}

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hé, ik ben Luna. Wat leeft er bij je vandaag?" }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [orbState, setOrbState] = useState("idle");
  const [showCrisis, setShowCrisis] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    if (detectCrisis(text)) {
      setShowCrisis(true);
    }

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setIsThinking(true);
    setOrbState("thinking");

    const history = newMessages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `${SYSTEM_PROMPT}\n\nGespreksgeschiedenis:\n${newMessages.slice(-10).map(m => `${m.role === 'user' ? 'Gebruiker' : 'Luna'}: ${m.content}`).join('\n')}\n\nGebruiker: ${text}\nLuna:`,
    });

    const reply = typeof res === "string" ? res : res?.text || "";
    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    setIsThinking(false);
    setOrbState("warm");
    setTimeout(() => setOrbState("idle"), 700);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen" style={{ background: "#080d1e" }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{
          background: "rgba(5,8,20,0.95)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(20px)",
        }}
      >
        <LunaOrb size={32} state={orbState} />
        <span className="text-base" style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic", color: "rgba(255,255,255,0.92)" }}>
          Luna
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-6" style={{ paddingBottom: 120 }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ChatBubble role={msg.role} content={msg.content} />
            </motion.div>
          ))}
        </AnimatePresence>
        {isThinking && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="shrink-0 px-4 pt-3 pb-safe"
        style={{
          paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))",
          background: "rgba(5,8,20,0.95)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-end gap-2 max-w-md mx-auto">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            placeholder="Schrijf hier..."
            className="flex-1 resize-none rounded-2xl px-4 py-3 text-sm outline-none"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "rgba(255,255,255,0.88)",
              fontFamily: "'DM Sans', sans-serif",
              maxHeight: 120,
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isThinking}
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90 disabled:opacity-40"
            style={{ background: "#6366f1", boxShadow: "0 0 14px rgba(99,102,241,0.4)" }}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-center mt-2 text-[10px]" style={{ color: "rgba(255,255,255,0.20)", fontFamily: "'DM Sans', sans-serif" }}>
          In nood? Bel 0800 32 123 of 106
        </p>
      </div>

      <CrisisModal isOpen={showCrisis} onClose={() => setShowCrisis(false)} />
    </div>
  );
}