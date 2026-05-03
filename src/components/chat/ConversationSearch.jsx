import { Search, X } from "lucide-react";

export default function ConversationSearch({ value, onChange, placeholder = "Zoek in gesprekken…" }) {
  return (
    <div
      className="flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5"
      style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}
    >
      <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-3)" }} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-[14.5px] outline-none"
        style={{ color: "var(--text)" }}
      />
      {value && (
        <button onClick={() => onChange("")} className="shrink-0 btn-press">
          <X className="h-4 w-4" style={{ color: "var(--text-3)" }} />
        </button>
      )}
    </div>
  );
}