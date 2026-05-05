/**
 * useLunaPresence — state machine for Luna's AI companion presence.
 *
 * States: idle | connecting | online | reading | typing | quietly_here | away | last_active
 *
 * Design rule: these states create warmth and social pacing.
 * They do NOT imply Luna is a real human. Luna is an AI companion.
 */

import { useState, useEffect, useRef, useCallback } from "react";

export const PRESENCE = {
  IDLE: "idle",
  CONNECTING: "connecting",
  ONLINE: "online",
  READING: "reading",
  TYPING: "typing",
  QUIETLY_HERE: "quietly_here",
  AWAY: "away",
  LAST_ACTIVE: "last_active",
  /** Device has no network — overrides companion state for honest UX */
  NETWORK_OFFLINE: "network_offline",
};

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * @param {{ networkOnline?: boolean }} [options]
 */
export function useLunaPresence({ networkOnline = true } = {}) {
  const [state, setState] = useState(PRESENCE.IDLE);
  const [lastActiveMin, setLastActiveMin] = useState(null);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const after = (ms, fn) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
    return t;
  };

  // Called once on mount — entry flow
  const initPresence = useCallback(() => {
    setState(PRESENCE.CONNECTING);

    after(rand(300, 550), () => {
      setState(PRESENCE.ONLINE);
    });
  }, []);

  // Called when user sends a message
  const onUserMessage = useCallback((msgLength = 0) => {
    clearTimers();
    setState(PRESENCE.READING);

    // Reading delay: 600–1200ms depending on msg length
    const readingMs = Math.min(600 + msgLength * 8, 1400) + rand(-100, 200);

    after(readingMs, () => {
      setState(PRESENCE.TYPING);
    });
  }, []);

  // Called when Luna's reply is received/delivered
  const onLunaReply = useCallback(() => {
    clearTimers();
    setState(PRESENCE.ONLINE);

    // After 90–150s of inactivity, drift to quietly_here
    const driftMs = rand(90000, 150000);
    after(driftMs, () => {
      setState(PRESENCE.QUIETLY_HERE);
    });
  }, []);

  // Called when user returns after absence (tab focus, etc.)
  const onReturn = useCallback(() => {
    clearTimers();
    if (state === PRESENCE.AWAY || state === PRESENCE.LAST_ACTIVE) {
      setState(PRESENCE.CONNECTING);
      after(rand(300, 500), () => setState(PRESENCE.ONLINE));
    } else if (state === PRESENCE.QUIETLY_HERE) {
      setState(PRESENCE.ONLINE);
    }
  }, [state]);

  // Simulate natural drift to away if page loses focus
  useEffect(() => {
    const handleHide = () => {
      clearTimers();
      const t = setTimeout(() => {
        setLastActiveMin(0);
        setState(PRESENCE.LAST_ACTIVE);
      }, rand(180000, 300000)); // 3–5 min
      timers.current.push(t);
    };

    const handleShow = () => {
      clearTimers();
      if (document.visibilityState === "visible") {
        onReturn();
      }
    };

    document.addEventListener("visibilitychange", handleShow);
    window.addEventListener("pagehide", handleHide);

    return () => {
      document.removeEventListener("visibilitychange", handleShow);
      window.removeEventListener("pagehide", handleHide);
      clearTimers();
    };
  }, [onReturn]);

  const displayState = networkOnline ? state : PRESENCE.NETWORK_OFFLINE;

  // Labels — ethical, warm, never fake-human (network layer wins when offline)
  const statusLabel = {
    [PRESENCE.IDLE]: "",
    [PRESENCE.CONNECTING]: "Verbinden…",
    [PRESENCE.ONLINE]: "Online",
    [PRESENCE.READING]: "Luna leest…",
    [PRESENCE.TYPING]: "Luna denkt na…",
    [PRESENCE.QUIETLY_HERE]: "Stil aanwezig",
    [PRESENCE.AWAY]: "Even weg",
    [PRESENCE.LAST_ACTIVE]: lastActiveMin === 0 ? "Net actief" : `Actief ${lastActiveMin} min geleden`,
    [PRESENCE.NETWORK_OFFLINE]: "Offline",
  }[displayState] ?? "";

  const statusColor = {
    [PRESENCE.IDLE]: "rgba(235,235,245,0.30)",
    [PRESENCE.CONNECTING]: "rgba(235,235,245,0.50)",
    [PRESENCE.ONLINE]: "#30D158",
    [PRESENCE.READING]: "#64D2FF",
    [PRESENCE.TYPING]: "#FF9F0A",
    [PRESENCE.QUIETLY_HERE]: "rgba(235,235,245,0.45)",
    [PRESENCE.AWAY]: "rgba(235,235,245,0.30)",
    [PRESENCE.LAST_ACTIVE]: "rgba(235,235,245,0.35)",
    [PRESENCE.NETWORK_OFFLINE]: "#8E8E93",
  }[displayState] ?? "rgba(235,235,245,0.30)";

  return {
    state,
    displayState,
    statusLabel,
    statusColor,
    initPresence,
    onUserMessage,
    onLunaReply,
    onReturn,
  };
}