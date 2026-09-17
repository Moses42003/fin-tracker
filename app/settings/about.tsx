import BackText from "@/components/backtext";
import { useSession } from "@/lib/sessionContext";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import React from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FEATURES = [
  {
    icon: "trending-up",
    title: "Income & expenses",
    detail: "Record money in and out with categories and payment methods.",
  },
  {
    icon: "trophy-outline",
    title: "Savings targets",
    detail: "Set a goal, add funds and watch your progress grow.",
  },
  {
    icon: "pie-chart-outline",
    title: "Insights",
    detail: "See where your spending goes and track your balance over time.",
  },
] as const;

export default function AboutScreen() {
  const { user } = useSession();
  const version = Constants.expoConfig?.version || "1.0.0";

  return (
    <SafeAreaView className="flex-1 px-4 py-5 bg-white">
      <BackText title="About App" />
      <ScrollView showsVerticalScrollIndicator={false} className="mt-6">
        <View className="items-center mt-2">
          <View className="w-24 h-24 rounded-3xl bg-blue-600 justify-center items-center">
            <Ionicons name="analytics" size={44} color="white" />
          </View>
          <View className="flex-row items-center mt-4">
            <Text className="text-4xl font-bold">Goal</Text>
            <Text className="text-4xl font-bold text-blue-500">Flow</Text>
          </View>
          <Text className="text-gray-500 text-lg mt-2">Version {version}</Text>
        </View>

        <View className="rounded-3xl border-2 border-gray-300 bg-white p-5 mt-6">
          <Text className="text-xl font-bold">What GoalFlow does</Text>
          <Text className="text-gray-500 mt-2">
            GoalFlow helps you keep a clear picture of your money: what comes
            in, what goes out, and how close you are to the things you are
            saving for.
          </Text>
        </View>

        <View className="rounded-3xl border-2 border-gray-300 bg-white p-5 mt-4">
          <Text className="text-xl font-bold mb-3">Features</Text>
          {FEATURES.map((feature) => (
            <View key={feature.title} className="flex-row gap-3 mb-4">
              <View className="w-11 h-11 rounded-2xl bg-blue-50 items-center justify-center">
                <Ionicons
                  // @ts-ignore Ionicons accepts the runtime icon name.
                  name={feature.icon}
                  size={22}
                  color="#2563eb"
                />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold">{feature.title}</Text>
                <Text className="text-gray-500">{feature.detail}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className="rounded-3xl border-2 border-gray-300 bg-white p-5 mt-4 mb-8">
          <Text className="text-xl font-bold">Your account</Text>
          <View className="flex-row justify-between items-center mt-3">
            <Text className="text-gray-500">Signed in as</Text>
            <Text className="font-semibold flex-1 text-right" numberOfLines={1}>
              {user?.email || user?.phone || "Unknown"}
            </Text>
          </View>
          <View className="flex-row justify-between items-center mt-3">
            <Text className="text-gray-500">Name</Text>
            <Text className="font-semibold">
              {[user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
                "Not set"}
            </Text>
          </View>
        </View>
      </ScrollView>
      <StatusBar barStyle="dark-content" />
    </SafeAreaView>
  );
}
