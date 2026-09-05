import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  profile?: boolean;
  name: string | "CodeTech";
}

export default function GreetingCard({ profile, name }: Props) {
  return (
    <View className="flex mb-5">
      {profile ? (
        <View className="flex justify-center gap-2 items-center">
          <View className="bg-white rounded-full w-28 h-28"></View>
          <View className="gap-2">
            <Text className="font-bold text-2xl color-white text-center">
              {name}
            </Text>
            <Text className="color-gray-200 font-semibold text-lg">
              Stay focused, keep moving
            </Text>
          </View>
        </View>
      ) : (
        <View className="flex items-center flex-row justify-between">
          <View className="flex flex-row items-center gap-2">
            <View className="bg-white rounded-full w-14 h-14"></View>
            <View className="gap-2">
              <Text className="font-bold text-xl color-white">
                Hello {name}
              </Text>
              <Text className="color-gray-200 font-semibold">
                Good morning!
              </Text>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications" size={25} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
