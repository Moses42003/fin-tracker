import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface Props {
  title: string;
  date?: string;
  income?: boolean;
  amount?: number;
  color?: "green" | "red" | "orange";
  category?: string;
}

export default function TransactionCard({
  income,
  amount,
  color,
  title,
  date,
  category,
}: Props) {
  const accent = income ? "#16a34a" : "#dc2626";
  const surface = income ? "#f0fdf4" : "#fff7ed";
  const icon = income ? "arrow-down-left" : "arrow-up-right";
  return (
    <View className="flex-row items-center justify-between rounded-3xl border border-gray-200 bg-white px-4 py-4">
      <View className="flex flex-row gap-3 items-center">
        <View
          className="w-12 h-12 rounded-2xl items-center justify-center"
          style={{ backgroundColor: surface }}
        >
          {/* @ts-ignore Ionicons accepts these runtime names. */}
          <Ionicons name={icon} color={accent} size={25} />
        </View>

        <View className="gap-1">
          <Text className="font-bold text-base">
            {title || "Untitled record"}
          </Text>
          <Text className="text-gray-500 text-sm">
            {category || "General"} · {date || "Today"}
          </Text>
        </View>
      </View>

      <Text className="font-bold text-base" style={{ color: accent }}>
        {income ? "+" : "-"} GH₵ {(amount || 0).toFixed(2)}
      </Text>
    </View>
  );
}
