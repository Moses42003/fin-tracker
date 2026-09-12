import TransactionCard from "@/components/transcard";
import { getFinancialSummary, transactionData } from "@/lib/mockData";
import { useState } from "react";
import {
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransactionTab() {
  const [currentTab, setCurrentTab] = useState("all");
  const visibleTransactions = transactionData.filter(
    (transaction) => currentTab === "all" || transaction.kind === currentTab,
  );
  const summary = getFinancialSummary(transactionData);
  return (
    <SafeAreaView className="pt-5 px-5 bg-white flex-1">
      <View className="flex gap-4">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-3xl font-bold">Records</Text>

          <View className="bg-slate-200 rounded-xl w-24 h-10"></View>
        </View>
        <View className="flex-row gap-3 mb-5">
          <View className="flex-1 rounded-2xl bg-slate-900 px-4 py-4">
            <Text className="text-slate-400 text-xs font-semibold">
              BALANCE
            </Text>
            <Text className="text-white text-lg font-bold mt-1">
              GH₵ {summary.balance.toFixed(2)}
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

      <ScrollView showsVerticalScrollIndicator={false}>
        {visibleTransactions.length ? (
          <View className="gap-4">
            {visibleTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                income={transaction.kind === "income"}
                title={transaction.title}
                amount={transaction.amount}
                category={transaction.category}
                date={transaction.date}
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
