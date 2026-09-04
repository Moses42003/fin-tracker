import GreetingCard from "@/components/greetingcard";
import TotalAmountCard from "@/components/totalamountcard";
import TransactionCard from "@/components/transcard";
import { Link } from "expo-router";
import { ScrollView, StatusBar, Text, View } from "react-native";

export default function HomeTab() {
  return (
    <View className="flex flex-1 bg-violet-950 pt-10">
      <View className="flex flex-1 px-5 mb-4">
        <GreetingCard />
        <TotalAmountCard />
      </View>
      <ScrollView className="flex flex-1 h-max bg-white rounded-t-3xl px-3 py-5">
        {/* Recent Transaction card list */}
        <View className="px-3">
          {/* Head (Recent transactions) */}
          <View className="flex flex-row items-center justify-between mb-5">
            <Text className="font-bold text-xl">Recent Transactions</Text>

            <Link href={"/(tabs)/transactions"} className="color-gray-500">
              See all
            </Link>
          </View>

          <View className="flex gap-7">
            <TransactionCard />
            <TransactionCard />
            <TransactionCard income />
            <TransactionCard income />
          </View>
        </View>
      </ScrollView>

      <StatusBar barStyle={"light-content"} />
    </View>
  );
}
