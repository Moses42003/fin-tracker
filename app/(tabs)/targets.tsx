import TargetCard from "@/components/targetcard";
import { targetData } from "@/lib/mockData";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TargetsTab() {
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
      >
        {targetData.length ? (
          <View className="flex gap-3">
            {targetData.map((target) => (
              <TargetCard
                key={target.id}
                name={target.name}
                amountDone={target.saved}
                totalAmount={target.total}
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
