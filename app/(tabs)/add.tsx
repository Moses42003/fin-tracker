import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddTab() {
  const options = [
    {
      title: "Income",
      detail: "Add money coming in",
      icon: "trending-up",
      route: "/transaction/addScreen?type=income",
    },
    {
      title: "Expense",
      detail: "Record money going out",
      icon: "trending-down",
      route: "/transaction/addScreen?type=expense",
    },
    {
      title: "Target",
      detail: "Create a savings goal",
      icon: "trophy-outline",
      route: "/targets/add",
    },
    {
      title: "Category",
      detail: "Organize your records",
      icon: "pricetags-outline",
      route: "/transaction/category",
    },
  ] as const;

  return (
    <SafeAreaView className="flex-1 px-5 py-6 bg-slate-50">
      <Text className="text-3xl font-bold">Add something</Text>
      <Text className="text-gray-500 text-lg mt-2 mb-6">
        Choose what you want to add today.
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-4">
          {options.map((option) => (
            <TouchableOpacity
              key={option.title}
              activeOpacity={0.8}
              onPress={() => router.push(option.route)}
              className="flex-row items-center gap-4 rounded-3xl bg-white border border-gray-200 px-5 py-5"
            >
              <View className="w-14 h-14 rounded-2xl bg-blue-50 items-center justify-center">
                <Ionicons name={option.icon} size={28} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold">{option.title}</Text>
                <Text className="text-gray-500 mt-1">{option.detail}</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>
        <View className="mt-8 mb-8">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-xl font-bold">Recently added</Text>
            <Text className="text-gray-400">Today</Text>
          </View>
          <View className="rounded-3xl bg-white border border-gray-200 p-4 gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold">Freelance income</Text>
              <Text className="text-green-600 font-bold">+ GH₵ 0.00</Text>
            </View>
            <View className="h-px bg-gray-100" />
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold">No new entries yet</Text>
              <Ionicons name="time-outline" size={18} color="#9ca3af" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
