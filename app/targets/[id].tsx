import BackText from "@/components/backtext";
import QuickActionButton from "@/components/quickaction";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TargetPage() {
  const { id } = useLocalSearchParams();
  return (
    <SafeAreaView className="pt-5 px-4 flex flex-1">
      <View className="flex flex-row items-center justify-between mb-8">
        {/* Back */}
        <BackText title="My Targets" />

        {/* Three Dot: Menu */}
        <View className="w-16 h-6 rounded-2xl bg-slate-300"></View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          className="flex flex-1 rounded-3xl overflow-hidden bg-slate-300 border-2 border-gray-300 mb-3"
          style={{
            shadowColor: "gray",
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 2,
            shadowOpacity: 0.4,
          }}
        >
          <View className="flex flex-1 bg-slate-300 gap-4">
            <View className="bg-slate-200 flex flex-[.4] align-center justify-center gap-2 py-3">
              <Text className="text-3xl text-center font-semibold">{id}</Text>

              <Text className="text-center text-lg">
                Target Date: Jun 20, 2015
              </Text>
            </View>

            {/* Image Space */}
            <View className="flex items-center justify-center flex-1 h-64">
              <Text className="text-2xl font-bold">Image Here</Text>
            </View>
          </View>

          {/* Circle Progress Loader Analytics */}
          <View className="px-6 py-4 rounded-t-2xl bg-white">
            <View className="flex flex-row justify-between items-center mb-3">
              {/* Circle Progress */}
              <View className="w-36 h-36 rounded-full border-8 border-green-600 flex items-center justify-center">
                <Text className="text-2xl font-bold">65%</Text>
              </View>

              <View className="gap-3">
                <View className="gap-2">
                  <Text className="text-lg text-gray-400 font-semibold">
                    Saved
                  </Text>
                  <Text className="text-2xl font-semibold">GH₵ 1,950.00</Text>
                </View>
                <View className="gap-2">
                  <Text className="text-lg text-gray-400 font-semibold">
                    Saved
                  </Text>
                  <Text className="text-2xl font-semibold">GH₵ 3,000.00</Text>
                </View>
              </View>
            </View>

            {/* Remaining */}
            <View className="flex flex-row items-center gap-2 justify-center">
              <Text className="text-lg font-semibold text-gray-400">
                Remaining:
              </Text>
              <Text className="text-xl font-semibold text-gray-700">
                GH₵ 1,050.00
              </Text>
            </View>
          </View>
        </View>

        {/* Graph Analysis */}
        <View className="bg-white border-2 border-gray-300 mb-3 p-3 rounded-3xl">
          <View className="flex flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold">Progress Over Time</Text>
            {/* Time Change Drop Down */}
            <View className="bg-slate-300 h-8 w-20 rounded-2xl"></View>
          </View>

          {/* Graph */}
          <View className="w-full h-60 bg-slate-200 rounded-2xl"></View>
        </View>

        <View className="flex bg-white border-2 border-gray-300 p-3 rounded-3xl">
          <Text className="text-xl font-bold mb-3">Quick Actions</Text>

          <View className="flex flex-row items-center justify-evenly">
            <QuickActionButton name="Add Money" iconName="add-outline" />
            <QuickActionButton name="Edit Target" iconName="pencil-outline" />
            <QuickActionButton name="Pause" iconName="pause-outline" />
            <QuickActionButton name="Delete" iconName="trash-outline" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
