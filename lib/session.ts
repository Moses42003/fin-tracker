import { apiFetch } from "@/lib/api";
import { deleteItem, getItem, setItem } from "@/lib/storage";

export const SESSION_TOKEN_KEY = "auth_token";
export const SESSION_USER_KEY = "auth_user";
export const PENDING_TOKEN_KEY = "pending_auth_token";
export const PENDING_CREDENTIALS_KEY = "pending_auth_credentials";

/**
 * Local URI of the picked profile picture.
 *
 * The backend stores the upload but exposes no endpoint returning the image
 * bytes (its profile-picture route is metadata-only), so the app keeps the
 * device URI and renders that. See `uploadProfilePicture` in lib/finance.
 */
export const PROFILE_IMAGE_KEY = "profile_image_uri";

export interface SessionUser {
  id?: string;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  email?: string | null;
  phone?: string | null;
  /** Server-side path, e.g. "uploads/<uuid>.png". */
  profile_picture?: string | null;
}

export async function saveSession(token: string, fallbackUser?: SessionUser) {
  await setItem(SESSION_TOKEN_KEY, token);
  let user = fallbackUser;
  try {
    user = await apiFetch("/auth/me", {
      method: "POST",
      body: { access_token: token },
    });
  } catch {
    user = fallbackUser;
  }
  if (user) {
    await setItem(SESSION_USER_KEY, JSON.stringify(user));
  }
  return user;
}

export async function savePendingToken(token: string) {
  await setItem(PENDING_TOKEN_KEY, token);
}

export async function consumePendingToken() {
  const token = await getItem(PENDING_TOKEN_KEY);
  if (token) await deleteItem(PENDING_TOKEN_KEY);
  return token;
}

export async function savePendingCredentials(
  username: string,
  password: string,
) {
  await setItem(
    PENDING_CREDENTIALS_KEY,
    JSON.stringify({ username, password }),
  );
}

export async function consumePendingCredentials() {
  const raw = await getItem(PENDING_CREDENTIALS_KEY);
  if (raw) await deleteItem(PENDING_CREDENTIALS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { username: string; password: string };
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  const raw = await getItem(SESSION_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export async function updateSessionUser(updates: Partial<SessionUser>) {
  const current = (await getSessionUser()) || {};
  const next = { ...current, ...updates };
  await setItem(SESSION_USER_KEY, JSON.stringify(next));
  return next;
}

export async function updateUserOnBackend(updates: Partial<SessionUser>) {
  const current = await getSessionUser();
  const token = await getSessionToken();
  if (!current?.id || !token) {
    throw new Error("Your session has expired. Please log in again.");
  }
  if (!current.email) {
    throw new Error("Your account email is missing. Please log in again.");
  }

  const updated = await apiFetch(`/api/goal/users/${current.id}`, {
    method: "PUT",
    token,
    body: {
      email: current.email,
      first_name: updates.first_name ?? current.first_name ?? null,
      last_name: updates.last_name ?? current.last_name ?? null,
      phone: updates.phone ?? current.phone ?? null,
      username: updates.username ?? current.username ?? null,
      // The picture is uploaded separately via uploadProfilePicture; the users
      // PUT does not accept an image field.
    },
  });

  await setItem(SESSION_USER_KEY, JSON.stringify(updated));
  return updated as SessionUser;
}

export async function deleteUserOnBackend() {
  const current = await getSessionUser();
  const token = await getSessionToken();
  if (!current?.id || !token) {
    throw new Error("Your session has expired. Please log in again.");
  }

  // `soft_delete` must be a QUERY parameter. Sent in the JSON body it is
  // silently ignored: the server replies 200 and the account survives, which
  // is exactly the bug this fixes. `soft_delete=false` performs a real delete.
  await apiFetch(`/api/goal/users/${current.id}?soft_delete=false`, {
    method: "DELETE",
    token,
  });

  await clearSession();
  return;
}

export async function getSessionToken() {
  return getItem(SESSION_TOKEN_KEY);
}

/** Caches the local URI of the user's chosen profile picture. */
export async function saveProfileImage(uri: string) {
  await setItem(PROFILE_IMAGE_KEY, uri);
}

/** Reads the cached local profile image URI, if any. */
export async function getProfileImageUri() {
  return getItem(PROFILE_IMAGE_KEY);
}

/** Clears the cached profile image (used when the picture is removed). */
export async function clearProfileImage() {
  await deleteItem(PROFILE_IMAGE_KEY);
}

export async function clearSession() {
  await deleteItem(SESSION_TOKEN_KEY);
  await deleteItem(SESSION_USER_KEY);
  await deleteItem(PENDING_TOKEN_KEY);
  await deleteItem(PENDING_CREDENTIALS_KEY);
  await deleteItem(PROFILE_IMAGE_KEY);
}

export function displayName(user?: SessionUser | null) {
  if (!user) return "there";
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return fullName || user.username || user.email || user.phone || "there";
}
