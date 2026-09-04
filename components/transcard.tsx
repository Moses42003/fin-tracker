import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface Props {
  income?: boolean;
  amount?: number;
}

export default function TransactionCard({ income, amount }: Props) {
  return (
    <View className="flex flex-row items-center justify-between">
      <View className="flex flex-row gap-3 items-center">
        {/* Icon if expense or income */}
        {income ? (
          <View className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
            <Ionicons name="wallet" color="green" size={35} />
          </View>
        ) : (
          <View className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center">
            <Ionicons name="wallet" color="red" size={35} />
          </View>
        )}

        <View className="flex gap-2">
          <Text className="font-bold text-lg">School Fees</Text>
          <Text>May 20, 2025</Text>
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
