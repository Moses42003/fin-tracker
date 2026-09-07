import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  name: string;
  amountDone: number;
  totalAmount: number;
}

export default function TargetCard({ amountDone, name, totalAmount }: Props) {
  return (
    <TouchableOpacity
      className="bg-slate-200 flex flex-1 rounded-2xl flex-row over overflow-hidden mb-3"
      activeOpacity={0.7}
    >
      <View className="bg-slate-400 flex flex-[.5] items-center justify-center">
        <Text className="font-bold">Image of target</Text>
      </View>
      <View className="flex flex-1 flex-col gap-3 p-4">
        <View className="flex flex-row justify-between">
          <Text className="text-xl font-semibold">Buy a Bike</Text>
          <View className="w-24 h-24 rounded-full border-4 border-green-600 flex items-center justify-center">
            <Text className="text-xl font-bold">
              {((amountDone / totalAmount) * 100).toFixed()}%
            </Text>
          </View>
        </View>

        <View className="flex flex-1 flex-row justify-end">
          <Text className="text-green-600 font-semibold text-lg">
            GH₵ {amountDone ? amountDone : 0}
          </Text>
          <Text className="font-semibold text-lg text-gray-400">
            {" "}
            / GH₵ {totalAmount ? totalAmount : 0}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
