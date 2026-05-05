import { useEffect, useRef } from "react";

/**
 * @param {(e: KeyboardEvent) => void} handler
 * @param {boolean} [enabled]
 */
export function useKeyPress(handler, enabled = true) {
  const ref = useRef(handler);
  ref.current = handler;

  useEffect(() => {
    if (!enabled) return;
    const onKey = (e) => ref.current(e);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled]);
}
