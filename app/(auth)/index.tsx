import CustomButton from "@/components/custombutton";
import { getSessionToken } from "@/lib/session";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ImageBackground,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SplahScreen() {
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    getSessionToken().then((token) => {
      if (token) {
        router.replace("/(tabs)");
      } else {
        setCheckingSession(false);
      }
    });
  }, []);

  if (checkingSession) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-violet-950">
        <ActivityIndicator size="large" color="white" />
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/BG Asset/image_bg_one.png")}
      className="flex-1 px-5 pt-16"
    >
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center gap-3">
          <View className="w-24 h-24 rounded-3xl bg-blue-600 justify-center items-center">
            <Ionicons name="analytics" size={40} color="white" />
          </View>
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center">
              <Text className="text-6xl font-bold text-white">Goal</Text>
              <Text className="text-6xl font-bold text-blue-500">Flow</Text>
            </View>
          </View>

          <Text className="text-2xl font-semibold text-gray-200">
            Track. Save. Achieve
          </Text>
          <View className="px-14">
            <Text className="text-xl text-center text-wrap font-normal text-gray-200">
              Take Control of your money, reach your goals, and build a better
              financial future.
            </Text>
          </View>
        </View>

        <View className="flex justify-center items-center mb-4 gap-2">
          <CustomButton
            name="Get Started"
            color="white"
            bgColor="#2563eb"
            icon="arrow-forward"
            onPress={() => router.push("/(auth)/signup")}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/(auth)/login")}
            className="items-center justify-center"
          >
            <Text className="text-lg font-semibold text-white">
              I already have an account
            </Text>
          </TouchableOpacity>
          {__DEV__ ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.replace("/(tabs)")}
              className="flex-row items-center justify-center gap-2 mt-4 rounded-2xl border border-white/60 px-4 py-3"
            >
              <Ionicons name="construct-outline" size={18} color="white" />
              <Text className="text-sm font-semibold text-white">
                Continue to app (development)
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </SafeAreaView>

      <StatusBar barStyle={"light-content"} />
    </ImageBackground>
  );
}
