import BackText from "@/components/backtext";
import InputText from "@/components/input";
import { getSessionUser, SessionUser, updateSessionUser } from "@/lib/session";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const titles: Record<string, string> = {
  account: "Account information",
  budget: "Budget Settings",
  notifications: "Notifications",
  theme: "Theme",
  backups: "Data & Backups",
  about: "About GoalFlow",
};

export default function SettingsScreen() {
  const { slug = "about" } = useLocalSearchParams<{ slug?: string }>();
  const [enabled, setEnabled] = useState(true);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saved, setSaved] = useState(false);
  const title = titles[slug] || "Settings";

  useEffect(() => {
    getSessionUser().then((sessionUser) => {
      setUser(sessionUser);
      setFirstName(sessionUser?.first_name || "");
      setLastName(sessionUser?.last_name || "");
    });
  }, []);

  return (
    <SafeAreaView className="flex-1 px-5 py-5 bg-slate-50">
      <BackText title="Settings" />
      <View className="mt-10 rounded-3xl bg-white border border-gray-200 p-5">
        <Text className="text-3xl font-bold">{title}</Text>
        {slug === "account" ? (
          <View className="mt-6 gap-3">
            <Text className="text-gray-500">Account information</Text>
            <InputText
              placeHolder="First name"
              value={firstName}
              onChangeText={setFirstName}
            />
            <InputText
              placeHolder="Last name"
              value={lastName}
              onChangeText={setLastName}
            />
            <InputText
              placeHolder="Email"
              value={user?.email || ""}
              editable={false}
            />
            <InputText
              placeHolder="Phone"
              value={user?.phone || ""}
              editable={false}
            />
            <Text
              className="text-blue-700 font-semibold"
              onPress={async () => {
                const updated = await updateSessionUser({
                  first_name: firstName,
                  last_name: lastName,
                });
                setUser(updated);
                setSaved(true);
              }}
            >
              {saved ? "Changes saved" : "Save account details"}
            </Text>
          </View>
        ) : slug === "notifications" ? (
          <View className="flex-row items-center justify-between mt-8">
            <View className="flex-1 pr-4">
              <Text className="text-lg font-semibold">Push notifications</Text>
              <Text className="text-gray-500 mt-1">
                Stay informed about your activity.
              </Text>
            </View>
            <Switch value={enabled} onValueChange={setEnabled} />
          </View>
        ) : slug === "theme" ? (
          <Text className="text-gray-500 text-lg mt-5">
            System theme is active.
          </Text>
        ) : slug === "about" ? (
          <Text className="text-gray-500 text-lg mt-5">
            GoalFlow helps you track money, targets, and progress in one place.
          </Text>
        ) : (
          <Text className="text-gray-500 text-lg mt-5">
            This setting is ready for your next data connection.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
