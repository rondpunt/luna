import { useState, useEffect, useRef } from "react";

/**
 * @param {IntersectionObserverInit} [options]
 */
export function useOnScreen(options) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting), {
      rootMargin: options?.rootMargin ?? "0px",
      threshold: options?.threshold ?? 0,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [options?.rootMargin, options?.threshold]);

  return [ref, visible];
}
