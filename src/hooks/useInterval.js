import { useEffect, useRef } from "react";

/**
 * @param {() => void} callback
 * @param {number | null} delayMs null = paused
 */
export function useInterval(callback, delayMs) {
  const saved = useRef(callback);
  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delayMs == null) return;
    const id = window.setInterval(() => saved.current(), delayMs);
    return () => window.clearInterval(id);
  }, [delayMs]);
}
