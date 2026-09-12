import GreetingCard from "@/components/greetingcard";
import TotalAmountCard from "@/components/totalamountcard";
import TransactionCard from "@/components/transcard";
import { getFinancialSummary, transactionData } from "@/lib/mockData";
import { displayName, getSessionUser, SessionUser } from "@/lib/session";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeTab() {
  const summary = getFinancialSummary(transactionData);
  const donutData = [
    { text: "Income", value: summary.incomeShare, color: "#16a34a" },
    { text: "Expense", value: summary.expenseShare, color: "#dc2626" },
    {
      text: "Savings",
      value: Math.max(100 - summary.incomeShare - summary.expenseShare, 0),
      color: "#f59e0b",
    },
  ].filter((item) => item.value > 0);

  const [renderChart, setRenderCart] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setRenderCart(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    getSessionUser().then(setUser);
  }, []);

  return (
    <SafeAreaView className="flex flex-1 bg-violet-950 pt-10">
      <View className="flex px-5 mb-4">
        <GreetingCard
          name={displayName(user)}
          iconOnPress={() => router.push("/notification")}
        />
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

          {renderChart ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/transaction/analytics")}
              className="flex items-center flex-1 p-3 rounded-2xl border-2 border-gray-300 gap-3 bg-white h-max"
              style={{
                shadowColor: "gray",
                shadowOffset: { width: 0, height: 3 },
                shadowRadius: 2,
                shadowOpacity: 0.4,
              }}
            >
              {/* Circle Analytic */}
              <View className="h-[180px] items-center justify-center">
                <PieChart
                  // key={chartKey}
                  data={donutData}
                  donut
                  radius={90}
                  innerRadius={55}
                  strokeColor="white"
                  strokeWidth={4}
                  backgroundColor="white"
                  centerLabelComponent={() => (
                    <View className="items-center justify-center">
                      <Text className="font-bold text-3xl">
                        {summary.incomeShare}%
                      </Text>
                    </View>
                  )}
                />
              </View>

              {/* Lengends */}
              <View className="flex-row flex-wrap justify-center gap-3">
                {donutData.map((item) => (
                  <View key={item.text} className="flex-row items-center gap-2">
                    <View
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <Text className="text-gray-500 text-sm font-semibold">
                      {item.text} ({item.value}%)
                    </Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ) : (
            <View className="w-full h-72 bg-gray-200 rounded-3xl items-center justify-center">
              <ActivityIndicator size="small" />
            </View>
          )}
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

          <View className="gap-3">
            {transactionData.slice(0, 4).map((transaction) => (
              <TransactionCard
                key={transaction.id}
                title={transaction.title}
                amount={transaction.amount}
                income={transaction.kind === "income"}
                category={transaction.category}
                date={transaction.date}
              />
            ))}
          </View>
        </View>

        <View className="flex-1 h-10"></View>
      </ScrollView>
      <StatusBar barStyle={"light-content"} />
    </SafeAreaView>
  );
}
