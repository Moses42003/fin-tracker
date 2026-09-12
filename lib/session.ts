import { apiFetch } from "@/lib/api";
import * as SecureStore from "expo-secure-store";

export const SESSION_TOKEN_KEY = "auth_token";
export const SESSION_USER_KEY = "auth_user";

export interface SessionUser {
  id?: string;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  email?: string | null;
  phone?: string | null;
}

export async function saveSession(token: string, fallbackUser?: SessionUser) {
  await SecureStore.setItemAsync(SESSION_TOKEN_KEY, token);
  let user = fallbackUser;
  try {
    user = await apiFetch("/auth/me", { method: "POST", token });
  } catch {
    user = fallbackUser;
  }
  if (user) {
    await SecureStore.setItemAsync(SESSION_USER_KEY, JSON.stringify(user));
  }
  return user;
}

export async function getSessionUser() {
  const raw = await SecureStore.getItemAsync(SESSION_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export async function getSessionToken() {
  return SecureStore.getItemAsync(SESSION_TOKEN_KEY);
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY);
  await SecureStore.deleteItemAsync(SESSION_USER_KEY);
}

export function displayName(user?: SessionUser | null) {
  if (!user) return "there";
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return fullName || user.username || user.email || user.phone || "there";
}
