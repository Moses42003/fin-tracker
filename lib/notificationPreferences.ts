import { getItem, setItem } from "@/lib/storage";

/**
 * Notification preferences.
 *
 * IMPORTANT: the Goal Flow API has no notification-preferences endpoint — it
 * exposes only list / mark-read / mark-all-read / delete. Notifications are
 * generated server-side from account events (e.g. `profile_picture_uploaded`),
 * and there is no way to tell the server which events should notify.
 *
 * So these toggles are stored ON THE DEVICE and applied in the app: the list
 * hides categories the user has switched off. They are a display filter, not a
 * server subscription. The one exception is the budget alert threshold, which
 * IS stored on the server via the budget settings endpoint.
 */
const NOTIFICATION_PREFS_KEY = "notification_preferences";

export type NotificationCategory = "transactions" | "targets" | "account";

export interface NotificationPreferences {
  /** Master switch: hides every notification when off. */
  enabled: boolean;
  /** Per-category display toggles. */
  categories: Record<NotificationCategory, boolean>;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  enabled: true,
  categories: {
    transactions: true,
    targets: true,
    account: true,
  },
};

/**
 * Maps a server `type` string onto a category.
 *
 * The server sends free-form types (e.g. "profile_picture_uploaded", and budget
 * / target types). Unknown types default to "account" so they stay visible
 * rather than silently disappearing.
 */
export function categoryForType(type?: string): NotificationCategory {
  const value = (type || "").toLowerCase();
  if (
    value.includes("budget") ||
    value.includes("expense") ||
    value.includes("income") ||
    value.includes("transaction") ||
    value.includes("spending")
  ) {
    return "transactions";
  }
  if (
    value.includes("target") ||
    value.includes("goal") ||
    value.includes("saving")
  ) {
    return "targets";
  }
  return "account";
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const raw = await getItem(NOTIFICATION_PREFS_KEY);
  if (!raw) return DEFAULT_NOTIFICATION_PREFERENCES;
  try {
    const parsed = JSON.parse(raw) as Partial<NotificationPreferences>;
    return {
      enabled: parsed.enabled ?? true,
      categories: {
        ...DEFAULT_NOTIFICATION_PREFERENCES.categories,
        ...(parsed.categories ?? {}),
      },
    };
  } catch {
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }
}

export async function saveNotificationPreferences(
  prefs: NotificationPreferences,
): Promise<void> {
  await setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(prefs));
}
