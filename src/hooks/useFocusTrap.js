import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Trap focus inside container while active.
 * @param {boolean} active
 */
export function useFocusTrap(active) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return;
    const root = ref.current;
    if (!root) return;

    const focusables = () => Array.from(root.querySelectorAll(FOCUSABLE));
    const first = () => focusables()[0];
    const last = () => focusables()[focusables().length - 1];

    const onKey = (e) => {
      if (e.key !== "Tab") return;
      const list = focusables();
      if (!list.length) return;
      const f = list[0];
      const l = list[list.length - 1];
      if (e.shiftKey && document.activeElement === f) {
        e.preventDefault();
        l.focus();
      } else if (!e.shiftKey && document.activeElement === l) {
        e.preventDefault();
        f.focus();
      }
    };

    window.setTimeout(() => first()?.focus?.(), 0);
    root.addEventListener("keydown", onKey);
    return () => root.removeEventListener("keydown", onKey);
  }, [active]);

  return ref;
}
