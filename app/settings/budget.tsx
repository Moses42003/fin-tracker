import BackText from "@/components/backtext";
import CategoryPicker from "@/components/categorypicker";
import CustomButton from "@/components/custombutton";
import InputText from "@/components/input";
import {
  BudgetSettings,
  BudgetUtilization,
  getBudgetSettings,
  getBudgetUtilization,
  updateBudgetSettings,
} from "@/lib/finance";
import { currency, toNumber } from "@/lib/format";
import { useSession } from "@/lib/sessionContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CURRENCIES = ["GHS", "USD", "EUR", "GBP", "NGN", "KES"];

export default function BudgetSettingsScreen() {
  const { notifyDataChanged } = useSession();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [utilization, setUtilization] = useState<BudgetUtilization | null>(
    null,
  );

  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [threshold, setThreshold] = useState("80");
  const [currencyCode, setCurrencyCode] = useState("GHS");
  const [categoryBudget, setCategoryBudget] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [settings, usage] = await Promise.all([
        getBudgetSettings() as Promise<BudgetSettings>,
        getBudgetUtilization().catch(() => null),
      ]);
      setMonthlyBudget(
        settings?.monthly_budget
          ? String(toNumber(settings.monthly_budget))
          : "",
      );
      setThreshold(
        settings?.notification_threshold
          ? String(toNumber(settings.notification_threshold))
          : "80",
      );
      setCurrencyCode(settings?.currency || "GHS");
      setCategoryBudget(settings?.category_budgets || "");
      setUtilization(usage);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your budget settings.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave() {
    setError("");
    setSuccess("");

    const budgetValue = Number(monthlyBudget);
    if (
      monthlyBudget.trim() &&
      (Number.isNaN(budgetValue) || budgetValue <= 0)
    ) {
      setError("Enter a monthly budget greater than zero.");
      return;
    }
    const thresholdValue = Number(threshold);
    if (
      threshold.trim() &&
      (Number.isNaN(thresholdValue) ||
        thresholdValue < 0 ||
        thresholdValue > 100)
    ) {
      setError("The alert threshold must be between 0 and 100.");
      return;
    }

    setSaving(true);
    try {
      const saved = await updateBudgetSettings({
        ...(monthlyBudget.trim()
          ? { monthlyBudget: budgetValue.toFixed(2) }
          : {}),
        ...(threshold.trim()
          ? { notificationThreshold: thresholdValue.toFixed(2) }
          : {}),
        currency: currencyCode,
        ...(categoryBudget.trim() ? { categoryBudgets: categoryBudget } : {}),
      });
      setSuccess("Your budget settings have been saved.");
      notifyDataChanged();
      const usage = await getBudgetUtilization().catch(() => null);
      setUtilization(usage);
      if (saved?.monthly_budget)
        setMonthlyBudget(String(toNumber(saved.monthly_budget)));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save your budget settings.",
      );
    } finally {
      setSaving(false);
    }
  }

  const used = toNumber(utilization?.spent);
  const limit = toNumber(utilization?.monthly_budget ?? monthlyBudget);
  const percentage = toNumber(
    utilization?.utilization_percentage ??
      (limit ? Math.round((used / limit) * 100) : 0),
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-gray-500 mt-4">Loading budget settings…</Text>
        <StatusBar barStyle="dark-content" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 px-4 py-5 bg-white">
      <BackText title="Budget Settings" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="mt-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-3xl font-bold">Budget settings</Text>
          <Text className="text-gray-500 text-lg mt-2">
            Set how much you plan to spend each month and when you want to be
            warned.
          </Text>

          <View className="rounded-3xl bg-slate-900 p-5 mt-5">
            <Text className="text-slate-400 font-semibold">MONTHLY BUDGET</Text>
            <Text className="text-white text-3xl font-bold mt-2">
              {limit ? currency(limit) : "Not set"}
            </Text>
            <View className="h-3 rounded-full bg-slate-700 mt-5 overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(percentage, 100)}%`,
                  backgroundColor: percentage >= 80 ? "#dc2626" : "#22c55e",
                }}
              />
            </View>
            <View className="flex-row justify-between mt-3">
              <Text className="text-slate-300">{currency(used)} used</Text>
              <Text className="text-slate-400">{Math.round(percentage)}%</Text>
            </View>
          </View>

          <View className="mt-5">
            <InputText
              placeHolder="Monthly budget (e.g. 2000)"
              icon="wallet-outline"
              keyboardType="decimal-pad"
              value={monthlyBudget}
              onChangeText={setMonthlyBudget}
              editable={!saving}
            />
            <InputText
              placeHolder="Alert threshold % (e.g. 80)"
              icon="notifications-outline"
              keyboardType="decimal-pad"
              value={threshold}
              onChangeText={setThreshold}
              editable={!saving}
            />

            <View className="my-3">
              <Text className="text-lg font-semibold text-gray-700 mb-2 px-1">
                Currency
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {CURRENCIES.map((code) => {
                  const selected = currencyCode === code;
                  return (
                    <Text
                      key={code}
                      onPress={() => !saving && setCurrencyCode(code)}
                      className={`rounded-2xl border-2 px-4 py-3 font-semibold ${
                        selected
                          ? "bg-blue-50 border-blue-500 text-blue-700"
                          : "bg-white border-gray-300 text-gray-600"
                      }`}
                    >
                      {code}
                    </Text>
                  );
                })}
              </View>
            </View>

            <CategoryPicker
              label="Budget category focus"
              value={categoryBudget}
              onChange={setCategoryBudget}
              disabled={saving}
            />

            {error ? (
              <View className="flex-row items-center gap-2 rounded-2xl bg-red-50 border-red-200 px-3 py-3 my-2">
                <Ionicons name="alert-circle" size={20} color="#dc2626" />
                <Text className="flex-1 text-red-700 font-semibold">
                  {error}
                </Text>
              </View>
            ) : null}

            {success ? (
              <View className="flex-row items-center gap-2 rounded-2xl bg-green-50 border-green-200 px-3 py-3 my-2">
                <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
                <Text className="flex-1 text-green-700 font-semibold">
                  {success}
                </Text>
              </View>
            ) : null}

            <CustomButton
              name="Save budget"
              color="white"
              bgColor="#2563eb"
              disabled={saving}
              loading={saving}
              onPress={handleSave}
            />
          </View>

          <View className="h-10" />
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusBar barStyle="dark-content" />
    </SafeAreaView>
  );
}
