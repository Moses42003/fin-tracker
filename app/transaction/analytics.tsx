import BackText from "@/components/backtext";
import {
    getCategoryTotals,
    getFinancialSummary,
    transactionData,
} from "@/lib/mockData";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const currency = (value: number) => `GH₵ ${value.toFixed(2)}`;

export default function AnalyticScreen() {
  const summary = getFinancialSummary(transactionData);
  const categories = Object.entries(getCategoryTotals(transactionData)).sort(
    ([, first], [, second]) => second - first,
  );
  const largestCategory = categories[0]?.[1] || 0;
  const trend = transactionData.reduce<number[]>((values, record) => {
    const previous = values[values.length - 1] || 0;
    values.push(
      previous + (record.kind === "income" ? record.amount : -record.amount),
    );
    return values;
  }, []);
  const maxTrend = Math.max(...trend.map(Math.abs), 1);
  const metrics = [
    ["Income", summary.income, "#16a34a"],
    ["Expenses", summary.expenses, "#dc2626"],
    ["Saved", summary.savings, "#d97706"],
  ] as const;

  return (
    <SafeAreaView className="flex-1 bg-slate-50 px-5 py-5">
      <BackText title="Analytics" />
      <ScrollView showsVerticalScrollIndicator={false} className="mt-6">
        <View className="rounded-3xl bg-slate-900 p-6">
          <Text className="text-slate-400 font-semibold">NET POSITION</Text>
          <Text className="text-white text-4xl font-bold mt-2">
            {currency(summary.balance)}
          </Text>
          <Text className="text-slate-400 mt-2">
            Income less expenses across your records
          </Text>
        </View>
        <View className="flex-row gap-3 mt-4">
          {metrics.map(([label, value, color]) => (
            <View
              key={label}
              className="flex-1 rounded-2xl bg-white border border-gray-200 p-3"
            >
              <Text className="text-gray-500 text-xs font-semibold">
                {label}
              </Text>
              <Text className="font-bold mt-2" style={{ color }}>
                {currency(Number(value))}
              </Text>
            </View>
          ))}
        </View>
        <View className="rounded-3xl bg-white border border-gray-200 p-5 mt-4">
          <Text className="text-xl font-bold">Balance movement</Text>
          <View className="h-44 flex-row items-end gap-3 mt-5">
            {trend.map((value, index) => (
              <View
                key={`${value}-${index}`}
                className="flex-1 items-center gap-2"
              >
                <View
                  className="w-full rounded-t-xl bg-blue-500"
                  style={{
                    height: Math.max((Math.abs(value) / maxTrend) * 120, 8),
                  }}
                />
                <Text className="text-xs text-gray-400">{index + 1}</Text>
              </View>
            ))}
          </View>
        </View>
        <View className="rounded-3xl bg-white border border-gray-200 p-5 mt-4 mb-8">
          <Text className="text-xl font-bold">Where expenses go</Text>
          {categories.length ? (
            categories.map(([category, amount]) => (
              <View key={category} className="mt-5">
                <View className="flex-row justify-between">
                  <Text className="font-semibold">{category}</Text>
                  <Text className="text-gray-500">{currency(amount)}</Text>
                </View>
                <View className="h-2 rounded-full bg-gray-100 mt-2 overflow-hidden">
                  <View
                    className="h-full rounded-full bg-orange-400"
                    style={{
                      width: `${largestCategory ? (amount / largestCategory) * 100 : 0}%`,
                    }}
                  />
                </View>
              </View>
            ))
          ) : (
            <View className="items-center py-8">
              <Ionicons name="bar-chart-outline" size={42} color="#94a3b8" />
              <Text className="text-gray-500 mt-3">
                Add expenses to see category insights.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <StatusBar barStyle="dark-content" />
    </SafeAreaView>
  );
}
