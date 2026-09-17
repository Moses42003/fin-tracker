import CustomButton from "@/components/custombutton";
import GreetingCard from "@/components/greetingcard";
import SettingOption from "@/components/settingoption";
import { currency } from "@/lib/format";
import { getDashboardOverview, DashboardOverview } from "@/lib/finance";
import { useSession } from "@/lib/sessionContext";
import { useAsyncData } from "@/lib/useAsyncData";
import { router } from "expo-router";
import { useCallback } from "react";
import { ScrollView, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileTab() {
  const { name, signOut, dataVersion } = useSession();
  const overviewLoader = useCallback(() => getDashboardOverview(), []);
  const { data: overview } = useAsyncData<DashboardOverview>(
    overviewLoader,
    dataVersion,
  );

  const currencyLabel = overview
    ? `GH₵ · ${currency(overview.balance).replace("GH₵ ", "")}`
    : "GH₵";

  async function handleLogout() {
    await signOut();
    router.replace("/(auth)/login");
  }

  return (
    <SafeAreaView className="flex flex-1 bg-violet-950 pt-10">
      <View className="flex flex-2 px-5 mb-4">
        <GreetingCard name={name} profile />
      </View>
      <ScrollView className="flex flex-1 h-max bg-white rounded-t-3xl px-8 py-5">
        <SettingOption
          name="Account information"
          icon="person-outline"
          onPress={() => router.push("/settings/accountinfo")}
        />
        <SettingOption
          value={currencyLabel}
          icon="cash-outline"
          name="Currency"
          onPress={() => router.push("/settings/currency")}
        />

        <SettingOption
          name="Budget Settings"
          icon="wallet-outline"
          onPress={() => router.push("/settings/budget")}
        />

        <SettingOption
          icon="notifications-outline"
          name="Notifications"
          onPress={() => router.push("/notification")}
        />

        <SettingOption
          icon="cloud-outline"
          name="Data & Backups"
          onPress={() => router.push("/settings/backups")}
        />

        <SettingOption
          last
          icon="information-circle-outline"
          name="About App"
          onPress={() => router.push("/settings/about")}
        />

        <CustomButton name="Log Out" color="red" onPress={handleLogout} />
      </ScrollView>

      <StatusBar barStyle={"light-content"} />
    </SafeAreaView>
  );
}
