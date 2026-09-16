import BackText from "@/components/backtext";
import CustomButton from "@/components/custombutton";
import InputText from "@/components/input";
import {
  addFundsToTarget,
  getTarget,
  TargetResponse,
} from "@/lib/finance";
import { currency, toNumber } from "@/lib/format";
import { useAsyncData } from "@/lib/useAsyncData";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
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

export default function TargetPage() {
  const { id = "" } = useLocalSearchParams<{ id?: string }>();
  const loader = useCallback(() => getTarget(id), [id]);
  const { data: target, loading, error, refreshing, reload, refresh } =
    useAsyncData<TargetResponse>(loader);

  const [amount, setAmount] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  const saved = toNumber(target?.current_amount);
  const total = toNumber(target?.target_amount);
  const percentage = total
    ? Math.min(Math.round((saved / total) * 100), 100)
    : 0;
  const remaining = Math.max(total - saved, 0);

  async function handleAddMoney() {
    setAddError("");
    setAddSuccess("");
    const parsed = Number(amount);
    if (!amount.trim() || Number.isNaN(parsed) || parsed <= 0) {
      setAddError("Enter an amount greater than zero.");
      return;
    }

    setAdding(true);
    try {
      await addFundsToTarget(id, parsed.toFixed(2));
      setAmount("");
      setAddSuccess(`Added ${currency(parsed)} to this target.`);
      reload();
    } catch (err) {
      setAddError(
        err instanceof Error ? err.message : "Unable to add money right now.",
      );
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-gray-500 mt-4">Loading target…</Text>
        <StatusBar barStyle="dark-content" />
      </SafeAreaView>
    );
  }

  if (error || !target) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 px-5 py-5">
        <BackText title="My Targets" />
        <View className="items-center justify-center py-24 px-8">
          <Ionicons name="cloud-offline-outline" size={56} color="#dc2626" />
          <Text className="text-2xl font-bold mt-4">Could not load</Text>
          <Text className="text-gray-500 text-center mt-2">
            {error || "This target could not be found."}
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={reload}
            className="mt-4 bg-slate-900 rounded-2xl px-6 py-3"
          >
            <Text className="text-white font-semibold">Try again</Text>
          </TouchableOpacity>
        </View>
        <StatusBar barStyle="dark-content" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 px-5 py-5">
      <BackText title="My Targets" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="mt-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        <View className="rounded-3xl bg-slate-900 p-6">
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="text-slate-400 font-semibold">TARGET</Text>
              <Text className="text-white text-3xl font-bold mt-2">
                {target.name}
              </Text>
              <Text className="text-slate-400 mt-2 capitalize">
                {target.status}
                {target.target_date
                  ? ` · Due ${new Date(target.target_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}`
                  : ""}
              </Text>
            </View>
            <View className="w-16 h-16 rounded-full border-4 border-blue-400 items-center justify-center">
              <Text className="text-white font-bold">{percentage}%</Text>
            </View>
          </View>
          <View className="h-3 rounded-full bg-slate-700 mt-8 overflow-hidden">
            <View
              className="h-full rounded-full bg-blue-400"
              style={{ width: `${percentage}%` }}
            />
          </View>
          <View className="flex-row justify-between mt-3">
            <Text className="text-slate-300">
              {currency(saved)} saved
            </Text>
            <Text className="text-slate-400">of {currency(total)}</Text>
          </View>
        </View>

        <View className="flex-row gap-3 mt-4">
          <View className="flex-1 rounded-2xl bg-white border border-gray-200 p-4">
            <Text className="text-gray-500">Remaining</Text>
            <Text className="text-2xl font-bold mt-2">
              {currency(remaining)}
            </Text>
          </View>
          <View className="flex-1 rounded-2xl bg-white border border-gray-200 p-4">
            <Text className="text-gray-500">Progress</Text>
            <Text className="text-2xl font-bold mt-2">{percentage}%</Text>
          </View>
        </View>

        <View className="rounded-3xl bg-white border border-gray-200 p-5 mt-4">
          <Text className="text-xl font-bold">Next step</Text>
          <Text className="text-gray-500 mt-2">
            Add money regularly to keep this target moving.
          </Text>
          <InputText
            placeHolder="Amount to add"
            icon="cash-outline"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            editable={!adding}
          />

          {addError ? (
            <View className="flex-row items-center gap-2 rounded-2xl bg-red-50 border-red-200 px-3 py-3 my-2">
              <Ionicons name="alert-circle" size={20} color="#dc2626" />
              <Text className="flex-1 text-red-700 font-semibold">
                {addError}
              </Text>
            </View>
          ) : null}

          {addSuccess ? (
            <View className="flex-row items-center gap-2 rounded-2xl bg-green-50 border-green-200 px-3 py-3 my-2">
              <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
              <Text className="flex-1 text-green-700 font-semibold">
                {addSuccess}
              </Text>
            </View>
          ) : null}

          <CustomButton
            name="Add money"
            color="white"
            bgColor="#2563eb"
            disabled={adding}
            loading={adding}
            onPress={handleAddMoney}
          />
        </View>

        <View className="items-center mt-6 mb-8">
          <Ionicons name="sparkles-outline" size={24} color="#2563eb" />
          <Text className="text-gray-500 mt-2">
            Small steps become big wins.
          </Text>
        </View>
      </ScrollView>
      <StatusBar barStyle="dark-content" />
    </SafeAreaView>
  );
}
