import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  name: string;
  last?: boolean;
  value?: string;
  icon?:
    | "notifications-outline"
    | "cash-outline"
    | "information-circle-outline"
    | "cloud-outline"
    | "color-fill-outline"
    | "wallet-outline"
    | "";
}

export default function SettingOption({ last, value, icon, name }: Props) {
  return (
    <TouchableOpacity
      className="flex flex-row items-center justify-between border-gray-300 py-5"
      activeOpacity={0.7}
      style={{ borderBottomWidth: last ? 0 : 1 }}
    >
      <View className="flex flex-row items-center gap-4">
        <Ionicons name={icon} color="gray" size={24} />
        <Text className="text-xl font-semibold">{name}</Text>
      </View>
      <View className="flex flex-row gap-3">
        <Text className="font-semibold text-gray-500 text-xl">
          {value ? value : ""}
        </Text>
        <Ionicons name="caret-forward-outline" size={18} color="gray" />
      </View>
    </TouchableOpacity>
  );
}
