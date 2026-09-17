import BackText from "@/components/backtext";
import {
  DashboardSummary,
  getDashboardSummary,
} from "@/lib/finance";
import { currency as formatCurrency, toNumber } from "@/lib/format";
import { useSession } from "@/lib/sessionContext";
import { useAsyncData } from "@/lib/useAsyncData";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StatusBar,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const currency = (value: number) => formatCurrency(value);

export default function AnalyticScreen() {
  const { dataVersion } = useSession();
  const loader = useCallback(() => getDashboardSummary(), []);
  const { data, loading, error, refreshing, refresh } = useAsyncData<
    DashboardSummary
  >(loader, dataVersion);

  const summary = {
    balance: toNumber(data?.total_balance),
    income: toNumber(data?.total_income),
    expenses: toNumber(data?.total_expenses),
    savings: toNumber(data?.total_savings),
  };

  const categories = Object.entries(data?.expenses_by_category ?? {})
    .map(([name, value]) => [name, toNumber(value)] as [string, number])
    .sort(([, first], [, second]) => second - first);
  const largestCategory = categories[0]?.[1] || 0;

  const trend = (data?.spending_trend ?? []).map((point) =>
    toNumber(point?.amount),
  );
  const maxTrend = Math.max(...trend.map(Math.abs), 1);
  const metrics = [
    ["Income", summary.income, "#16a34a"],
    ["Expenses", summary.expenses, "#dc2626"],
    ["Saved", summary.savings, "#d97706"],
  ] as const;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-gray-500 mt-4">Loading analytics…</Text>
        <StatusBar barStyle="dark-content" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 px-5 py-5">
        <BackText title="Analytics" />
        <View className="items-center justify-center py-24 px-8">
          <Ionicons name="cloud-offline-outline" size={56} color="#dc2626" />
          <Text className="text-2xl font-bold mt-4">Could not load</Text>
          <Text className="text-gray-500 text-center mt-2">{error}</Text>
        </View>
        <StatusBar barStyle="dark-content" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 px-5 py-5">
      <BackText title="Analytics" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="mt-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
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
                <Text className="text-xs text-gray-400">
                  {(data?.spending_trend ?? [])[index]?.date
                    ? new Date(
                        (data?.spending_trend ?? [])[index].date,
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })
                    : index + 1}
                </Text>
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
