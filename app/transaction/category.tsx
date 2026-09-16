import BackText from "@/components/backtext";
import { DEFAULT_CATEGORIES } from "@/components/categorypicker";
import CustomButton from "@/components/custombutton";
import InputText from "@/components/input";
import {
  addCustomCategory,
  getCustomCategories,
  removeCustomCategory,
} from "@/lib/categories";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
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

export default function CategoryScreen() {
  const [name, setName] = useState("");
  const [custom, setCustom] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setCustom(await getCustomCategories());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave() {
    setError("");
    setSuccess("");
    if (!name.trim()) {
      setError("Add a category name to continue.");
      return;
    }

    setLoading(true);
    try {
      await addCustomCategory(name);
      setSuccess(`"${name.trim()}" is now available when you add records.`);
      setName("");
      await load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save this category.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(category: string) {
    setError("");
    setSuccess("");
    await removeCustomCategory(category);
    await load();
  }

  return (
    <SafeAreaView className="flex-1 px-4 py-5 bg-white">
      <BackText title="New Category" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="mt-8"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-3xl font-bold">Create a category</Text>
          <Text className="text-gray-500 text-lg mt-2">
            Keep your income and spending organized. Categories you add here
            show up when you record income, expenses and targets.
          </Text>

          <View className="mt-4">
            <InputText
              placeHolder="Category name"
              icon="pricetags-outline"
              value={name}
              onChangeText={setName}
              editable={!loading}
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
              name="Save category"
              color="white"
              bgColor="#2563eb"
              disabled={loading}
              loading={loading}
              onPress={handleSave}
            />
          </View>

          <View className="mt-6">
            <Text className="text-xl font-bold mb-3">Your categories</Text>

            {custom.length ? (
              <View className="gap-2 mb-4">
                {custom.map((category) => (
                  <View
                    key={category}
                    className="flex-row items-center justify-between rounded-2xl border-2 border-blue-200 bg-blue-50 px-4 py-3"
                  >
                    <View className="flex-row items-center gap-3">
                      <Ionicons name="pricetag" size={18} color="#2563eb" />
                      <Text className="text-lg font-semibold text-blue-800">
                        {category}
                      </Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleRemove(category)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#dc2626" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-gray-400 mb-4">
                You have not added any custom categories yet.
              </Text>
            )}

            <Text className="text-lg font-semibold text-gray-500 mb-2">
              Built-in categories
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {DEFAULT_CATEGORIES.map((category) => (
                <View
                  key={category}
                  className="rounded-2xl border-gray-300 bg-gray-50 px-3 py-2"
                >
                  <Text className="text-gray-600 font-semibold">
                    {category}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusBar barStyle="dark-content" />
    </SafeAreaView>
  );
}
