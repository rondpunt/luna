import { Bot, UserRound, Brain, AlertTriangle } from "lucide-react";

function Pill({ children }) {
  return <span className="rounded-full border border-orange-300/20 bg-orange-300/10 px-3 py-1 text-xs text-orange-100">{children}</span>;
}

function MessageBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <Bot className="mt-2 h-4 w-4 text-white/35" />}
      <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${isUser ? "bg-orange-400/15 text-orange-50" : "bg-white/[0.06] text-white/75"}`}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p className="mt-2 text-[10px] text-white/30">{new Date(message.created_date).toLocaleString("nl-BE")}</p>
      </div>
      {isUser && <UserRound className="mt-2 h-4 w-4 text-orange-200/70" />}
    </div>
  );
}

export default function AdminUserDetail({ detail, loading, onAnalyze }) {
  if (loading) return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-sm text-white/45">Profiel laden…</div>;
  if (!detail) return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-sm text-white/45">Selecteer een user.</div>;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/35">User profiel</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">{detail.user.full_name || "Naam onbekend"}</h2>
            <p className="text-sm text-white/45">{detail.user.email}</p>
          </div>
          <button onClick={onAnalyze} className="rounded-full bg-orange-400 px-4 py-2 text-sm font-medium text-black hover:bg-orange-300">
            AI profiel vernieuwen
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Chats", detail.stats.userMessages],
            ["Check-ins", detail.stats.checkins],
            ["Dagboek", detail.stats.diaryEntries],
            ["Gem. mood", detail.stats.averageMood || "—"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-white/[0.045] p-3">
              <p className="text-xl font-semibold text-white">{value}</p>
              <p className="text-xs text-white/40">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-medium text-white">Gekozen onboardingwoorden</p>
          <div className="flex flex-wrap gap-2">
            {detail.selectedTags.length ? detail.selectedTags.map((tag) => <Pill key={tag}>{tag}</Pill>) : <span className="text-sm text-white/35">Geen woorden gekozen.</span>}
          </div>
        </div>
      </div>

      {detail.aiProfile && (
        <div className="rounded-2xl border border-orange-300/20 bg-orange-300/[0.06] p-5">
          <div className="mb-3 flex items-center gap-2">
            <Brain className="h-5 w-5 text-orange-200" />
            <p className="font-semibold text-white">AI profiel</p>
          </div>
          <p className="text-sm leading-6 text-white/75">{detail.aiProfile.summary}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              ["Patronen", detail.aiProfile.emotionalPatterns],
              ["Behoeftes", detail.aiProfile.needs],
              ["Product hooks", detail.aiProfile.productHooks],
              ["Risicosignalen", detail.aiProfile.riskSignals],
            ].map(([title, items]) => (
              <div key={title}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">{title}</p>
                <ul className="space-y-1 text-sm text-white/65">
                  {(items || []).map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-white/10 bg-black/20 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-orange-200" />
            <p className="text-xs leading-5 text-white/45">Geen diagnose. Alleen admin-observaties op basis van appdata.</p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/[0.04]">
        <div className="border-b border-white/10 px-5 py-4">
          <p className="font-semibold text-white">Volledige chatlog</p>
          <p className="text-xs text-white/40">Per gesprek, chronologisch</p>
        </div>
        <div className="max-h-[720px] space-y-5 overflow-y-auto p-5">
          {detail.conversations.length ? detail.conversations.map((conversation) => (
            <div key={conversation.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="mb-3 text-sm font-semibold text-white">{conversation.title}</p>
              <div className="space-y-3">
                {conversation.messages.map((message) => <MessageBubble key={message.id} message={message} />)}
              </div>
            </div>
          )) : <p className="text-sm text-white/35">Nog geen chats.</p>}
        </div>
      </div>
    </div>
  );
}