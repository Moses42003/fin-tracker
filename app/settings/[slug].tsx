import BackText from "@/components/backtext";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const titles: Record<string, string> = {
  budget: "Budget Settings",
  notifications: "Notifications",
  theme: "Theme",
  backups: "Data & Backups",
  about: "About GoalFlow",
};

export default function SettingsScreen() {
  const { slug = "about" } = useLocalSearchParams<{ slug?: string }>();
  const [enabled, setEnabled] = useState(true);
  const title = titles[slug] || "Settings";

  return (
    <SafeAreaView className="flex-1 px-5 py-5 bg-slate-50">
      <BackText title="Settings" />
      <View className="mt-10 rounded-3xl bg-white border border-gray-200 p-5">
        <Text className="text-3xl font-bold">{title}</Text>
        {slug === "notifications" ? (
          <View className="flex-row items-center justify-between mt-8">
            <View className="flex-1 pr-4">
              <Text className="text-lg font-semibold">Push notifications</Text>
              <Text className="text-gray-500 mt-1">
                Stay informed about your activity.
              </Text>
            </View>
            <Switch value={enabled} onValueChange={setEnabled} />
          </View>
        ) : slug === "theme" ? (
          <Text className="text-gray-500 text-lg mt-5">
            System theme is active.
          </Text>
        ) : slug === "about" ? (
          <Text className="text-gray-500 text-lg mt-5">
            GoalFlow helps you track money, targets, and progress in one place.
          </Text>
        ) : (
          <Text className="text-gray-500 text-lg mt-5">
            This setting is ready for your next data connection.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
