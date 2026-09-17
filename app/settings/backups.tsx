import BackText from "@/components/backtext";
import CustomButton from "@/components/custombutton";
import {
  listTargets,
  listTransactions,
  TransactionRecord,
  TargetResponse,
} from "@/lib/finance";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface BackupResult {
  exportedAt: string;
  transactions: TransactionRecord[];
  targets: TargetResponse[];
}

export default function BackupsScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BackupResult | null>(null);

  const runBackup = useCallback(async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const [transactions, targets] = await Promise.all([
        listTransactions(),
        listTargets(),
      ]);
      setResult({
        exportedAt: new Date().toISOString(),
        transactions,
        targets,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to prepare your backup right now.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SafeAreaView className="flex-1 px-4 py-5 bg-white">
      <BackText title="Data & Backups" />
      <ScrollView showsVerticalScrollIndicator={false} className="mt-6">
        <Text className="text-3xl font-bold">Data &amp; backups</Text>
        <Text className="text-gray-500 text-lg mt-2">
          Your records live on the GoalFlow server. Here you can confirm what is
          stored and copy a snapshot of your data.
        </Text>

        <View className="rounded-3xl border-2 border-gray-300 bg-white p-5 mt-5">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-2xl bg-blue-50 items-center justify-center">
              <Ionicons name="cloud-outline" size={24} color="#2563eb" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold">Cloud sync</Text>
              <Text className="text-gray-500">
                Every record is saved to your account as you add it.
              </Text>
            </View>
          </View>

          <CustomButton
            name={loading ? "Preparing…" : "Prepare a snapshot"}
            color="white"
            bgColor="#2563eb"
            disabled={loading}
            loading={loading}
            onPress={runBackup}
          />

          {error ? (
            <View className="flex-row items-center gap-2 rounded-2xl bg-red-50 border-red-200 px-3 py-3">
              <Ionicons name="alert-circle" size={20} color="#dc2626" />
              <Text className="flex-1 text-red-700 font-semibold">{error}</Text>
            </View>
          ) : null}
        </View>

        {loading ? (
          <View className="items-center justify-center py-12">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : null}

        {result ? (
          <View className="rounded-3xl border-2 border-green-300 bg-green-50 p-5 mt-4">
            <View className="flex-row items-center gap-2">
              <Ionicons name="checkmark-circle" size={22} color="#16a34a" />
              <Text className="text-xl font-bold text-green-800">
                Snapshot ready
              </Text>
            </View>
            <Text className="text-green-800 mt-2">
              {result.transactions.length} records · {result.targets.length}{" "}
              targets
            </Text>
            <Text className="text-green-700 text-sm mt-1">
              Taken{" "}
              {new Date(result.exportedAt).toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Text>
          </View>
        ) : null}

        <View className="rounded-3xl border-2 border-gray-300 bg-white p-5 mt-4 mb-8">
          <Text className="text-xl font-bold">Need a full export?</Text>
          <Text className="text-gray-500 mt-2">
            Ask support to send a copy of your account data. Deleting your
            account from Account Information permanently removes your records,
            so take a snapshot first if you want to keep them.
          </Text>
        </View>
      </ScrollView>
      <StatusBar barStyle="dark-content" />
    </SafeAreaView>
  );
}
