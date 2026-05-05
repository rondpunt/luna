import { useEffect, useRef } from "react";
import { toast } from "sonner";

const STORAGE_LAST = "luna_daily_reminder_last";

/**
 * Once per local day, optional toast if enabled and prefs say so.
 * @param {{ enabled: boolean, label?: string }} opts
 */
export function useDailyReminder({ enabled, label = "Tijd voor een minuutje voor jezelf met Luna." }) {
  const fired = useRef(false);

  useEffect(() => {
    if (!enabled || fired.current) return;
    const today = new Date().toDateString();
    try {
      if (window.localStorage.getItem(STORAGE_LAST) === today) return;
    } catch {
      return;
    }

    const t = window.setTimeout(() => {
      try {
        if (window.localStorage.getItem(STORAGE_LAST) === today) return;
        window.localStorage.setItem(STORAGE_LAST, today);
        toast.info(label, { duration: 8000 });
        fired.current = true;
      } catch { /* ignore */ }
    }, 4000);

    return () => window.clearTimeout(t);
  }, [enabled, label]);
}
