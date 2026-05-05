import { useState, useEffect } from "react";

/**
 * @returns {{ level: number | null, charging: boolean | null, supported: boolean }}
 */
export function useBattery() {
  const [state, setState] = useState({ level: null, charging: null, supported: false });

  useEffect(() => {
    /** @type {Navigator & { getBattery?: () => Promise<any> }} */
    const nav = navigator;
    if (typeof nav.getBattery !== "function") {
      setState({ level: null, charging: null, supported: false });
      return;
    }

    let detach = () => {};

    nav.getBattery().then((b) => {
      const sync = () => {
        setState({ level: b.level, charging: b.charging, supported: true });
      };
      sync();
      b.addEventListener("levelchange", sync);
      b.addEventListener("chargingchange", sync);
      detach = () => {
        b.removeEventListener("levelchange", sync);
        b.removeEventListener("chargingchange", sync);
      };
    });

    return () => detach();
  }, []);

  return state;
}
