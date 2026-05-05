import { useState, useEffect, useRef } from "react";

/**
 * Soft session warning after idle (no therapy session — UX only).
 * @param {number} idleMs default 25 minutes
 */
export function useIdleWarning(idleMs = 25 * 60 * 1000) {
  const [showIdleWarning, setShowIdleWarning] = useState(false);
  const last = useRef(Date.now());

  useEffect(() => {
    const bump = () => {
      last.current = Date.now();
      setShowIdleWarning(false);
    };
    const events = ["mousedown", "keydown", "touchstart", "scroll", "visibilitychange"];
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    const id = window.setInterval(() => {
      if (document.visibilityState === "hidden") return;
      if (Date.now() - last.current > idleMs) setShowIdleWarning(true);
    }, 30_000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, bump));
      window.clearInterval(id);
    };
  }, [idleMs]);

  const dismissIdleWarning = () => setShowIdleWarning(false);

  return { showIdleWarning, dismissIdleWarning };
}
