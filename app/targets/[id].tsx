import BackText from "@/components/backtext";
import CustomButton from "@/components/custombutton";
import { targetData } from "@/lib/mockData";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TargetPage() {
  const { id = "" } = useLocalSearchParams<{ id?: string }>();
  const target = targetData.find((item) => item.id === id) || targetData[0];
  const percentage = Math.min(
    Math.round((target.saved / target.total) * 100),
    100,
  );
  const remaining = Math.max(target.total - target.saved, 0);

  return (
    <SafeAreaView className="flex-1 bg-slate-50 px-5 py-5">
      <BackText title="My Targets" />
      <ScrollView showsVerticalScrollIndicator={false} className="mt-6">
        <View className="rounded-3xl bg-slate-900 p-6">
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="text-slate-400 font-semibold">TARGET</Text>
              <Text className="text-white text-3xl font-bold mt-2">
                {target.name}
              </Text>
              <Text className="text-slate-400 mt-2">Due {target.date}</Text>
            </View>
            <View className="w-16 h-16 rounded-full border-4 border-blue-400 items-center justify-center">
              <Text className="text-white font-bold">{percentage}%</Text>
            </View>
          </View>
          <View className="h-3 rounded-full bg-slate-700 mt-8 overflow-hidden">
            <View
              className="h-full rounded-full bg-blue-400"
              style={{ width: `${percentage}%` }}
            />
          </View>
          <View className="flex-row justify-between mt-3">
            <Text className="text-slate-300">
              GH₵ {target.saved.toLocaleString()} saved
            </Text>
            <Text className="text-slate-400">
              of GH₵ {target.total.toLocaleString()}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3 mt-4">
          <View className="flex-1 rounded-2xl bg-white border border-gray-200 p-4">
            <Text className="text-gray-500">Remaining</Text>
            <Text className="text-2xl font-bold mt-2">
              GH₵ {remaining.toLocaleString()}
            </Text>
          </View>
          <View className="flex-1 rounded-2xl bg-white border border-gray-200 p-4">
            <Text className="text-gray-500">Progress</Text>
            <Text className="text-2xl font-bold mt-2">{percentage}%</Text>
          </View>
        </View>

        <View className="rounded-3xl bg-white border border-gray-200 p-5 mt-4">
          <Text className="text-xl font-bold">Next step</Text>
          <Text className="text-gray-500 mt-2">
            Add money regularly to keep this target moving.
          </Text>
          <CustomButton
            name="Add money"
            color="white"
            bgColor="#2563eb"
            onPress={() =>
              router.push("/transaction/addScreen?type=target contribution")
            }
          />
        </View>

        <View className="items-center mt-6 mb-8">
          <Ionicons name="sparkles-outline" size={24} color="#2563eb" />
          <Text className="text-gray-500 mt-2">
            Small steps become big wins.
          </Text>
        </View>
      </ScrollView>
      <StatusBar barStyle="dark-content" />
    </SafeAreaView>
  );
}
