import { useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";

/**
 * Telt actieve seconden op de app (tab focus + zichtbaar).
 * Persisteert elke 30s naar UserPreferences.active_app_seconds.
 * Idle (>60s zonder mousemove/touch/keydown) telt niet mee.
 */
export function useActiveTimeTracker() {
  const prefsRef = useRef(null);
  const accumulatedRef = useRef(0);
  const lastTickRef = useRef(Date.now());
  const lastActivityRef = useRef(Date.now());
  const isActiveRef = useRef(true);

  useEffect(() => {
    let mounted = true;
    let tickInterval, syncInterval;

    const loadPrefs = async () => {
      try {
        const me = await base44.auth.me();
        if (!me?.id) return;
        const rows = await base44.entities.UserPreferences.filter({ userId: me.id }, "-created_date", 1);
        if (!mounted) return;
        if (rows?.[0]) {
          prefsRef.current = rows[0];
          accumulatedRef.current = rows[0].active_app_seconds || 0;
        } else {
          const created = await base44.entities.UserPreferences.create({
            userId: me.id,
            active_app_seconds: 0,
            first_seen_at: new Date().toISOString(),
          });
          prefsRef.current = created;
        }
      } catch {}
    };

    const markActivity = () => { lastActivityRef.current = Date.now(); };
    const handleVisibility = () => {
      isActiveRef.current = document.visibilityState === "visible";
      lastTickRef.current = Date.now();
    };

    const tick = () => {
      const now = Date.now();
      const sinceActivity = now - lastActivityRef.current;
      const delta = Math.min(2, (now - lastTickRef.current) / 1000);
      lastTickRef.current = now;
      if (isActiveRef.current && sinceActivity < 60_000) {
        accumulatedRef.current += delta;
      }
    };

    const sync = async () => {
      const prefs = prefsRef.current;
      if (!prefs?.id) return;
      const rounded = Math.round(accumulatedRef.current);
      if (rounded === (prefs.active_app_seconds || 0)) return;
      try {
        await base44.entities.UserPreferences.update(prefs.id, { active_app_seconds: rounded });
        prefsRef.current = { ...prefs, active_app_seconds: rounded };
      } catch {}
    };

    loadPrefs();
    tickInterval = setInterval(tick, 1000);
    syncInterval = setInterval(sync, 30_000);

    window.addEventListener("visibilitychange", handleVisibility);
    ["mousemove", "keydown", "touchstart", "scroll", "click"].forEach((e) =>
      window.addEventListener(e, markActivity, { passive: true })
    );

    return () => {
      mounted = false;
      clearInterval(tickInterval);
      clearInterval(syncInterval);
      window.removeEventListener("visibilitychange", handleVisibility);
      ["mousemove", "keydown", "touchstart", "scroll", "click"].forEach((e) =>
        window.removeEventListener(e, markActivity)
      );
      sync();
    };
  }, []);
}