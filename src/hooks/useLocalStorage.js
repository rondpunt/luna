import { useState, useCallback, useEffect } from "react";

function read(key, initial) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return initial;
    return JSON.parse(raw);
  } catch {
    return initial;
  }
}

/**
 * @template T
 * @param {string} key
 * @param {T} initial
 * @returns {[T, (v: T | ((p: T) => T)) => void]}
 */
export function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => read(key, initial));

  useEffect(() => {
    setState(read(key, initial));
  }, [key, initial]);

  const set = useCallback(
    (value) => {
      setState((prev) => {
        const next = typeof value === "function" ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch { /* quota */ }
        return next;
      });
    },
    [key]
  );

  return [state, set];
}
