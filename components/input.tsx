import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

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
  const inputRef = useRef<TextInput | null>(null);
  // Managed internally so any password field gets a working eye toggle without
  // every screen having to hold its own visibility state.
  const [revealed, setRevealed] = useState(false);

  return (
    <View
      className={`flex-1 border-2 p-2 rounded-2xl bg-white dark:bg-slate-900 my-3 ${
        error ? "border-red-500 bg-red-50" : "border-gray-300 dark:border-slate-700"
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
          ref={inputRef}
          placeholder={placeHolder || "PlaceHolder"}
          placeholderTextColor="gray"
          secureTextEntry={secure ? !revealed : false}
          editable={editable}
          onBlur={onBlur}
          onChangeText={onChangeText}
          value={value}
          // @ts-ignore
          keyboardType={keyboardType}
          autoCapitalize={secure ? "none" : undefined}
          autoCorrect={secure ? false : undefined}
          className="text-lg flex-1 h-10 text-gray-700 dark:text-slate-200 font-semibold"
        />

        {secure ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setRevealed((current) => !current)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={revealed ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="gray"
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
