import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function TotalAmountCard() {
  return (
    <View className="flex gap-3">
      <View className="bg-violet-400/20 rounded-2xl px-3 py-5 gap-3">
        <Text className="text-gray-400 font-semibold">Total Balance</Text>
        <View className="flex flex-row items-center justify-between">
          <Text className="text-white font-bold text-3xl">GH₵ 3,850.50</Text>
          <Ionicons name="eye-outline" color="white" size={20} />
        </View>
      </View>
      <View className="flex flex-row items-center gap-4 justify-center">
        {/* Income Card*/}
        <View className="flex flex-1 bg-green-50 rounded-xl p-5 gap-3">
          <Text className="font-semibold flex items-center">
            Income <Ionicons name="arrow-up" color="green" size={20} />
          </Text>

          <View className="flex flex-row gap-2">
            <Text className="color-green-500 font-bold text-xl">GH₵</Text>
            <Text className="text-xl font-bold">4,259</Text>
          </View>
        </View>

        {/* Expenses Card */}
        <View className="flex flex-1 bg-red-50 rounded-xl p-5 gap-3">
          <Text className="font-semibold flex items-center">
            Expenses <Ionicons name="arrow-down" color="red" size={20} />
          </Text>

          <View className="flex flex-row gap-2">
            <Text className="color-red-500 font-bold text-xl">GH₵</Text>
            <Text className="text-xl font-bold">408.50</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
