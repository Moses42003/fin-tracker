import BackText from "@/components/backtext";
import { apiFetch } from "@/lib/api";
import { getSessionToken } from "@/lib/session";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const token = await getSessionToken();
        if (!token) return;
        const data = await apiFetch("/api/goal/notifications", { token });
        setNotifications(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, []);

  return (
    <SafeAreaView className="flex-1 p-4">
      <View>
        <BackText />
      </View>
      <ScrollView
        contentContainerStyle={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        {loading ? <ActivityIndicator size="large" color="#2563eb" /> : null}
        {!loading && !notifications.length ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-2xl font-bold text-gray-700">All clear</Text>
            <Text className="text-gray-500 mt-2">No notifications yet.</Text>
          </View>
        ) : null}
        {notifications.map((notification) => (
          <View
            key={notification.id || notification.created_at}
            className="w-full rounded-2xl border border-gray-200 bg-white p-4 mb-3"
          >
            <Text className="text-lg font-bold">
              {notification.title || "Notification"}
            </Text>
            <Text className="text-gray-600 mt-1">{notification.message}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
