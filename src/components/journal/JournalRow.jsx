import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { useRef } from "react";

/**
 * Tappable list-row in Luna's bestaande list-row pattern.
 * Premium typografie, schone truncation, geen valse chevron.
 */
export default function JournalRow({ entry }) {
  const navigate = useNavigate();
  const tappedRef = useRef(false);

  const handleTap = () => {
    if (tappedRef.current) return;
    tappedRef.current = true;
    navigate("/diary");
    setTimeout(() => { tappedRef.current = false; }, 600);
  };

  const preview = (entry.content || "").trim().split("\n")[0].slice(0, 80);
  const title = entry.title?.trim() || preview || "Notitie";
  const dateLabel = format(new Date(entry.created_date), "d MMM · HH:mm", { locale: nl });

  return (
    <button
      onClick={handleTap}
      className="list-row w-full text-left btn-press"
      style={{ minHeight: 68 }}
    >
      <div className="flex-1 min-w-0">
        <p
          className="text-[15px] font-medium truncate leading-tight"
          style={{ color: "var(--text)", letterSpacing: "-0.1px" }}
        >
          {title}
        </p>
        <div className="flex items-center gap-2 mt-1.5 min-w-0">
          <span className="text-[12px] shrink-0 tabular-nums" style={{ color: "var(--text-3)" }}>
            {dateLabel}
          </span>
          {preview && preview !== title && (
            <>
              <span className="shrink-0" style={{ color: "var(--text-4)" }}>·</span>
              <span className="text-[12px] truncate" style={{ color: "var(--text-2)" }}>
                {preview}
              </span>
            </>
          )}
        </div>
      </div>
    </button>
  );
}