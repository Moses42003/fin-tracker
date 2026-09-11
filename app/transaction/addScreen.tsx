import BackText from "@/components/backtext";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddScreen() {
  return (
    <SafeAreaView className="flex-1 py-5 px-4">
      <View>
        <BackText />
      </View>
    </SafeAreaView>
  );
}
