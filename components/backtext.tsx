import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

interface Props {
  title: string;
}

export default function BackText({ title }: Props) {
  return (
    <TouchableOpacity
      className="flex flex-row items-center gap-3"
      activeOpacity={0.7}
      onPress={() => router.back()}
    >
      <Ionicons name="caret-back" size={15} />
      <Text className="text-xl font-bold">{title ? title : "Back"}</Text>
    </TouchableOpacity>
  );
}
