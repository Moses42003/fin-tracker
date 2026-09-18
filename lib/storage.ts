import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

/**
 * Cross-platform key/value storage.
 *
 * `expo-secure-store` has no web implementation — `ExpoSecureStore.web` is an
 * empty object, so every call throws "getItemAsync is not available on web".
 * Using it directly made the whole app fail to load on web. This wraps it so:
 *   - native → SecureStore (encrypted, the right place for a token)
 *   - web    → localStorage (SecureStore simply does not exist there)
 *
 * Web storage is not as protected as the native keychain. That is an accepted
 * trade-off: the web target is for development/preview, not a shipped surface.
 */
const isWeb = Platform.OS === "web";

/** Keys are the same in both backends so nothing else has to branch. */
export async function getItem(key: string): Promise<string | null> {
  if (isWeb) {
    try {
      return globalThis.localStorage?.getItem(key) ?? null;
    } catch {
      // Private mode / storage disabled — behave like an empty store.
      return null;
    }
  }
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) {
    try {
      globalThis.localStorage?.setItem(key, value);
    } catch {
      // Ignore: a failed write should never break a screen.
    }
    return;
  }
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    // Best-effort, same as web.
  }
}

export async function deleteItem(key: string): Promise<void> {
  if (isWeb) {
    try {
      globalThis.localStorage?.removeItem(key);
    } catch {
      // Ignore.
    }
    return;
  }
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    // Ignore.
  }
}
