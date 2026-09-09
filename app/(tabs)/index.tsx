import GreetingCard from "@/components/greetingcard";
import TotalAmountCard from "@/components/totalamountcard";
import TransactionCard from "@/components/transcard";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeTab() {
  return (
    <View className="flex flex-1 bg-violet-950 pt-10">
      <View className="flex px-5 mb-4">
        <GreetingCard name="CodeTech" />
        <TotalAmountCard />
      </View>
      <ScrollView
        className="flex flex-1 h-max bg-white rounded-t-3xl px-3 py-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Analytics Card View */}
        <View className="px-3 mb-4">
          <View className="flex flex-row items-center justify-between mb-5">
            <Text className="text-xl font-bold">Quick Overview</Text>
            {/* Period Drop Down */}
            <View className="h-8 w-20 bg-slate-200 rounded-2xl"></View>
          </View>

          <View className="flex flex-row items-center flex-1 p-3 rounded-2xl border-2 border-gray-300 gap-3">
            {/* Circle Analytic */}
            <View className="w-32 h-32 rounded-full border-[15px] border-violet-700 flex items-center justify-center">
              <Text className="text-2xl font-bold">72%</Text>
            </View>

            <View className="flex gap-5">
              <View className="flex flex-row items-center gap-3">
                <View className="bg-green-500 w-3 h-3 rounded-full"></View>
                <Text className="font-semibold">Needs</Text>
                <Text className="font-semibold">55%</Text>
                <Text className="font-semibold">GH₵ 800.00</Text>
              </View>
              <View className="flex flex-row items-center justify-between">
                <View className="bg-violet-500 w-3 h-3 rounded-full"></View>
                <Text className="font-semibold">Wants</Text>
                <Text className="font-semibold">25%</Text>
                <Text className="font-semibold">GH₵ 700.00</Text>
              </View>

              <View className="flex flex-row items-center justify-between">
                <View className="bg-red-500 w-3 h-3 rounded-full"></View>
                <Text className="font-semibold">Savings</Text>
                <Text className="font-semibold">37%</Text>
                <Text className="font-semibold">GH₵ 500.00</Text>
              </View>
            </View>
          </View>
        </View>
        {/* Recent Transaction card list */}
        <View className="px-3">
          {/* Head (Recent transactions) */}
          <View className="flex flex-row items-center justify-between mb-5">
            <Text className="font-bold text-xl">Recent Transactions</Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.navigate("/(tabs)/transactions")}
            >
              <Text className="text-gray-500 font-semibold text-lg">
                See all
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex gap-9">
            <TransactionCard title="School Fees" />
            <TransactionCard title="Food & Meals" />
            <TransactionCard income title="Freelance Work" />
            <TransactionCard income title="Gift" color="orange" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
