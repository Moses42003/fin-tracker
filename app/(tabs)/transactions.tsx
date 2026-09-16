import TransactionCard from "@/components/transcard";
import { currency, shortDate } from "@/lib/format";
import { listTransactions, TransactionRecord } from "@/lib/finance";
import { useAsyncData } from "@/lib/useAsyncData";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransactionTab() {
  const [currentTab, setCurrentTab] = useState("all");
  const loader = useCallback(() => listTransactions(), []);
  const { data, loading, error, refreshing, reload, refresh } =
    useAsyncData<TransactionRecord[]>(loader);

  const transactions = useMemo(() => data ?? [], [data]);
  const visibleTransactions = transactions.filter(
    (transaction) => currentTab === "all" || transaction.type === currentTab,
  );

  const balance = transactions.reduce(
    (total, transaction) =>
      total +
      (transaction.type === "income"
        ? Number(transaction.amount)
        : -Number(transaction.amount)),
    0,
  );

  return (
    <SafeAreaView className="pt-5 px-5 bg-white flex-1">
      <View className="flex gap-4">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-3xl font-bold">Records</Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={reload}
            className="bg-slate-200 rounded-xl px-4 h-10 items-center justify-center"
          >
            <Ionicons name="refresh" size={18} color="#334155" />
          </TouchableOpacity>
        </View>
        <View className="flex-row gap-3 mb-5">
          <View className="flex-1 rounded-2xl bg-slate-900 px-4 py-4">
            <Text className="text-slate-400 text-xs font-semibold">
              BALANCE
            </Text>
            <Text className="text-white text-lg font-bold mt-1">
              {currency(balance)}
            </Text>
          </View>
          <View className="flex-1 rounded-2xl bg-emerald-50 px-4 py-4">
            <Text className="text-emerald-700 text-xs font-semibold">
              VISIBLE
            </Text>
            <Text className="text-emerald-900 text-lg font-bold mt-1">
              {visibleTransactions.length} records
            </Text>
          </View>
        </View>

        <View className="flex flex-row items-center gap-3 mb-3">
          {/* All */}
          <TouchableOpacity
            className="flex flex-1 h-12 rounded-2xl items-center justify-center"
            style={{
              backgroundColor: currentTab === "all" ? "#4c1d95" : "#e2e8f0",
            }}
            activeOpacity={0.7}
            onPress={() => setCurrentTab("all")}
          >
            <Text
              className="font-semibold text-xl text-center"
              style={{
                color: currentTab === "all" ? "white" : "",
              }}
            >
              All
            </Text>
          </TouchableOpacity>

          {/* Income */}
          <TouchableOpacity
            className="flex flex-1 h-12 rounded-2xl items-center justify-center"
            style={{
              backgroundColor: currentTab === "income" ? "#4c1d95" : "#e2e8f0",
            }}
            activeOpacity={0.7}
            onPress={() => setCurrentTab("income")}
          >
            <Text
              className="font-semibold text-xl text-center"
              style={{
                color: currentTab === "income" ? "white" : "",
              }}
            >
              Income
            </Text>
          </TouchableOpacity>

          {/* Expense */}
          <TouchableOpacity
            className="flex flex-1 h-12 rounded-2xl items-center justify-center"
            style={{
              backgroundColor: currentTab === "expense" ? "#4c1d95" : "#e2e8f0",
            }}
            activeOpacity={0.7}
            onPress={() => setCurrentTab("expense")}
          >
            <Text
              className="font-semibold text-xl text-center"
              style={{
                color: currentTab === "expense" ? "white" : "",
              }}
            >
              Expense
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        {loading ? (
          <View className="items-center justify-center py-24">
            <ActivityIndicator size="large" color="#4c1d95" />
            <Text className="text-gray-500 mt-4">Loading your records…</Text>
          </View>
        ) : error ? (
          <View className="items-center justify-center py-24 px-8">
            <Ionicons name="cloud-offline-outline" size={48} color="#dc2626" />
            <Text className="text-2xl font-bold mt-4">Could not load</Text>
            <Text className="text-gray-500 text-center mt-2">{error}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={reload}
              className="mt-4 bg-slate-900 rounded-2xl px-6 py-3"
            >
              <Text className="text-white font-semibold">Try again</Text>
            </TouchableOpacity>
          </View>
        ) : visibleTransactions.length ? (
          <View className="gap-4">
            {visibleTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                income={transaction.type === "income"}
                title={
                  transaction.description ||
                  transaction.category ||
                  "Untitled record"
                }
                amount={Number(transaction.amount)}
                category={transaction.category || undefined}
                date={shortDate(transaction.date)}
              />
            ))}
          </View>
        ) : (
          <View className="items-center justify-center py-24 px-8">
            <Text className="text-5xl">₵</Text>
            <Text className="text-2xl font-bold mt-4">Nothing here yet</Text>
            <Text className="text-gray-500 text-center mt-2">
              Your {currentTab} records will appear here once you add them.
            </Text>
          </View>
        )}
      </ScrollView>
      <StatusBar barStyle={"dark-content"} />
    </SafeAreaView>
  );
}
