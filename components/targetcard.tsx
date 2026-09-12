import { router } from "expo-router";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";

interface Props {
  id?: string;
  name: string;
  amountDone: number;
  totalAmount: number;
}

export default function TargetCard({
  id,
  amountDone,
  name,
  totalAmount,
}: Props) {
  const percentage = totalAmount
    ? Math.min((amountDone / totalAmount) * 100, 100)
    : 0;
  return (
    <TouchableOpacity
      className="bg-white flex flex-1 rounded-3xl flex-row overflow-hidden mb-3 border border-gray-200"
      activeOpacity={0.7}
      onPress={() => router.push(`/targets/${id || name}`)}
    >
      <ImageBackground
        source={require("../assets/BG Asset/image_bg_two.png")}
        className="bg-slate-300 flex flex-[.5] items-center justify-center rounded-r-2xl overflow-hidden"
      >
        {/* <Text className="font-bold">Image of target</Text> */}
      </ImageBackground>
      <View className="flex flex-1 flex-col gap-3 p-4">
        <View className="flex flex-row justify-between items-start gap-3">
          <Text className="text-xl font-bold flex-1">{name}</Text>
          <View className="w-16 h-16 rounded-full border-4 border-blue-600 flex items-center justify-center">
            <Text className="text-xl font-bold">{percentage.toFixed()}%</Text>
          </View>
        </View>

        <View className="flex flex-1 flex-row justify-end">
          <Text className="text-green-600 font-semibold text-lg">
            GH₵ {amountDone ? amountDone.toLocaleString("en-US") : 0}
          </Text>
          <Text className="font-semibold text-lg text-gray-400">
            {" "}
            / GH₵ {totalAmount ? totalAmount.toLocaleString("en-US") : 0}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
