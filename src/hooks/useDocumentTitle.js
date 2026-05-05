import { useEffect } from "react";

/**
 * @param {string} title
 * @param {string} [suffix] default "Luna"
 */
export function useDocumentTitle(title, suffix = "Luna") {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} · ${suffix}` : suffix;
    return () => {
      document.title = prev;
    };
  }, [title, suffix]);
}
