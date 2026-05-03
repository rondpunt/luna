import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, MoreHorizontal, Pin } from "lucide-react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import RenameForm from "./RenameForm";

/**
 * One conversation row. LibreChat-style with hover actions on desktop, long-press on mobile.
 */
export default function ConvoItem({
  conv,
  folder,        // optional — if known, used for icon color
  compact = false,
  showQuickMove = false,
  onOpenMenu,
  onRename,
  onQuickMove,
  isRenaming,
  onCancelRename,
  to,
}) {
  const [hover, setHover] = useState(false);
  const longPressTimer = useRef(null);

  const accent = folder?.color || "#C25A32";
  const padY = compact ? "py-2" : "py-3";

  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => onOpenMenu?.(conv), 500);
  };
  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const innerContent = (
    <div
      className={`flex items-center gap-3 px-3 ${padY} rounded-xl transition-colors`}
      style={{ background: hover ? "var(--bg-hover)" : "transparent" }}
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ background: `${accent}18` }}
      >
        <MessageCircle className="h-4 w-4" style={{ color: accent }} strokeWidth={1.7} />
      </div>

      <div className="flex-1 min-w-0">
        {isRenaming ? (
          <RenameForm
            initialValue={conv.title}
            onSave={(v) => onRename(v)}
            onCancel={onCancelRename}
          />
        ) : (
          <div className="flex items-center gap-1.5">
            {conv.pinned && <Pin className="h-3 w-3 shrink-0" style={{ color: accent }} fill={accent} />}
            <p className="text-[14.5px] font-medium truncate" style={{ color: "var(--text)" }}>
              {conv.title || "Naamloos gesprek"}
            </p>
          </div>
        )}
        {!isRenaming && !compact && (
          <div className="flex items-center gap-2 mt-0.5">
            {conv.summary && (
              <p className="text-[12px] truncate" style={{ color: "var(--text-3)", maxWidth: "150px" }}>
                {conv.summary}
              </p>
            )}
            {conv.last_message_at && (
              <p className="text-[12px] shrink-0" style={{ color: "var(--text-3)" }}>
                {format(new Date(conv.last_message_at), "d MMM · HH:mm", { locale: nl })}
              </p>
            )}
          </div>
        )}
      </div>

      {!isRenaming && (
        <div className="flex items-center gap-1 shrink-0">
          {showQuickMove && hover && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickMove?.(conv); }}
              className="h-7 w-7 flex items-center justify-center rounded-md btn-press"
              style={{ background: "var(--bg-elevated)" }}
              aria-label="Verplaatsen"
            >
              <span className="text-[14px]">📁</span>
            </button>
          )}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onOpenMenu?.(conv); }}
            className="h-7 w-7 flex items-center justify-center rounded-md btn-press"
            style={{ background: hover ? "var(--bg-elevated)" : "transparent" }}
            aria-label="Meer opties"
          >
            <MoreHorizontal className="h-4 w-4" style={{ color: "var(--text-3)" }} />
          </button>
        </div>
      )}
    </div>
  );

  if (isRenaming) {
    return <div className="px-1">{innerContent}</div>;
  }

  return (
    <Link
      to={to}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchEnd}
      className="block px-1"
    >
      {innerContent}
    </Link>
  );
}