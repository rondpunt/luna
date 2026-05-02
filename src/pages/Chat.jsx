import { useState } from "react";
import { Phone, Image as ImageIcon, Mic } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { t } from "@/lib/i18n";
import NoraLogo from "@/components/nora/NoraLogo";

export default function Chat() {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: t.chat.welcomeMsg },
  ]);

  const send = async () => {
    if (!input.trim() || sending) return;
    const next = [...messages, { role: "user", content: input }];
    setMessages(next);
    setInput("");
    setSending(true);
    try {
      const res = await base44.functions.invoke("noraChat", { messages: next, style: "gentle" });
      const reply =
        typeof res?.data?.reply === "string"
          ? res.data.reply
          : res?.data?.reply?.content || t.chat.fallbackMsg;
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: t.chat.fallbackMsg }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col">
      <div className="flex items-center justify-between px-5 py-3">
        <div className="w-8" />
        <div className="flex items-center gap-2">
          <NoraLogo className="h-6 w-6" />
          <span className="text-sm font-semibold text-[#3d1f12]">Nora</span>
        </div>
        <button className="flex h-9 w-9 items-center justify-center rounded-full">
          <Phone className="h-5 w-5 text-[#3d1f12]" />
        </button>
      </div>

      <div className="flex-1 space-y-4 px-5 py-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
            {m.role === "assistant" && <NoraLogo className="mt-1 h-6 w-6 shrink-0" />}
            <div
              className={`max-w-[80%] whitespace-pre-wrap text-sm leading-6 ${
                m.role === "user"
                  ? "rounded-2xl bg-[#fbe4d6] px-4 py-2.5 text-[#3d1f12]"
                  : "px-1 text-[#3d1f12]"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex items-center gap-2 px-1 text-sm text-muted-foreground">
            <NoraLogo className="h-6 w-6" />
            Nora typt…
          </div>
        )}
      </div>

      <div className="sticky bottom-0 px-4 pb-4 pt-2" style={{ background: "linear-gradient(180deg, transparent 0%, #fbeee5 30%)" }}>
        <div
          className="flex items-center gap-2 rounded-full bg-white px-2 py-1.5"
          style={{ border: "1px solid rgba(194,90,50,0.18)" }}
        >
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fbeee5]">
            <ImageIcon className="h-4 w-4 text-[#9c6a52]" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                send();
              }
            }}
            placeholder={t.chat.placeholder}
            className="flex-1 bg-transparent px-2 text-sm outline-none"
          />
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fbeee5]">
            <Mic className="h-4 w-4 text-[#9c6a52]" />
          </button>
        </div>
      </div>
    </div>
  );
}