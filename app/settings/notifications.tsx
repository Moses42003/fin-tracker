import BackText from "@/components/backtext";
import CustomButton from "@/components/custombutton";
import {
  BudgetSettings,
  getBudgetSettings,
  updateBudgetSettings,
} from "@/lib/finance";
import { toNumber } from "@/lib/format";
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  getNotificationPreferences,
  NotificationCategory,
  NotificationPreferences,
  saveNotificationPreferences,
} from "@/lib/notificationPreferences";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORY_ROWS: {
  key: NotificationCategory;
  title: string;
  detail: string;
  icon: string;
}[] = [
  {
    key: "transactions",
    title: "Budgets & spending",
    detail: "Alerts when your spending nears the budget threshold.",
    icon: "wallet-outline",
  },
  {
    key: "targets",
    title: "Savings targets",
    detail: "Updates when a target progresses or is completed.",
    icon: "trophy-outline",
  },
  {
    key: "account",
    title: "Account activity",
    detail: "Confirmation when your profile or account changes.",
    icon: "person-outline",
  },
];

export default function NotificationSettingsScreen() {
  const [loading, setLoading] = useState(true);
  const [savingLocal, setSavingLocal] = useState(false);
  const [savingThreshold, setSavingThreshold] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [prefs, setPrefs] = useState<NotificationPreferences>(
    DEFAULT_NOTIFICATION_PREFERENCES,
  );
  const [threshold, setThreshold] = useState("80");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [localPrefs, serverSettings] = await Promise.all([
        getNotificationPreferences(),
        getBudgetSettings().catch(() => null as BudgetSettings | null),
      ]);
      setPrefs(localPrefs);
      if (serverSettings?.notification_threshold) {
        setThreshold(String(toNumber(serverSettings.notification_threshold)));
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your notification settings.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function persist(next: NotificationPreferences, message: string) {
    setPrefs(next);
    setSavingLocal(true);
    setError("");
    setSuccess("");
    try {
      await saveNotificationPreferences(next);
      setSuccess(message);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save your preference.",
      );
    } finally {
      setSavingLocal(false);
    }
  }

  function toggleMaster(value: boolean) {
    persist(
      { ...prefs, enabled: value },
      value ? "Notifications turned on." : "Notifications turned off.",
    );
  }

  function toggleCategory(key: NotificationCategory, value: boolean) {
    persist(
      { ...prefs, categories: { ...prefs.categories, [key]: value } },
      "Notification preference saved.",
    );
  }

  async function handleSaveThreshold() {
    setError("");
    setSuccess("");
    const value = Number(threshold);
    if (!threshold.trim() || Number.isNaN(value) || value < 0 || value > 100) {
      setError("The alert threshold must be between 0 and 100.");
      return;
    }
    setSavingThreshold(true);
    try {
      await updateBudgetSettings({
        notificationThreshold: value.toFixed(2),
      });
      setSuccess("Budget alert threshold saved to your account.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save the threshold.",
      );
    } finally {
      setSavingThreshold(false);
    }
  }

  const busy = savingLocal || savingThreshold;

  return (
    <SafeAreaView className="flex-1 bg-white px-4 py-5 dark:bg-slate-950">
      <BackText title="Notifications" />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="text-gray-500 dark:text-slate-400 mt-4">
            Loading your settings…
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="mt-6"
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-3xl font-bold dark:text-slate-100">
            Notification settings
          </Text>
          <Text className="text-gray-500 dark:text-slate-400 text-lg mt-2">
            Choose what you want to hear about.
          </Text>

          {/* Master switch */}
          <View className="rounded-3xl border-2 border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 mt-5">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-xl font-bold dark:text-slate-100">
                  Allow notifications
                </Text>
                <Text className="text-gray-500 dark:text-slate-400 mt-1">
                  Turn every notification on or off at once.
                </Text>
              </View>
              <Switch
                value={prefs.enabled}
                onValueChange={toggleMaster}
                disabled={busy}
                trackColor={{ false: "#cbd5e1", true: "#93c5fd" }}
                thumbColor={prefs.enabled ? "#2563eb" : "#f1f5f9"}
              />
            </View>
          </View>

          {/* Categories */}
          <View className="rounded-3xl border-2 border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 mt-4">
            <Text className="text-xl font-bold dark:text-slate-100">
              What to show
            </Text>
            <Text className="text-gray-500 dark:text-slate-400 mt-1 mb-2">
              These filter what appears in your notification list on this
              device.
            </Text>

            {CATEGORY_ROWS.map((row) => (
              <View
                key={row.key}
                className="flex-row items-center gap-3 py-4 border-b border-gray-100 dark:border-slate-800"
              >
                <View className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-slate-800 items-center justify-center">
                  <Ionicons
                    // @ts-ignore Ionicons accepts the runtime icon name.
                    name={row.icon}
                    size={22}
                    color="#2563eb"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold dark:text-slate-100">
                    {row.title}
                  </Text>
                  <Text className="text-gray-500 dark:text-slate-400">
                    {row.detail}
                  </Text>
                </View>
                <Switch
                  value={prefs.enabled && prefs.categories[row.key]}
                  onValueChange={(value) => toggleCategory(row.key, value)}
                  disabled={busy || !prefs.enabled}
                  trackColor={{ false: "#cbd5e1", true: "#93c5fd" }}
                  thumbColor={prefs.categories[row.key] ? "#2563eb" : "#f1f5f9"}
                />
              </View>
            ))}
          </View>

          {/* Server-side threshold */}
          <View className="rounded-3xl border-2 border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 mt-4">
            <Text className="text-xl font-bold dark:text-slate-100">
              Budget alert threshold
            </Text>
            <Text className="text-gray-500 dark:text-slate-400 mt-1">
              Warn me when my spending reaches this share of my monthly budget.
            </Text>

            <View className="flex-row items-center gap-2 mt-4">
              <TouchableOpacity
                activeOpacity={0.7}
                disabled={busy}
                onPress={() =>
                  setThreshold(String(Math.max(0, Number(threshold) - 5)))
                }
                className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 items-center justify-center"
              >
                <Ionicons name="remove" size={22} color="#334155" />
              </TouchableOpacity>

              <View className="flex-1 items-center">
                <Text className="text-3xl font-bold text-blue-600">
                  {Number(threshold) || 0}%
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                disabled={busy}
                onPress={() =>
                  setThreshold(String(Math.min(100, Number(threshold) + 5)))
                }
                className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 items-center justify-center"
              >
                <Ionicons name="add" size={22} color="#334155" />
              </TouchableOpacity>
            </View>

            <CustomButton
              name="Save threshold"
              color="white"
              bgColor="#2563eb"
              disabled={busy}
              loading={savingThreshold}
              onPress={handleSaveThreshold}
            />
          </View>

          {error ? (
            <View className="flex-row items-center gap-2 rounded-2xl bg-red-50 dark:bg-slate-900 border-2 border-red-200 px-3 py-3 mt-4">
              <Ionicons name="alert-circle" size={20} color="#dc2626" />
              <Text className="flex-1 text-red-700 font-semibold">{error}</Text>
            </View>
          ) : null}

          {success ? (
            <View className="flex-row items-center gap-2 rounded-2xl bg-green-50 dark:bg-slate-900 border-2 border-green-200 px-3 py-3 mt-4">
              <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
              <Text className="flex-1 text-green-700 font-semibold">
                {success}
              </Text>
            </View>
          ) : null}

          <View className="rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-4 mt-4 mb-8">
            <View className="flex-row items-center gap-2">
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#64748b"
              />
              <Text className="font-bold text-gray-600 dark:text-slate-300">
                How notifications work
              </Text>
            </View>
            <Text className="text-gray-500 dark:text-slate-400 mt-2">
              Notifications are created by the server when things happen on your
              account. The switches above control what you see in this app; the
              alert threshold is saved to your account.
            </Text>
          </View>
        </ScrollView>
      )}
      <StatusBar barStyle="dark-content" />
    </SafeAreaView>
  );
}
