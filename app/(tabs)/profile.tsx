import CustomButton from "@/components/custombutton";
import GreetingCard from "@/components/greetingcard";
import SettingOption from "@/components/settingoption";
import {
    clearSession,
    displayName,
    getSessionUser,
    SessionUser,
} from "@/lib/session";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileTab() {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    getSessionUser().then(setUser);
  }, []);

  async function handleLogout() {
    await clearSession();
    router.replace("/(auth)/login");
  }

  return (
    <SafeAreaView className="flex flex-1 bg-violet-950 pt-10">
      <View className="flex flex-2 px-5 mb-4">
        <GreetingCard name={displayName(user)} profile />
      </View>
      <ScrollView className="flex flex-1 h-max bg-white rounded-t-3xl px-8 py-5">
        <SettingOption value="GH₵" icon="cash-outline" name="Currency" />

        <SettingOption
          name="Budget Settings"
          icon="wallet-outline"
          onPress={() => router.push("/settings/budget")}
        />

        <SettingOption
          icon="notifications-outline"
          name="Notifications"
          onPress={() => router.push("/settings/notifications")}
        />

        <SettingOption
          value="System"
          name="Theme"
          icon="color-fill-outline"
          onPress={() => router.push("/settings/theme")}
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
