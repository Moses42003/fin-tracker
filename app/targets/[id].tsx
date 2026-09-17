import AchievementModal from "@/components/achievementmodal";
import BackText from "@/components/backtext";
import CustomButton from "@/components/custombutton";
import InputText from "@/components/input";
import { addFundsToTarget, getTarget, TargetResponse } from "@/lib/finance";
import { currency, toNumber } from "@/lib/format";
import { useSession } from "@/lib/sessionContext";
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

const DEFAULT_COLOR = "#2563eb";
const COMPLETE_COLOR = "#f59e0b";

export default function TargetPage() {
  const { id = "" } = useLocalSearchParams<{ id?: string }>();
  const { notifyDataChanged, dataVersion } = useSession();
  const loader = useCallback(() => getTarget(id), [id]);
  const {
    data: target,
    loading,
    error,
    refreshing,
    reload,
    refresh,
  } = useAsyncData<TargetResponse>(loader, dataVersion);

  const [amount, setAmount] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const [showAchievement, setShowAchievement] = useState(false);
  const [completedAmount, setCompletedAmount] = useState("");
  const [redrawing, setRedrawing] = useState(false);
  const [redrawMessage, setRedrawMessage] = useState("");

  const saved = toNumber(target?.current_amount);
  const total = toNumber(target?.target_amount);
  const percentage = total
    ? Math.min(Math.round((saved / total) * 100), 100)
    : 0;
  const remaining = Math.max(total - saved, 0);

  // Colour chosen on the Add Target page; completed targets go gold.
  const isComplete = target?.status === "completed" || percentage >= 100;
  const accent = isComplete ? COMPLETE_COLOR : target?.color || DEFAULT_COLOR;

  async function handleAddMoney() {
    setAddError("");
    setAddSuccess("");

    // A completed target does not accept more money.
    if (isComplete) {
      setAddError(
        "This target is already complete. Redraw it to start saving again.",
      );
      return;
    }

    const parsed = Number(amount);
    if (!amount.trim() || Number.isNaN(parsed) || parsed <= 0) {
      setAddError("Enter an amount greater than zero.");
      return;
    }

    setAdding(true);
    try {
      const result = (await addFundsToTarget(id, parsed.toFixed(2))) as {
        status?: string;
        target_amount?: string;
      };
      setAmount("");
      setAddSuccess(`Added ${currency(parsed)} to this target.`);
      notifyDataChanged();
      reload();

      // The API flips status to "completed" once the goal is fully funded.
      if (result?.status === "completed") {
        setCompletedAmount(currency(result.target_amount ?? total));
        setShowAchievement(true);
      }
    } catch (err) {
      setAddError(
        err instanceof Error ? err.message : "Unable to add money right now.",
      );
    } finally {
      setAdding(false);
    }
  }

  /**
   * Resets a finished target so it can be saved towards again. The API has no
   * "reopen" endpoint yet, so this is intentionally a placeholder for now and
   * the real behaviour will be wired in later.
   */
  function handleRedraw() {
    setRedrawing(true);
    setRedrawMessage("");
    setTimeout(() => {
      setRedrawing(false);
      setRedrawMessage(
        "Redraw is coming soon. For now, create a new target to start again.",
      );
    }, 600);
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
                  ? ` · Due ${new Date(target.target_date).toLocaleDateString(
                      "en-GB",
                      { day: "2-digit", month: "short" },
                    )}`
                  : ""}
              </Text>

              {isComplete ? (
                <View className="flex-row items-center gap-1 mt-3 self-start rounded-full bg-amber-400 px-3 py-1">
                  <Ionicons name="trophy" size={14} color="white" />
                  <Text className="text-white font-bold text-xs">
                    COMPLETED
                  </Text>
                </View>
              ) : null}
            </View>

            <View
              className="w-16 h-16 rounded-full border-4 items-center justify-center"
              style={{ borderColor: accent }}
            >
              {isComplete ? (
                <Ionicons name="checkmark" size={28} color={accent} />
              ) : (
                <Text className="text-white font-bold">{percentage}%</Text>
              )}
            </View>
          </View>

          <View className="h-3 rounded-full bg-slate-700 mt-8 overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{ width: `${percentage}%`, backgroundColor: accent }}
            />
          </View>
          <View className="flex-row justify-between mt-3">
            <Text className="text-slate-300">{currency(saved)} saved</Text>
            <Text className="text-slate-400">of {currency(total)}</Text>
          </View>
        </View>

        <View className="flex-row gap-3 mt-4">
          <View className="flex-1 rounded-2xl bg-white border-gray-200 p-4">
            <Text className="text-gray-500">Remaining</Text>
            <Text className="text-2xl font-bold mt-2">
              {currency(remaining)}
            </Text>
          </View>
          <View className="flex-1 rounded-2xl bg-white border-gray-200 p-4">
            <Text className="text-gray-500">Progress</Text>
            <Text className="text-2xl font-bold mt-2">{percentage}%</Text>
          </View>
        </View>

        {isComplete ? (
          <View className="rounded-3xl bg-amber-50 border-2 border-amber-200 p-5 mt-4">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-2xl bg-amber-400 items-center justify-center">
                <Ionicons name="trophy" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-amber-900">
                  Target complete
                </Text>
                <Text className="text-amber-700">
                  You reached your goal. Nicely done.
                </Text>
              </View>
            </View>

            <Text className="text-amber-800 mt-4">
              Adding money is closed on a completed target. Redraw it if you
              want to start saving towards it again.
            </Text>

            {redrawMessage ? (
              <View className="flex-row items-center gap-2 rounded-2xl bg-white border-2 border-amber-200 px-3 py-3 mt-3">
                <Ionicons name="information-circle" size={20} color="#d97706" />
                <Text className="flex-1 text-amber-800 font-semibold">
                  {redrawMessage}
                </Text>
              </View>
            ) : null}

            <CustomButton
              name="Redraw target"
              color="white"
              bgColor="#d97706"
              icon="refresh"
              disabled={redrawing}
              loading={redrawing}
              onPress={handleRedraw}
            />
          </View>
        ) : (
          <View className="rounded-3xl bg-white border-gray-200 p-5 mt-4">
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
              bgColor={accent}
              disabled={adding}
              loading={adding}
              onPress={handleAddMoney}
            />
          </View>
        )}

        <View className="items-center mt-6 mb-8">
          <Ionicons name="sparkles-outline" size={24} color="#2563eb" />
          <Text className="text-gray-500 mt-2">
            Small steps become big wins.
          </Text>
        </View>
      </ScrollView>

      <AchievementModal
        visible={showAchievement}
        targetName={target.name}
        amount={completedAmount}
        onClose={() => setShowAchievement(false)}
      />
      <StatusBar barStyle="dark-content" />
    </SafeAreaView>
  );
}
