import { useState } from "react";
import SectionCard from "@/components/nora/SectionCard";

const starterPrompts = [
  "I’m feeling overwhelmed and I don’t know why",
  "Help me sort through what I’m feeling",
  "Can you help me slow my thoughts down?",
  "I need a practical next step",
];

const tools = [
  "Save to memory",
  "Generate coping plan",
  "Summarize what I’m feeling",
  "Reframe this thought",
  "What should I do next?",
];

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey. I’m here with you. What feels heaviest right now?" },
  ]);

  const send = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }, { role: "assistant", content: "There’s a lot sitting on your chest. Want to untangle the feeling first, or focus on what to do next?" }]);
    setInput("");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-36 pt-6 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Chat</p>
          <h1 className="text-3xl font-semibold tracking-tight">Private emotional support, anytime.</h1>
        </div>
        <div className="hidden gap-2 md:flex">
          {['Shorter', 'Deeper', 'Practical'].map((style) => (
            <button key={style} className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">{style}</button>
          ))}
        </div>
      </div>

      <div className="grid flex-1 gap-4 lg:grid-cols-[280px_1fr]">
        <SectionCard className="hidden lg:block">
          <p className="text-sm font-medium text-foreground">Conversations</p>
          <input className="mt-4 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none" placeholder="Search conversations" />
          <div className="mt-4 space-y-2">
            {['Work pressure spiral', 'Couldn’t sleep again', 'Relationship worries', 'Feeling disconnected'].map((item, index) => (
              <div key={item} className={`rounded-2xl p-3 text-sm ${index === 0 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                {item}
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard className="flex min-h-[70vh] flex-col justify-between p-0 overflow-hidden">
          <div className="border-b border-border/60 px-5 py-4">
            <p className="text-sm font-medium text-foreground">Tonight’s conversation</p>
            <p className="text-sm text-muted-foreground">Emotionally intelligent support with short, steady replies.</p>
          </div>

          <div className="flex-1 space-y-4 px-5 py-5">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-[24px] px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border/60 px-4 py-4">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {starterPrompts.map((prompt) => (
                <button key={prompt} onClick={() => setInput(prompt)} className="shrink-0 rounded-full border border-border bg-background px-4 py-2 text-xs text-muted-foreground">{prompt}</button>
              ))}
            </div>
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {tools.map((tool) => (
                <button key={tool} className="shrink-0 rounded-full bg-secondary px-3 py-2 text-xs text-foreground">{tool}</button>
              ))}
            </div>
            <div className="flex items-end gap-3 rounded-[28px] border border-border bg-background p-3 shadow-sm">
              <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tell Nora what’s on your mind..." rows={1} className="min-h-[52px] flex-1 resize-none bg-transparent px-2 py-3 text-sm outline-none" />
              <button onClick={send} className="rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Send</button>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}