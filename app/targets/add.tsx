import BackText from "@/components/backtext";
import CategoryPicker from "@/components/categorypicker";
import CustomButton from "@/components/custombutton";
import InputText from "@/components/input";
import { createTarget } from "@/lib/finance";
import { useSession } from "@/lib/sessionContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TARGET_COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
];

export default function AddTargetScreen() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState(TARGET_COLORS[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { notifyDataChanged } = useSession();

  async function handleSave() {
    setError("");

    const parsed = Number(amount);
    if (!name.trim()) {
      setError("Add a target name to continue.");
      return;
    }
    if (!amount.trim() || Number.isNaN(parsed) || parsed <= 0) {
      setError("Enter a target amount greater than zero.");
      return;
    }

    setLoading(true);
    try {
      await createTarget({
        name: name.trim(),
        targetAmount: parsed.toFixed(2),
        description: description.trim() || undefined,
        category: category || undefined,
        color,
      });
      notifyDataChanged();
      router.back();
      router.navigate("/(tabs)/targets");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create your target.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 px-4 py-5 bg-white">
      <BackText title="New Target" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="mt-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-3xl font-bold">Set a target</Text>
          <Text className="text-gray-500 text-lg mt-2">
            Give your next goal a clear finish line.
          </Text>

          <View
            className="flex-row items-center gap-3 rounded-3xl p-4 mt-4"
            style={{ backgroundColor: `${color}1a` }}
          >
            <View
              className="w-12 h-12 rounded-2xl items-center justify-center"
              style={{ backgroundColor: color }}
            >
              <Ionicons name="trophy-outline" size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-600 font-semibold">
                {name || "New target"}
              </Text>
              <Text className="text-2xl font-bold" style={{ color }}>
                GH₵ {amount ? Number(amount).toFixed(2) : "0.00"}
              </Text>
            </View>
          </View>

          <InputText
            placeHolder="Target name"
            icon="flag-outline"
            value={name}
            onChangeText={setName}
            editable={!loading}
          />
          <InputText
            placeHolder="Target amount"
            icon="cash-outline"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            editable={!loading}
          />
          <InputText
            placeHolder="Description (optional)"
            icon="create-outline"
            value={description}
            onChangeText={setDescription}
            editable={!loading}
          />

          <CategoryPicker
            label="Category"
            value={category}
            onChange={setCategory}
            disabled={loading}
          />

          <View className="my-3">
            <Text className="text-lg font-semibold text-gray-700 mb-2 px-1">
              Colour
            </Text>
            <View className="flex-row gap-3">
              {TARGET_COLORS.map((option) => (
                <TouchableOpacity
                  key={option}
                  activeOpacity={0.8}
                  disabled={loading}
                  onPress={() => setColor(option)}
                  className="w-11 h-11 rounded-full items-center justify-center"
                  style={{ backgroundColor: option }}
                >
                  {color === option ? (
                    <Ionicons name="checkmark" size={22} color="white" />
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {error ? (
            <View className="flex-row items-center gap-2 rounded-2xl bg-red-50 border-red-200 px-3 py-3 my-2">
              <Ionicons name="alert-circle" size={20} color="#dc2626" />
              <Text className="flex-1 text-red-700 font-semibold">{error}</Text>
            </View>
          ) : null}

          <CustomButton
            name="Save target"
            color="white"
            bgColor="#2563eb"
            disabled={loading}
            loading={loading}
            onPress={handleSave}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusBar barStyle="dark-content" />
    </SafeAreaView>
  );
}
