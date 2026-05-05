import { useEffect, useRef } from "react";

/** @template T @param {T} value */
export function usePrevious(value) {
  const ref = useRef(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
