import { useLocalStorage } from "./useLocalStorage";

/**
 * Persisted boolean flags for experiments / toggles (device-local).
 * @param {string} key short id, stored as luna_flag_<key>
 * @param {boolean} [defaultValue]
 */
export function useFeatureFlag(key, defaultValue = false) {
  const storageKey = `luna_flag_${key}`;
  return useLocalStorage(storageKey, defaultValue);
}
