import BackText from "@/components/backtext";
import TransactionForm from "@/components/transactionform";
import { addIncome } from "@/lib/finance";
import React from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddIncomeScreen() {
  return (
    <SafeAreaView className="flex-1 px-4 py-5 bg-white">
      <BackText title="Add Income" />
      <ScrollView
        className="mt-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-3xl font-bold">Add income</Text>
        <Text className="text-gray-500 text-lg mt-2">
          Record money coming in so your balance stays accurate.
        </Text>

        <View className="mt-2">
          <TransactionForm
            kind="income"
            onSave={(values) =>
              addIncome({
                amount: values.amount,
                category: values.category,
                description: values.description,
                paymentMethod: values.paymentMethod,
                date: values.date,
              })
            }
          />
        </View>
      </ScrollView>
      <StatusBar barStyle="dark-content" />
    </SafeAreaView>
  );
}
