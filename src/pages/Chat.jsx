import { useState } from "react";
import { base44 } from "@/api/base44Client";
import SectionCard from "@/components/nora/SectionCard";
import { t } from "@/lib/i18n";

export default function Chat() {
  const [input, setInput] = useState("");
  const [style, setStyle] = useState("gentle");
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
      const res = await base44.functions.invoke("noraChat", { messages: next, style });
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
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-36 pt-6 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{t.chat.header}</p>
          <h1 className="text-3xl font-semibold tracking-tight">{t.chat.title}</h1>
        </div>
        <div className="hidden gap-2 md:flex">
          {t.chat.styles.map((label, i) => {
            const key = ["gentle", "deeper", "practical"][i] || "gentle";
            const active = style === key;
            return (
              <button
                key={label}
                onClick={() => setStyle(key)}
                className="rounded-full px-4 py-2 text-sm transition-all"
                style={{
                  background: active ? "#3f8a55" : "white",
                  color: active ? "white" : "#1a3326",
                  border: active ? "1px solid #3f8a55" : "1px solid rgba(63,138,85,0.20)",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid flex-1 gap-4 lg:grid-cols-[280px_1fr]">
        <SectionCard className="hidden lg:block">
          <p className="text-sm font-medium text-foreground">{t.chat.sidebarTitle}</p>
          <input
            className="mt-4 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none"
            placeholder={t.chat.searchPlaceholder}
          />
        </SectionCard>

        <SectionCard className="flex min-h-[70vh] flex-col justify-between overflow-hidden p-0">
          <div className="border-b border-border/60 px-5 py-4">
            <p className="text-sm font-medium text-foreground">{t.chat.tonightTitle}</p>
            <p className="text-sm text-muted-foreground">{t.chat.tonightNote}</p>
          </div>

          <div className="flex-1 space-y-4 px-5 py-5">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-[24px] px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="rounded-[24px] bg-secondary px-4 py-3 text-sm text-muted-foreground">
                  Nora is aan het typen…
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border/60 px-4 py-4">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {t.chat.starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="shrink-0 rounded-full border border-border bg-background px-4 py-2 text-xs text-muted-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {t.chat.tools.map((tool) => (
                <button
                  key={tool}
                  className="shrink-0 rounded-full bg-secondary px-3 py-2 text-xs text-foreground"
                >
                  {tool}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-3 rounded-[28px] border border-border bg-background p-3 shadow-sm">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder={t.chat.placeholder}
                rows={1}
                className="min-h-[52px] flex-1 resize-none bg-transparent px-2 py-3 text-sm outline-none"
              />
              <button
                onClick={send}
                disabled={sending}
                className="rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                {t.cta.send}
              </button>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}