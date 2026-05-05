import { useEffect } from "react";

/**
 * Locks body scroll while active (e.g. modal open).
 * @param {boolean} locked
 */
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}
