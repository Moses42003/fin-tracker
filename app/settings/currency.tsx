import BackText from "@/components/backtext";
import CustomButton from "@/components/custombutton";
import { getBudgetSettings, updateBudgetSettings } from "@/lib/finance";
import { useSession } from "@/lib/sessionContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CURRENCIES = [
  { code: "GHS", label: "Ghanaian Cedi", symbol: "GH₵" },
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "GBP", label: "British Pound", symbol: "£" },
  { code: "NGN", label: "Nigerian Naira", symbol: "₦" },
  { code: "KES", label: "Kenyan Shilling", symbol: "KSh" },
];

export default function CurrencyScreen() {
  const { notifyDataChanged } = useSession();
  const [selected, setSelected] = useState("GHS");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const settings = await getBudgetSettings();
      setSelected(settings?.currency || "GHS");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load your currency.",
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
    setSaving(true);
    try {
      await updateBudgetSettings({ currency: selected });
      setSuccess(`Currency set to ${selected}.`);
      notifyDataChanged();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save your currency.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 px-4 py-5 bg-white">
      <BackText title="Currency" />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="text-gray-500 mt-4">Loading currencies…</Text>
        </View>
      ) : (
        <>
          <Text className="text-3xl font-bold mt-6">Choose your currency</Text>
          <Text className="text-gray-500 text-lg mt-2">
            This is the currency used to display your balances and records.
          </Text>

          <View className="mt-5 gap-3">
            {CURRENCIES.map((item) => {
              const isSelected = selected === item.code;
              return (
                <TouchableOpacity
                  key={item.code}
                  activeOpacity={0.8}
                  disabled={saving}
                  onPress={() => setSelected(item.code)}
                  className={`flex-row items-center justify-between rounded-2xl border-2 px-4 py-4 ${
                    isSelected
                      ? "bg-blue-50 border-blue-500"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <View className="flex-row items-center gap-4">
                    <View className="w-12 h-12 rounded-2xl bg-slate-100 items-center justify-center">
                      <Text className="text-xl font-bold">{item.symbol}</Text>
                    </View>
                    <View>
                      <Text className="text-lg font-bold">{item.code}</Text>
                      <Text className="text-gray-500">{item.label}</Text>
                    </View>
                  </View>
                  {isSelected ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={26}
                      color="#2563eb"
                    />
                  ) : (
                    <Ionicons
                      name="ellipse-outline"
                      size={26}
                      color="#cbd5e1"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {error ? (
            <View className="flex-row items-center gap-2 rounded-2xl bg-red-50 border-red-200 px-3 py-3 my-3">
              <Ionicons name="alert-circle" size={20} color="#dc2626" />
              <Text className="flex-1 text-red-700 font-semibold">{error}</Text>
            </View>
          ) : null}

          {success ? (
            <View className="flex-row items-center gap-2 rounded-2xl bg-green-50 border-green-200 px-3 py-3 my-3">
              <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
              <Text className="flex-1 text-green-700 font-semibold">
                {success}
              </Text>
            </View>
          ) : null}

          <CustomButton
            name="Save currency"
            color="white"
            bgColor="#2563eb"
            disabled={saving}
            loading={saving}
            onPress={handleSave}
          />
        </>
      )}

      <StatusBar barStyle="dark-content" />
    </SafeAreaView>
  );
}
