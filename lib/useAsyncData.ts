import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

interface State<T> {
  data: T | null;
  loading: boolean;
  error: string;
}

/**
 * Small data hook used by the tabs to load a resource.
 *
 * It re-fetches in three situations, so users never have to reload manually:
 *  - on mount,
 *  - whenever the screen regains focus (e.g. coming back after adding a record),
 *  - when `changes` changes (a counter bumped by the session context after a
 *    write, which covers an add made from a screen that never lost focus).
 *
 * @param loader resolves the resource; should be stable (wrap in useCallback).
 * @param changes optional counter that forces a re-fetch when it changes.
 */
export function useAsyncData<T>(loader: () => Promise<T>, changes?: number) {
  const [state, setState] = useState<State<T>>({
    data: null,
    loading: true,
    error: "",
  });
  const [refreshing, setRefreshing] = useState(false);
  const mounted = useRef(true);
  const requestId = useRef(0);
  const hasLoaded = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = useCallback(
    async (isRefresh = false) => {
      const id = ++requestId.current;
      if (isRefresh) setRefreshing(true);
      // Only show the full-screen loader on the very first load; later
      // background refreshes should not blank out content the user is reading.
      else if (!hasLoaded.current)
        setState((prev) => ({ ...prev, loading: true, error: "" }));

      try {
        const data = await loader();
        if (mounted.current && id === requestId.current) {
          hasLoaded.current = true;
          setState({ data, loading: false, error: "" });
        }
      } catch (err) {
        if (mounted.current && id === requestId.current) {
          setState((prev) => ({
            data: prev.data,
            loading: false,
            error:
              err instanceof Error
                ? err.message
                : "Unable to load your data right now.",
          }));
        }
      } finally {
        if (mounted.current && id === requestId.current) setRefreshing(false);
      }
    },
    [loader],
  );

  useEffect(() => {
    run();
  }, [run]);

  // Re-fetch when the screen comes back into focus.
  useFocusEffect(
    useCallback(() => {
      if (hasLoaded.current) run();
    }, [run]),
  );

  // Re-fetch when a write elsewhere bumps the change counter.
  useEffect(() => {
    if (changes === undefined) return;
    if (!hasLoaded.current) return;
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changes]);

  const reload = useCallback(() => run(false), [run]);
  const refresh = useCallback(() => run(true), [run]);

  return { ...state, refreshing, reload, refresh };
}
