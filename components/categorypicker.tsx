import {
  DEFAULT_CATEGORIES,
  getCustomCategories,
} from "@/lib/categories";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// Re-exported so existing screens can keep importing it from the component.
export { DEFAULT_CATEGORIES };

interface Props {
  label?: string;
  value?: string;
  options?: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function CategoryPicker({
  label = "Category",
  value,
  options = DEFAULT_CATEGORIES,
  onChange,
  disabled = false,
}: Props) {
  const [extra, setExtra] = React.useState<string[]>([]);

  React.useEffect(() => {
    let active = true;
    getCustomCategories()
      .then((custom) => {
        if (!active) return;
        setExtra(custom);
      })
      .catch(() => {
        // Missing/extra categories are non-fatal; fall back to defaults.
      });
    return () => {
      active = false;
    };
  }, []);

  const allOptions = React.useMemo(() => {
    const merged = [...options];
    extra.forEach((item) => {
      if (!merged.some((existing) => existing === item)) merged.push(item);
    });
    return merged;
  }, [options, extra]);
  return (
    <View className="my-3">
      <View className="flex-row items-center justify-between mb-2 px-1">
        <Text className="text-lg font-semibold text-gray-700">{label}</Text>
        {value ? (
          <Text className="text-blue-600 font-semibold">{value}</Text>
        ) : (
          <Text className="text-gray-400">Optional</Text>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 2 }}
      >
        {allOptions.map((option) => {
          const selected = value === option;
          return (
            <TouchableOpacity
              key={option}
              activeOpacity={0.8}
              disabled={disabled}
              onPress={() => onChange(selected ? "" : option)}
              className={`flex-row items-center gap-2 rounded-2xl border-2 px-4 py-3 ${
                selected
                  ? "bg-blue-50 border-blue-500"
                  : "bg-white border-gray-300"
              }`}
            >
              {selected ? (
                <Ionicons name="checkmark-circle" size={18} color="#2563eb" />
              ) : null}
              <Text
                className={`font-semibold ${selected ? "text-blue-700" : "text-gray-600"}`}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
