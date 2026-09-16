import TargetCard from "@/components/targetcard";
import { listTargets, TargetResponse } from "@/lib/finance";
import { toNumber } from "@/lib/format";
import { useAsyncData } from "@/lib/useAsyncData";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TargetsTab() {
  const loader = useCallback(() => listTargets(), []);
  const { data, loading, error, refreshing, reload, refresh } =
    useAsyncData<TargetResponse[]>(loader);
  const targets = data ?? [];

  return (
    <SafeAreaView className="flex flex-1 bg-white">
      {/* top view header */}
      <View className="flex flex-row items-center justify-between my-3 py-5 px-4">
        <Text className="text-3xl font-bold">My Targets</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/targets/add")}
          className="flex flex-row items-center gap-1"
        >
          <Ionicons name="add-outline" size={20} />
          <Text className="text-lg font-semibold text-gray-800">
            New Target
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        className="p-4 rounded-t-2xl"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        {loading ? (
          <View className="items-center justify-center py-24">
            <ActivityIndicator size="large" color="#2563eb" />
            <Text className="text-gray-500 mt-4">Loading your targets…</Text>
          </View>
        ) : error ? (
          <View className="items-center justify-center py-24 px-8">
            <Ionicons name="cloud-offline-outline" size={56} color="#dc2626" />
            <Text className="text-2xl font-bold mt-4">Could not load</Text>
            <Text className="text-gray-500 text-center mt-2">{error}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={reload}
              className="mt-4 bg-slate-900 rounded-2xl px-6 py-3"
            >
              <Text className="text-white font-semibold">Try again</Text>
            </TouchableOpacity>
          </View>
        ) : targets.length ? (
          <View className="flex gap-3">
            {targets.map((target) => (
              <TargetCard
                key={target.id}
                id={target.id}
                name={target.name}
                amountDone={toNumber(target.current_amount)}
                totalAmount={toNumber(target.target_amount)}
              />
            ))}
          </View>
        ) : (
          <View className="items-center justify-center py-24 px-8">
            <Ionicons name="trophy-outline" size={56} color="#2563eb" />
            <Text className="text-2xl font-bold mt-4">No targets yet</Text>
            <Text className="text-gray-500 text-center mt-2">
              Create a target and give your next goal a finish line.
            </Text>
          </View>
        )}
      </ScrollView>
      <StatusBar barStyle={"dark-content"} />
    </SafeAreaView>
  );
}
