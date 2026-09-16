import { useCallback, useEffect, useRef, useState } from "react";

interface State<T> {
  data: T | null;
  loading: boolean;
  error: string;
}

/**
 * Small data hook used by the tabs to load a resource on mount and allow a
 * pull-to-refresh. It guards against setting state after unmount and ignores
 * stale responses when `reload` is called again.
 *
 * @param loader resolves the resource; should be stable (wrap in useCallback).
 */
export function useAsyncData<T>(loader: () => Promise<T>) {
  const [state, setState] = useState<State<T>>({
    data: null,
    loading: true,
    error: "",
  });
  const [refreshing, setRefreshing] = useState(false);
  const mounted = useRef(true);
  const requestId = useRef(0);

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
      else setState((prev) => ({ ...prev, loading: true, error: "" }));

      try {
        const data = await loader();
        if (mounted.current && id === requestId.current) {
          setState({ data, loading: false, error: "" });
        }
      } catch (err) {
        if (mounted.current && id === requestId.current) {
          setState({
            data: null,
            loading: false,
            error:
              err instanceof Error
                ? err.message
                : "Unable to load your data right now.",
          });
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

  const reload = useCallback(() => run(false), [run]);
  const refresh = useCallback(() => run(true), [run]);

  return { ...state, refreshing, reload, refresh };
}
