import BackText from "@/components/backtext";
import TransactionForm from "@/components/transactionform";
import { addExpense } from "@/lib/finance";
import { useSession } from "@/lib/sessionContext";
import React from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddExpenseScreen() {
  const { notifyDataChanged } = useSession();

  return (
    <SafeAreaView className="flex-1 px-4 py-5 bg-white">
      <BackText title="Add Expense" />
      <ScrollView
        className="mt-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-3xl font-bold">Add expense</Text>
        <Text className="text-gray-500 text-lg mt-2">
          Record money going out and see where it went.
        </Text>

        <View className="mt-2">
          <TransactionForm
            kind="expense"
            onSave={async (values) => {
              const result = await addExpense({
                amount: values.amount,
                category: values.category,
                description: values.description,
                paymentMethod: values.paymentMethod,
                date: values.date,
              });
              notifyDataChanged();
              return result;
            }}
          />
        </View>
      </ScrollView>
      <StatusBar barStyle="dark-content" />
    </SafeAreaView>
  );
}
