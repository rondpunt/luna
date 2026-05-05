import { Link } from "react-router-dom";
import { MessageCircle, BookHeart, ChevronRight } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { nl } from "date-fns/locale";

/**
 * Recente activiteit — max 3 items, alleen echte data.
 */
function formatWhen(d) {
  if (!d) return "";
  const date = typeof d === "string" ? parseISO(d) : d;
  if (!isValid(date)) return "";
  const today = new Date();
  const sameDay = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
  return sameDay
    ? `Vandaag · ${format(date, "HH:mm")}`
    : format(date, "EEE d MMM", { locale: nl });
}

function buildItems(conversations, entries) {
  const convItems = conversations.map((c) => ({
    key: `c-${c.id}`,
    kind: "conversation",
    title: c.title || "Gesprek met Luna",
    sub: c.folderName || "Open gesprek",
    when: c.last_message_at || c.updated_date || c.created_date,
    to: `/chat?conv=${c.id}${c.folderId ? `&folder=${c.folderId}` : ""}`,
  }));
  const journalItems = entries.map((e) => ({
    key: `j-${e.id}`,
    kind: "journal",
    title: e.title?.trim() || "Dagboek",
    sub: (e.content || "").slice(0, 60).trim() || "Vandaag",
    when: e.updated_date || e.created_date,
    to: "/diary",
  }));
  return [...convItems, ...journalItems]
    .filter((i) => i.when)
    .sort((a, b) => Date.parse(String(b.when)) - Date.parse(String(a.when)))
    .slice(0, 3);
}

export default function RecentActivityList({ conversations = [], entries = [] }) {
  const items = buildItems(conversations, entries);
  if (items.length === 0) return null;

  return (
    <div className="list-group">
      {items.map((it) => {
        const Icon = it.kind === "conversation" ? MessageCircle : BookHeart;
        const accent = it.kind === "conversation" ? "#C25A32" : "#4A9EFF";
        return (
          <Link key={it.key} to={it.to} className="list-row gap-3" style={{ minHeight: 64 }}>
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ background: `${accent}14` }}
            >
              <Icon className="h-[18px] w-[18px]" style={{ color: accent }} strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-medium truncate leading-tight" style={{ color: "var(--text)" }}>
                {it.title}
              </p>
              <p className="text-[12.5px] mt-1 truncate" style={{ color: "var(--text-3)" }}>
                {formatWhen(it.when)} · {it.sub}
              </p>
            </div>
            <ChevronRight className="h-[18px] w-[18px] shrink-0" style={{ color: "var(--text-4)" }} strokeWidth={1.8} />
          </Link>
        );
      })}
    </div>
  );
}