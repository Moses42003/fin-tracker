import ProfileAvatar from "@/components/profileavatar";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  profile?: boolean;
  name: string | "CodeTech";
  iconOnPress?: () => void;
}

export default function GreetingCard({ profile, name, iconOnPress }: Props) {
  return (
    <View className="flex mb-5">
      {profile ? (
        <View className="flex justify-center gap-2 items-center">
          {/* Reads the cached profile image itself, so it updates after upload */}
          <ProfileAvatar size={112} backgroundColor="#ffffff" />
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
            <ProfileAvatar size={56} backgroundColor="#ffffff" />
            <View className="gap-2">
              <Text className="font-bold text-xl color-white">
                Hello {name}
              </Text>
              <Text className="color-gray-200 font-semibold">
                Good morning!
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={iconOnPress} activeOpacity={0.7}>
            <Ionicons name="notifications" size={25} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
