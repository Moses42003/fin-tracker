import BackText from "@/components/backtext";
import CustomButton from "@/components/custombutton";
import InputText from "@/components/input";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 px-4 py-3 bg-white">
      <View className="mb-2">
        <BackText title="" />
      </View>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="items-center gap-3">
            <View className="w-24 h-24 rounded-3xl bg-blue-600 justify-center items-center">
              <Ionicons name="analytics" size={40} color="white" />
            </View>
            <View className="flex-row items-center gap-3">
              <View className="flex-row items-center">
                <Text className="text-6xl font-bold">Goal</Text>
                <Text className="text-6xl font-bold text-blue-500">Flow</Text>
              </View>
            </View>
          </View>
          <View className="flex gap-3 mt-4">
            <Text className="text-4xl text-center font-semibold">
              Welcome back!
            </Text>
            <Text className="text-xl text-center text-wrap font-normal text-gray-500 px-14">
              Log in to your account and continue your financial journey.
            </Text>
          </View>

          <View className="flex gap-4 py-5 mb-3">
            <InputText
              placeHolder="Phone Number"
              icon="call-outline"
              keyboardType="number-pad"
            />

            <InputText
              placeHolder="Enter your password"
              icon="lock-closed-outline"
              secure
            />

            <View className="flex-row items-center px-3 justify-end">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push("/(auth)/forgotpass")}
              >
                <Text className="text-lg font-semibold text-blue-500">
                  Forgot password
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <CustomButton
            name="Log In"
            color="white"
            bgColor="#2563eb"
            onPress={() => router.navigate("/(auth)/emailverify")}
          />

          <View className="flex-row items-center my-4">
            <View className="border-[1px] border-gray-300 flex-1"></View>
            <Text className="text-lg text-gray-600 mx-3">or</Text>
            <View className="border-[1px] border-gray-300 flex-1"></View>
          </View>

          {/* Continue with Google */}
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center justify-center gap-2 border-2 border-gray-400 rounded-3xl p-3 my-3"
          >
            <Ionicons name="logo-google" size={30} />
            <Text className="text-xl font-semibold">Continue with Google</Text>
          </TouchableOpacity>

          <View className="flex-row items-center justify-center mt-3 gap-2">
            <Text className="text-gray-500 text-lg font-semibold">
              Don&apos;t have an account?
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              className=""
              onPress={() => router.push("/signup")}
            >
              <Text className="text-lg font-semibold text-blue-600">
                Create an account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusBar barStyle={"dark-content"} />
    </SafeAreaView>
  );
}
