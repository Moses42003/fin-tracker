import BackText from "@/components/backtext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AnalyticScreen() {
  return (
    <SafeAreaView className="flex-1 py-5 px-4 bg-white">
      <View className="mb-4">
        <BackText />
      </View>
      <Text className="text-3xl px-3 my-3 font-bold">Analytics</Text>
      <ScrollView className="px-4 py-5">
        <View className="flex-row items-center gap-3">
          {/* Sending */}
          <View className="bg-white rounded-2xl border-2 border-gray-300 p-4 flex-1 gap-2">
            <Text className="text-lg font-semibold text-gray-500">
              Total Spending
            </Text>
            <Text className="text-2xl font-semibold text-green-700">
              GH₵ 1,500.52
            </Text>
            <View className="flex-row items-center gap-2">
              <Ionicons name="arrow-down" size={10} color="green" />
              <Text className="font-semibold text-sm text-gray-500">
                From last month
              </Text>
            </View>
          </View>

          {/* income */}
          <View className="bg-white rounded-2xl border-2 border-gray-300 p-4 flex-1 gap-2">
            <Text className="text-lg font-semibold text-gray-500">
              Total Income
            </Text>
            <Text className="text-2xl font-semibold text-green-700">
              GH₵ 1,500.52
            </Text>

            <View className="flex-row items-center gap-2">
              <Ionicons name="arrow-down" size={10} color="green" />
              <Text className="font-semibold text-sm text-gray-500">
                From last month
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-7 mb-4">
          <Text className="text-xl font-bold">Spending Overview</Text>
          <View className="flex-1 h-72 my-3 bg-gray-300 rounded-3xl items-center justify-center">
            <Text className="font-bold text-2xl">Bar Chart</Text>
          </View>
        </View>

        <View className="gap-3">
          <Text className="text-xl font-bold">Top Spending Category</Text>
        </View>
      </ScrollView>
      <StatusBar barStyle={"dark-content"} />
    </SafeAreaView>
  );
}
