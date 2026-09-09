import TransactionCard from "@/components/transcard";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransactionTab() {
  return (
    <SafeAreaView className="pt-5 px-5 bg-white flex flex-1">
      <View className="flex gap-4">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-3xl font-bold">Records</Text>

          <View className="bg-slate-200 rounded-xl w-24 h-10"></View>
        </View>

        <View className="flex flex-row items-center gap-3 mb-3">
          {/* All */}
          <TouchableOpacity
            className="flex flex-1 h-12 rounded-2xl bg-violet-900 items-center justify-center"
            activeOpacity={0.7}
          >
            <Text className="font-semibold text-xl text-white text-center">
              All
            </Text>
          </TouchableOpacity>

          {/* Income */}
          <TouchableOpacity
            className="flex flex-1 h-12 rounded-2xl bg-slate-200 items-center justify-center"
            activeOpacity={0.7}
          >
            <Text className="font-semibold text-xl text-center">Income</Text>
          </TouchableOpacity>

          {/* Expense */}
          <TouchableOpacity
            className="flex flex-1 h-12 rounded-2xl bg-slate-200 items-center justify-center"
            activeOpacity={0.7}
          >
            <Text className="font-semibold text-xl text-center">Expense</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="mt-5 flex flex-1"
      >
        <View>
          <Text className="text-lg font-bold mb-5">May 15, 2016</Text>
          <View className="flex p-2 gap-10">
            <TransactionCard title="School Fees" amount={250} />
            <TransactionCard title="Food & Meals" amount={45.5} />
            <TransactionCard color="orange" title="Transport" amount={15} />
          </View>
        </View>

        <View>
          <Text className="text-lg font-bold mb-5">May 19, 2016</Text>
          <View className="flex p-2 gap-10">
            <TransactionCard income title="Freelance Work" amount={350.0} />
            <TransactionCard color="orange" income title="Gift" amount={50} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
