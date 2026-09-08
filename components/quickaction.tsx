import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  name: string;
  iconName:
    | "trash-outline"
    | "pencil-outline"
    | "pause-outline"
    | "add-outline";
  onPress?: () => void;
}

export default function QuickActionButton({ iconName, name, onPress }: Props) {
  return (
    <TouchableOpacity
      className="flex justify-center items-center gap-2"
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View
        className="p-3 rounded-3xl border-2 border-gray-300 flex items-center justify-center"
        style={{
          backgroundColor: iconName === "trash-outline" ? "#fecaca" : "#f1f5f9",
        }}
      >
        <Ionicons
          name={iconName}
          size={20}
          color={iconName === "trash-outline" ? "red" : ""}
        />
      </View>
      <Text
        className="font-semibold"
        style={{ color: iconName === "trash-outline" ? "red" : "#6b7280" }}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
}
