import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { TextInput, View } from "react-native";

interface Props {
  placeHolder?: string;
  icon?: string;
  keyboardType?: string;
  secure?: boolean;
  onChangeText?: (e: string) => void;
  value?: string;
  editable?: boolean;
  error?: boolean;
  onBlur?: () => void;
}

export default function InputText({
  icon,
  placeHolder,
  keyboardType,
  secure,
  onChangeText,
  value,
  editable = true,
  error = false,
  onBlur,
}: Props) {
  const inputRef = useRef(null);
  return (
    <View
      className={`flex-1 border-2 p-2 rounded-2xl bg-white my-3 ${
        error ? "border-red-500 bg-red-50" : "border-gray-300"
      }`}
    >
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
          editable={editable}
          onBlur={onBlur}
          onChangeText={onChangeText}
          value={value}
          // @ts-ignore
          keyboardType={keyboardType}
          className="text-lg flex-1 h-10 text-gray-700 font-semibold"
        />
      </View>
    </View>
  );
}
