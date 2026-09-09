import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddTab() {
  return (
    <SafeAreaView className="flex flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold mb-5">
        What would you like to Add?
      </Text>

      <View className="flex mt-4 gap-4">
        {/* Income Card */}
        <TouchableOpacity
          className="flex flex-row items-center justify-center gap-3 p-3 rounded-3xl border-2 border-green-700"
          activeOpacity={0.7}
        >
          <Ionicons name="wallet-outline" size={30} color="green" />
          <View>
            <View className="flex flex-row items-center justify-between pr-5">
              <Text className="font-bold text-2xl text-green-700">Income</Text>
              <Text className="text-green-700 font-bold text-xl">++ ₵</Text>
            </View>
            <Text className="text-lg font-semibold text-gray-500">
              Add the money you have received
            </Text>
          </View>
        </TouchableOpacity>
        {/* Expense Card */}
        <TouchableOpacity
          className="flex flex-row items-center justify-center gap-3 p-3 rounded-3xl border-2 border-red-600"
          activeOpacity={0.7}
        >
          <Ionicons name="wallet-outline" size={30} color="red" />
          <View>
            <View className="flex flex-row items-center justify-between pr-5">
              <Text className="font-bold text-2xl text-red-600">Expense</Text>
              <Text className="text-red-600 font-bold text-xl">-- ₵</Text>
            </View>
            <Text className="text-lg font-semibold text-gray-500">
              Add the cash that moved out
            </Text>
          </View>
        </TouchableOpacity>
        {/* Target */}
        <TouchableOpacity
          className="flex flex-row items-center justify-center gap-3 p-3 rounded-3xl border-2 border-blue-600"
          activeOpacity={0.7}
        >
          <Ionicons name="trophy-outline" size={30} color="blue" />
          <View>
            <View className="flex flex-row items-center justify-between pr-5">
              <Text className="font-bold text-2xl text-blue-600">Target</Text>
            </View>
            <Text className="text-lg font-semibold text-gray-500">
              Add a target to save towards
            </Text>
          </View>
        </TouchableOpacity>

        {/* Category */}
        <TouchableOpacity
          className="flex flex-row items-center justify-center gap-3 p-3 rounded-3xl border-2 border-orange-400"
          activeOpacity={0.7}
        >
          <Ionicons name="grid-outline" size={30} color="orange" />
          <View>
            <View className="flex flex-row items-center justify-between pr-5">
              <Text className="font-bold text-2xl text-orange-400">
                Category
              </Text>
            </View>
            <Text className="text-lg font-semibold text-gray-500">
              Add a transaction category
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
