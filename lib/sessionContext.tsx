import {
  clearSession,
  displayName,
  getSessionUser,
  saveSession,
  SessionUser,
} from "@/lib/session";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const WELCOME_SEEN_KEY = "welcome_seen_for";

interface SessionContextValue {
  user: SessionUser | null;
  /** True until the stored session has been read on startup. */
  loading: boolean;
  /** Display name for greetings, driven by the live session user. */
  name: string;
  /** Re-reads the stored session (call after saving account changes). */
  refreshUser: () => Promise<void>;
  /** Replaces the in-memory + stored user after an update. */
  setUser: (user: SessionUser | null) => Promise<void>;
  signOut: () => Promise<void>;
  /** Welcome banner state, shown once per signed-in account. */
  welcomeVisible: boolean;
  dismissWelcome: () => void;
  /** Bumped whenever records change, so screens can re-fetch. */
  dataVersion: number;
  notifyDataChanged: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

function welcomeKeyFor(user: SessionUser | null) {
  if (!user) return "";
  return user.id || user.email || user.phone || user.username || "";
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);
  const welcomeKey = useRef("");

  const refreshUser = useCallback(async () => {
    const next = await getSessionUser();
    setUserState(next);
    welcomeKey.current = welcomeKeyFor(next);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const next = await getSessionUser();
      if (!active) return;
      setUserState(next);
      welcomeKey.current = welcomeKeyFor(next);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  /**
   * Shows the welcome banner once per account. Keyed on the user id so it does
   * not reappear on every re-render or after a profile edit.
   */
  useEffect(() => {
    if (loading || !user) return;
    const key = welcomeKeyFor(user);
    if (!key) return;
    let active = true;
    import("expo-secure-store").then(async (SecureStore) => {
      const seen = await SecureStore.getItemAsync(WELCOME_SEEN_KEY);
      if (!active) return;
      if (seen !== key) {
        setWelcomeVisible(true);
      }
    });
    return () => {
      active = false;
    };
  }, [loading, user]);

  const dismissWelcome = useCallback(() => {
    setWelcomeVisible(false);
    const key = welcomeKeyFor(user);
    if (!key) return;
    import("expo-secure-store").then((SecureStore) =>
      SecureStore.setItemAsync(WELCOME_SEEN_KEY, key),
    );
  }, [user]);

  const setUser = useCallback(async (next: SessionUser | null) => {
    setUserState(next);
    if (next) {
      // Persist through the session helper so tokens stay untouched.
      const { updateSessionUser } = await import("@/lib/session");
      await updateSessionUser(next);
    }
  }, []);

  const signOut = useCallback(async () => {
    await clearSession();
    setUserState(null);
    setWelcomeVisible(false);
  }, []);

  const notifyDataChanged = useCallback(() => {
    setDataVersion((version) => version + 1);
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      user,
      loading,
      name: displayName(user),
      refreshUser,
      setUser,
      signOut,
      welcomeVisible,
      dismissWelcome,
      dataVersion,
      notifyDataChanged,
    }),
    [
      user,
      loading,
      refreshUser,
      setUser,
      signOut,
      welcomeVisible,
      dismissWelcome,
      dataVersion,
      notifyDataChanged,
    ],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used inside a SessionProvider");
  }
  return context;
}

export { saveSession };
