import TransactionCard from "@/components/transcard";
import { transactionData } from "@/lib/mockData";
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
  return (
    <SafeAreaView className="pt-5 px-5 bg-white flex-1">
      <View className="flex gap-4">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-3xl font-bold">Records</Text>

          <View className="bg-slate-200 rounded-xl w-24 h-10"></View>
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
