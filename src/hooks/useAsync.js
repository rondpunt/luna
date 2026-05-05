import { useState, useCallback, useRef, useEffect } from "react";

/**
 * @template T
 * @param {() => Promise<T>} fn
 */
export function useAsync(fn) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fn();
      if (mounted.current) setData(res);
      return res;
    } catch (e) {
      if (mounted.current) setError(e);
      throw e;
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [fn]);

  return { data, error, loading, run, setData };
}
