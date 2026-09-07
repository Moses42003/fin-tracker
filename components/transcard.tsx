import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface Props {
  title: string;
  date?: string;
  income?: boolean;
  amount?: number;
  color?: "green" | "red" | "orange";
}

export default function TransactionCard({
  income,
  amount,
  color,
  title,
  date,
}: Props) {
  let currentColor =
    color === "green" && income
      ? "#86efac"
      : color === "orange"
        ? "#ffedd5"
        : color === "red"
          ? "#fee2e2"
          : "#fee2e2";
  return (
    <View className="flex flex-row items-center justify-between">
      <View className="flex flex-row gap-3 items-center">
        {/* Icon if expense or income */}
        {income ? (
          <View
            className="p-4 rounded-2xl flex items-center justify-center"
            style={{
              backgroundColor: income && !color ? "#86efac" : currentColor,
            }}
          >
            <Ionicons
              name="wallet"
              color={income && !color ? "green" : color}
              size={35}
            />
          </View>
        ) : (
          <View
            className="p-4 rounded-2xl flex items-center justify-center"
            style={{
              backgroundColor: !income && !color ? "#fee2e2" : currentColor,
            }}
          >
            <Ionicons
              name="wallet"
              color={
                !income && !color ? "red" : color === "green" ? "red" : color
              }
              size={35}
            />
          </View>
        )}

        <View className="flex gap-2">
          <Text className="font-bold text-lg">{title ? title : "title"}</Text>
          <Text>{date ? date : "May 15, 2016"}</Text>
        </View>
      </View>

      <View>
        {income === true ? (
          <Text className="font-bold text-xl text-green-500">
            + GH₵ {amount ? amount : "0.00"}
          </Text>
        ) : (
          <Text className="font-bold text-xl text-red-500">
            - GH₵ {amount ? amount : "0.00"}
          </Text>
        )}
      </View>
    </View>
  );
}
