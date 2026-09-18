import BackText from "@/components/backtext";
import {
  listNotifications,
  markAllNotificationsRead,
  NotificationRecord,
} from "@/lib/finance";
import { shortDate } from "@/lib/format";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setError("");
    try {
      setNotifications(await listNotifications());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your notifications.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const unread = notifications.filter((item) => !item.is_read).length;

  async function handleMarkAllRead() {
    // Optimistic: cheap to re-fetch if the call fails.
    setNotifications((current) =>
      current.map((item) => ({ ...item, is_read: true })),
    );
    try {
      await markAllNotificationsRead();
    } catch {
      load();
    }
  }

  return (
    <SafeAreaView className="flex-1 p-4 bg-white dark:bg-slate-950">
      <View className="flex-row items-center justify-between">
        <BackText />
        {unread > 0 ? (
          <TouchableOpacity activeOpacity={0.7} onPress={handleMarkAllRead}>
            <Text className="text-blue-600 font-semibold">Mark all read</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="mt-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load(true)}
          />
        }
      >
        {loading ? (
          <View className="items-center justify-center py-24">
            <ActivityIndicator size="large" color="#2563eb" />
            <Text className="text-gray-500 dark:text-slate-400 mt-4">
              Loading your notifications…
            </Text>
          </View>
        ) : error ? (
          <View className="items-center justify-center py-24 px-6">
            <Ionicons name="cloud-offline-outline" size={48} color="#dc2626" />
            <Text className="text-2xl font-bold dark:text-slate-100 mt-4">
              Could not load
            </Text>
            <Text className="text-gray-500 dark:text-slate-400 text-center mt-2">
              {error}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => load()}
              className="mt-4 bg-slate-900 rounded-2xl px-6 py-3"
            >
              <Text className="text-white font-semibold">Try again</Text>
            </TouchableOpacity>
          </View>
        ) : !notifications.length ? (
          <View className="items-center justify-center py-24 px-8">
            <Ionicons
              name="notifications-off-outline"
              size={56}
              color="#94a3b8"
            />
            <Text className="text-2xl font-bold dark:text-slate-100 mt-4">
              All clear
            </Text>
            <Text className="text-gray-500 dark:text-slate-400 text-center mt-2">
              No notifications yet. We will let you know when something happens.
            </Text>
          </View>
        ) : (
          <View className="gap-3 pb-8">
            {notifications.map((notification) => (
              <View
                key={notification.id || notification.created_at}
                className={`w-full rounded-2xl border p-4 ${
                  notification.is_read
                    ? "border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    : "border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-slate-900"
                }`}
              >
                <View className="flex-row items-center gap-2">
                  {!notification.is_read ? (
                    <View className="w-2 h-2 rounded-full bg-blue-600" />
                  ) : null}
                  <Text className="text-lg font-bold flex-1 dark:text-slate-100">
                    {notification.title || "Notification"}
                  </Text>
                </View>
                <Text className="text-gray-600 dark:text-slate-300 mt-1">
                  {notification.message}
                </Text>
                {notification.created_at ? (
                  <Text className="text-gray-400 dark:text-slate-500 text-sm mt-2">
                    {shortDate(notification.created_at)}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
