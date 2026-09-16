import GreetingCard from "@/components/greetingcard";
import TotalAmountCard from "@/components/totalamountcard";
import TransactionCard from "@/components/transcard";
import {
    DashboardSummary,
    getDashboardSummary,
    getDashboardOverview,
    DashboardOverview,
} from "@/lib/finance";
import { shortDate, toNumber } from "@/lib/format";
import { displayName, getSessionUser, SessionUser } from "@/lib/session";
import { useAsyncData } from "@/lib/useAsyncData";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeTab() {
  const summaryLoader = useCallback(() => getDashboardSummary(), []);
  const overviewLoader = useCallback(() => getDashboardOverview(), []);
  const {
    data: summary,
    loading,
    error,
    refreshing,
    refresh,
  } = useAsyncData<DashboardSummary>(summaryLoader);
  const { data: overview, reload: reloadOverview } =
    useAsyncData<DashboardOverview>(overviewLoader);

  const recent = (summary?.recent_transactions ?? []).slice(0, 4);
  const totalIncome = toNumber(summary?.total_income);
  const totalExpenses = toNumber(summary?.total_expenses);
  const total = totalIncome + totalExpenses;
  const incomeShare = total ? Math.round((totalIncome / total) * 100) : 0;
  const expenseShare = total ? Math.round((totalExpenses / total) * 100) : 0;

  const donutData = [
    { text: "Income", value: incomeShare, color: "#16a34a" },
    { text: "Expense", value: expenseShare, color: "#dc2626" },
    {
      text: "Savings",
      value: Math.max(100 - incomeShare - expenseShare, 0),
      color: "#f59e0b",
    },
  ].filter((item) => item.value > 0);

  const [renderChart, setRenderCart] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);

  function handleRefresh() {
    refresh();
    reloadOverview();
  }

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
        <TotalAmountCard
          balance={overview?.balance ?? summary?.total_balance}
          income={overview?.income ?? summary?.total_income}
          expenses={overview?.expenses ?? summary?.total_expenses}
        />
      </View>
      <ScrollView
        className="flex flex-1 h-max bg-white rounded-t-3xl px-3 py-5"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
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
                      <Text className="font-bold text-3xl">{incomeShare}%</Text>
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

          {loading ? (
            <View className="items-center justify-center py-10">
              <ActivityIndicator size="small" color="#4c1d95" />
              <Text className="text-gray-500 mt-3">Loading your records…</Text>
            </View>
          ) : error ? (
            <View className="items-center justify-center py-10 px-6">
              <Ionicons
                name="cloud-offline-outline"
                size={40}
                color="#dc2626"
              />
              <Text className="text-lg font-bold mt-3">Could not load</Text>
              <Text className="text-gray-500 text-center mt-1">{error}</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleRefresh}
                className="mt-3 bg-slate-900 rounded-2xl px-5 py-2"
              >
                <Text className="text-white font-semibold">Try again</Text>
              </TouchableOpacity>
            </View>
          ) : recent.length ? (
            <View className="gap-3">
              {recent.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  title={
                    transaction.description ||
                    transaction.category ||
                    "Untitled record"
                  }
                  amount={Number(transaction.amount)}
                  income={transaction.type === "income"}
                  category={transaction.category || undefined}
                  date={shortDate(transaction.date)}
                />
              ))}
            </View>
          ) : (
            <View className="items-center justify-center py-10">
              <Text className="text-4xl">₵</Text>
              <Text className="text-gray-500 mt-3 text-center">
                Add income or an expense to see it here.
              </Text>
            </View>
          )}
        </View>

        <View className="flex-1 h-10"></View>
      </ScrollView>
      <StatusBar barStyle={"light-content"} />
    </SafeAreaView>
  );
}
