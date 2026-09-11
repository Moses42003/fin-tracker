import { router } from "expo-router";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";

interface Props {
  name: string;
  amountDone: number;
  totalAmount: number;
}

export default function TargetCard({ amountDone, name, totalAmount }: Props) {
  return (
    <TouchableOpacity
      className="bg-slate-100 flex flex-1 rounded-2xl flex-row over overflow-hidden mb-3 border-2 border-gray-300"
      activeOpacity={0.7}
      onPress={() => router.push(`/targets/${name}`)}
    >
      <ImageBackground
        source={require("../assets/BG Asset/image_bg_two.png")}
        className="bg-slate-300 flex flex-[.5] items-center justify-center rounded-r-2xl overflow-hidden"
      >
        {/* <Text className="font-bold">Image of target</Text> */}
      </ImageBackground>
      <View className="flex flex-1 flex-col gap-3 p-4">
        <View className="flex flex-row justify-between">
          <Text className="text-xl font-semibold">{name}</Text>
          <View className="w-24 h-24 rounded-full border-4 border-green-600 flex items-center justify-center">
            <Text className="text-xl font-bold">
              {((amountDone / totalAmount) * 100).toFixed()}%
            </Text>
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
