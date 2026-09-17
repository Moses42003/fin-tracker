import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const DEFAULT_COLOR = "#2563eb";

interface Props {
  id?: string;
  name: string;
  amountDone: number;
  totalAmount: number;
  status?: string;
  /** Hex colour chosen when the target was created (#RRGGBB). */
  color?: string | null;
}

function money(value: number) {
  return `GH₵ ${(Number.isFinite(value) ? value : 0).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;
}

export default function TargetCard({
  id,
  amountDone,
  name,
  totalAmount,
  status,
  color,
}: Props) {
  const percentage = totalAmount
    ? Math.min((amountDone / totalAmount) * 100, 100)
    : 0;
  const completed = status === "completed" || percentage >= 100;
  // Colour picked on the Add Target page, carried through from the API.
  const accent = completed ? "#f59e0b" : color || DEFAULT_COLOR;

  return (
    <TouchableOpacity
      className="bg-white flex-1 rounded-3xl flex-row overflow-hidden mb-3 border"
      style={{ borderColor: `${accent}55` }}
      activeOpacity={0.7}
      onPress={() => router.push(`/targets/${id || name}`)}
    >
      <View
        className="w-24 items-center justify-center"
        style={{ backgroundColor: `${accent}22` }}
      >
        <View
          className="w-12 h-12 rounded-2xl items-center justify-center"
          style={{ backgroundColor: accent }}
        >
          <Ionicons
            name={completed ? "trophy" : "flag"}
            size={22}
            color="white"
          />
        </View>
      </View>

      <View className="flex-1 gap-3 p-4">
        <View className="flex-row justify-between items-start gap-3">
          <View className="flex-1">
            <Text className="text-xl font-bold">{name}</Text>
            {completed ? (
              <View className="flex-row items-center gap-1 mt-2 self-start rounded-full bg-amber-100 border-amber-300 px-3 py-1">
                <Ionicons name="trophy" size={14} color="#d97706" />
                <Text className="text-amber-700 font-bold text-xs">
                  COMPLETED
                </Text>
              </View>
            ) : null}
          </View>

          <View
            className="w-16 h-16 rounded-full border-4 items-center justify-center"
            style={{ borderColor: accent }}
          >
            {completed ? (
              <Ionicons name="checkmark" size={26} color="#d97706" />
            ) : (
              <Text className="text-xl font-bold">{percentage.toFixed()}%</Text>
            )}
          </View>
        </View>

        <View className="h-2 rounded-full bg-gray-100 overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{ width: `${percentage}%`, backgroundColor: accent }}
          />
        </View>

        <View className="flex-row justify-end">
          <Text className="font-semibold text-lg" style={{ color: accent }}>
            {money(amountDone)}
          </Text>
          <Text className="font-semibold text-lg text-gray-400">
            {" "}
            / {money(totalAmount)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
