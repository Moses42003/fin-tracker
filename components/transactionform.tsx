import CategoryPicker, {
  DEFAULT_CATEGORIES,
} from "@/components/categorypicker";
import CustomButton from "@/components/custombutton";
import InputText from "@/components/input";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type PaymentMethod = "cash" | "mobile_money" | "card" | "bank";

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: string }[] =
  [
    { value: "cash", label: "Cash", icon: "cash-outline" },
    { value: "mobile_money", label: "Mo", icon: "phone-portrait-outline" },
    { value: "card", label: "Card", icon: "card-outline" },
    { value: "bank", label: "Bank", icon: "business-outline" },
  ];

export interface TransactionFormValues {
  amount: string;
  category?: string;
  description?: string;
  paymentMethod?: string;
  date?: string;
}

interface Props {
  kind: "income" | "expense";
  onSave?: (values: TransactionFormValues) => Promise<unknown> | unknown;
}

export default function TransactionForm({ kind, onSave }: Props) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isExpense = kind === "expense";
  const accent = isExpense ? "#dc2626" : "#16a34a";

  function validate() {
    const parsed = Number(amount);
    if (!amount.trim()) return "Enter an amount to continue.";
    if (Number.isNaN(parsed) || parsed <= 0)
      return "Enter an amount greater than zero.";
    if (!description.trim() && !category)
      return "Add a description or pick a category.";
    return "";
  }

  async function handleSave() {
    const message = validate();
    setError(message);
    if (message) return;

    setLoading(true);
    try {
      await onSave?.({
        amount: String(Number(amount).toFixed(2)),
        category: category || undefined,
        description: description.trim() || undefined,
        paymentMethod,
        date: new Date().toISOString(),
      });
      router.back();
      router.navigate("/(tabs)/transactions");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        className="rounded-3xl p-4 mt-4 flex-row items-center gap-3"
        style={{ backgroundColor: isExpense ? "#fef2f2" : "#f0fdf4" }}
      >
        <View
          className="w-12 h-12 rounded-2xl items-center justify-center"
          style={{ backgroundColor: accent }}
        >
          <Ionicons
            name={isExpense ? "trending-down" : "trending-up"}
            size={24}
            color="white"
          />
        </View>
        <View className="flex-1">
          <Text className="text-gray-500 font-semibold">
            {isExpense ? "Money going out" : "Money coming in"}
          </Text>
          <Text className="text-2xl font-bold" style={{ color: accent }}>
            GH₵ {amount ? Number(amount).toFixed(2) : "0.00"}
          </Text>
        </View>
      </View>

      <InputText
        placeHolder="Amount"
        icon="cash-outline"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
        editable={!loading}
      />
      <InputText
        placeHolder="Description"
        icon="create-outline"
        value={description}
        onChangeText={setDescription}
        editable={!loading}
      />

      <CategoryPicker
        value={category}
        options={DEFAULT_CATEGORIES}
        onChange={setCategory}
        disabled={loading}
      />

      <View className="my-3">
        <Text className="text-lg font-semibold text-gray-700 mb-2 px-1">
          Payment method
        </Text>
        <View className="flex-row gap-2">
          {PAYMENT_METHODS.map((method) => {
            const selected = paymentMethod === method.value;
            return (
              <TouchableOpacity
                key={method.value}
                activeOpacity={0.8}
                disabled={loading}
                onPress={() => setPaymentMethod(method.value)}
                className={`flex-1 rounded-2xl border-2 items-center py-3 ${
                  selected
                    ? "bg-blue-50 border-blue-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <Ionicons
                  // @ts-ignore Ionicons accepts the runtime icon name.
                  name={method.icon}
                  size={20}
                  color={selected ? "#2563eb" : "gray"}
                />
                <Text
                  className={`text-xs font-semibold mt-1 ${
                    selected ? "text-blue-700" : "text-gray-500"
                  }`}
                >
                  {method.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {error ? (
        <View className="flex-row items-center gap-2 rounded-2xl bg-red-50 border-red-200 px-3 py-3 my-2">
          <Ionicons name="alert-circle" size={20} color="#dc2626" />
          <Text className="flex-1 text-red-700 font-semibold">{error}</Text>
        </View>
      ) : null}

      <CustomButton
        name={`Save ${kind}`}
        color="white"
        bgColor={accent}
        disabled={loading}
        loading={loading}
        onPress={handleSave}
      />
    </KeyboardAvoidingView>
  );
}
