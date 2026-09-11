import TransactionCard from "@/components/transcard";
import { useEffect, useState } from "react";
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
  const [showTrans, setShowTrans] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowTrans(true), 1000);
    return () => clearTimeout(timer);
  }, []);
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
        {showTrans && currentTab === "all" ? (
          <View>
            <View>
              <Text className="text-lg font-bold mb-5">May 15, 2016</Text>
              <View className="flex p-2 gap-10">
                <TransactionCard title="School Fees" amount={250} />
                <TransactionCard title="Food & Meals" amount={45.5} />
                <TransactionCard color="orange" title="Transport" amount={15} />
              </View>
            </View>

            <View>
              <Text className="text-lg font-bold mb-5">May 19, 2016</Text>
              <View className="flex p-2 gap-10">
                <TransactionCard income title="Freelance Work" amount={350.0} />
                <TransactionCard
                  color="orange"
                  income
                  title="Gift"
                  amount={50}
                />
              </View>
            </View>
          </View>
        ) : showTrans && currentTab === "income" ? (
          <View>
            <Text className="text-lg font-bold mb-5">May 19, 2016</Text>
            <View className="flex p-2 gap-10">
              <TransactionCard income title="Freelance Work" amount={350.0} />
              <TransactionCard color="orange" income title="Gift" amount={50} />
            </View>
          </View>
        ) : showTrans && currentTab === "expense" ? (
          <View>
            <Text className="text-lg font-bold mb-5">May 15, 2016</Text>
            <View className="flex p-2 gap-10">
              <TransactionCard title="School Fees" amount={250} />
              <TransactionCard title="Food & Meals" amount={45.5} />
              <TransactionCard color="orange" title="Transport" amount={15} />
            </View>
          </View>
        ) : (
          <View className="flex-1">
            <View className="w-28 h-5 rounded-2xl bg-gray-300 mb-5"></View>
            <View className="gap-10 mb-4">
              <View className="w-full h-20 bg-gray-300 rounded-2xl"></View>
              <View className="w-full h-20 bg-gray-300 rounded-2xl"></View>
              <View className="w-full h-20 bg-gray-300 rounded-2xl"></View>
            </View>

            <View className="w-28 h-5 rounded-2xl bg-gray-300 mb-5"></View>
            <View className="gap-10 mb-4">
              <View className="w-full h-20 bg-gray-300 rounded-2xl"></View>
              <View className="w-full h-20 bg-gray-300 rounded-2xl"></View>
              <View className="w-full h-20 bg-gray-300 rounded-2xl"></View>
            </View>
          </View>
        )}
      </ScrollView>
      <StatusBar barStyle={"dark-content"} />
    </SafeAreaView>
  );
}
