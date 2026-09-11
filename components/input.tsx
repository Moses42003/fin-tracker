import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { TextInput, View } from "react-native";

interface Props {
  placeHolder?: string;
  icon?: string;
  keyboardType?: string;
  secure?: boolean;
}

export default function InputText({
  icon,
  placeHolder,
  keyboardType,
  secure,
}: Props) {
  const inputRef = useRef(null);
  return (
    <View className="w-full border-2 border-gray-300 p-2 rounded-2xl bg-white my-3">
      <View className="flex-row gap-3 items-center">
        <Ionicons
          // @ts-ignore
          name={icon || "person-outline"}
          size={20}
          color="gray"
        />
        <TextInput
          // @ts-ignore
          onPress={() => inputRef.current?.focus()}
          placeholder={placeHolder || "PlaceHolder"}
          placeholderTextColor="gray"
          secureTextEntry={secure}
          // @ts-ignore
          keyboardType={keyboardType}
          className="text-lg flex-1 h-10 text-gray-700 font-semibold"
        />
      </View>
    </View>
  );
}
