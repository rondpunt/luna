/**
 * Stub analytics — replace with Posthog / GA when wired.
 * @returns {{ track: (name: string, props?: Record<string, unknown>) => void }}
 */
export function useAnalyticsEvent() {
  return {
    /** @param {string} name @param {Record<string, unknown>} [props] */
    track: (name, props) => {
      if (import.meta.env?.DEV) {
        // eslint-disable-next-line no-console
        console.debug("[luna:analytics]", name, props ?? {});
      }
    },
  };
}
