import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useIdleWarning } from "@/hooks/useIdleWarning";
import { useKeyPress } from "@/hooks/useKeyPress";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useFocusTrap } from "@/hooks/useFocusTrap";

/**
 * Offline strip, idle notice, keyboard help — mounted once in AppShell.
 */
export default function LunaGlobalChrome() {
  const { pathname } = useLocation();
  const { showIdleWarning, dismissIdleWarning } = useIdleWarning();
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const trapRef = useFocusTrap(shortcutsOpen);
  useScrollLock(shortcutsOpen);

  useKeyPress(
    (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setShortcutsOpen(true);
      }
    },
    !pathname.startsWith("/chat")
  );

  return (
    <>
      {showIdleWarning && !pathname.startsWith("/chat") && (
        <div
          className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[85] max-w-sm w-[90%] rounded-2xl p-4 surface"
          style={{ border: "1px solid var(--border)" }}
        >
          <p style={{ fontSize: 14, color: "var(--text)", marginBottom: 8 }}>Nog daar?</p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12, lineHeight: 1.5 }}>
            Je sessie stond even stil. Geen data weg — alleen een zachte check-in.
          </p>
          <button type="button" className="btn btn-primary press w-full" style={{ fontSize: 13 }} onClick={dismissIdleWarning}>
            Oké
          </button>
        </div>
      )}

      {shortcutsOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[100] bg-black/60"
            aria-label="Sluit snelkoppelingen"
            onClick={() => setShortcutsOpen(false)}
          />
          <div
            ref={trapRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="luna-shortcuts-title"
            className="fixed z-[110] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(92vw,400px)] rounded-2xl p-6 surface"
            style={{ border: "1px solid var(--border)" }}
          >
            <h2 id="luna-shortcuts-title" className="font-display text-xl mb-3" style={{ color: "var(--text)" }}>
              Sneltoetsen
            </h2>
            <ul style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.8, listStyle: "none", padding: 0, margin: 0 }}>
              <li><kbd style={{ opacity: 0.8 }}>Ctrl / ⌘ + /</kbd> — dit venster</li>
              <li><kbd style={{ opacity: 0.8 }}>Enter</kbd> in chat — verstuur</li>
              <li><kbd style={{ opacity: 0.8 }}>Shift+Enter</kbd> — nieuwe regel</li>
            </ul>
            <button type="button" className="btn btn-ghost mt-6 w-full" style={{ fontSize: 14 }} onClick={() => setShortcutsOpen(false)}>
              Sluiten
            </button>
          </div>
        </>
      )}
    </>
  );
}
