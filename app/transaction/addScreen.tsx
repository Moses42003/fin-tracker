import BackText from "@/components/backtext";
import CustomButton from "@/components/custombutton";
import InputText from "@/components/input";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddScreen() {
  const { type = "transaction" } = useLocalSearchParams<{ type?: string }>();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  function handleSave() {
    if (!title.trim() || !amount.trim()) {
      setError("Add a description and amount to continue.");
      return;
    }
    router.back();

    router.navigate("/(tabs)/transactions");
  }

  return (
    <SafeAreaView className="flex-1 py-5 px-4 bg-white">
      <BackText title={`New ${type}`} />
      <ScrollView className="mt-8">
        <Text className="text-3xl font-bold capitalize">Add {type}</Text>
        <Text className="text-gray-500 text-lg mt-2">
          Add the details and keep your records current.
        </Text>
        <View className="mt-6">
          <InputText
            placeHolder="Description"
            value={title}
            onChangeText={setTitle}
          />
          <InputText
            placeHolder="Amount"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
          {error ? (
            <Text className="text-red-600 font-semibold">{error}</Text>
          ) : null}
          <CustomButton
            name={`Save ${type}`}
            color="white"
            bgColor="#2563eb"
            onPress={handleSave}
          />
        </View>
      </ScrollView>
      <StatusBar barStyle="dark-content" />
    </SafeAreaView>
  );
}
