import BackText from "@/components/backtext";
import CustomButton from "@/components/custombutton";
import InputText from "@/components/input";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddTargetScreen() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  function handleSave() {
    if (!name.trim() || !amount.trim()) {
      setError("Add a target name and amount to continue.");
      return;
    }
    router.replace("/(tabs)/targets");
  }

  return (
    <SafeAreaView className="flex-1 px-4 py-5 bg-white">
      <BackText title="New Target" />
      <ScrollView className="mt-8">
        <Text className="text-3xl font-bold">Set a target</Text>
        <Text className="text-gray-500 text-lg mt-2">
          Give your next goal a clear finish line.
        </Text>
        <View className="mt-6">
          <InputText
            placeHolder="Target name"
            value={name}
            onChangeText={setName}
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
            name="Save target"
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
