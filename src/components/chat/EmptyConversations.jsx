import { MessageCircle } from "lucide-react";

export default function EmptyConversations({ title = "Nog geen gesprekken", sub = "Start je eerste gesprek met Luna." }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}
      >
        <MessageCircle className="h-6 w-6" style={{ color: "var(--text-3)" }} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-[15px] font-semibold" style={{ color: "var(--text-2)" }}>{title}</p>
        <p className="text-[13px] mt-1 px-6" style={{ color: "var(--text-3)" }}>{sub}</p>
      </div>
    </div>
  );
}