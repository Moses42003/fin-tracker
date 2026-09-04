import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function GreetingCard() {
  return (
    <View className="flex flex-row justify-between items-center mb-5">
      <View className="flex flex-row items-center gap-2">
        <View className="bg-white rounded-full w-14 h-14"></View>
        <View className="gap-2">
          <Text className="font-bold text-xl color-white">Hello CodeTech</Text>
          <Text className="color-gray-200 font-semibold">Good morning!</Text>
        </View>
      </View>
      <TouchableOpacity activeOpacity={0.7}>
        <Ionicons name="notifications" size={25} color="white" />
      </TouchableOpacity>
    </View>
  );
}
