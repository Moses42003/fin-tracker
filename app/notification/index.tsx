import BackText from "@/components/backtext";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationScreen() {
  return (
    <SafeAreaView className="flex-1 p-4">
      <View>
        <BackText />
      </View>
      <ScrollView
        contentContainerStyle={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <View className="flex-1 justify-center items-center">
          <Text className="text-2xl font-bold text-blue-400">
            Notification is Coming Soon
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
