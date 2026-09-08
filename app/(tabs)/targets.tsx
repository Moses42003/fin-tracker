import TargetCard from "@/components/targetcard";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TargetsTab() {
  return (
    <SafeAreaView className="flex flex-1 bg-white">
      {/* top view header */}
      <View className="flex flex-row items-center justify-between my-3 py-5 px-4">
        <Text className="text-3xl font-bold">My Targets</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex flex-row items-center gap-1"
        >
          <Ionicons name="add-outline" size={20} />
          <Text className="text-lg font-semibold text-gray-800">
            New Target
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="p-4 rounded-t-2xl">
        <View className="flex">
          <TargetCard name="Buy a Bike" amountDone={1000} totalAmount={3000} />
          <TargetCard name="New Laptop" amountDone={1200} totalAmount={3000} />
          <TargetCard name="Travel Trip" amountDone={750} totalAmount={3000} />
          <TargetCard
            name="Emergency Fund"
            amountDone={4000}
            totalAmount={5000}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
