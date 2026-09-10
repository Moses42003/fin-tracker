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

export default function SignUpScreen() {
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
              Create your account
            </Text>
            <Text className="text-xl text-center text-wrap font-normal text-gray-500 px-14">
              Start your journey to better money habits and bigger goals.
            </Text>
          </View>

          <View className="flex gap-4 py-5 mb-3">
            <View className="flex-row items-center gap-3">
              <InputText placeHolder="FirstName" />
              <InputText placeHolder="LastName" />
            </View>
            <InputText
              placeHolder="Email Address"
              icon="mail-outline"
              keyboardType="email-address"
            />
            <InputText
              placeHolder="+233 123 3456 789"
              icon="call-outline"
              keyboardType="phone-pad"
            />
            <InputText
              placeHolder="Create a strong password"
              icon="lock-closed-outline"
              secure
            />
            <InputText
              placeHolder="Repeat password"
              icon="lock-closed-outline"
              secure
            />

            <View className="bg-green-600 w-full h-3 rounded-3xl"></View>
          </View>

          <CustomButton
            name="Ceate Account"
            color="white"
            bgColor="#2563eb"
            onPress={() => router.navigate("/(auth)/emailverify")}
          />

          {/* Privacy Policy and ToS */}

          <View className="flex items-center mt-3">
            <Text className="text-lg text-gray-600 font-semibold">
              By creating an account, you agree to our
            </Text>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="text-blue-600 text-lg font-semibold">
                  Terms of Service
                </Text>
              </TouchableOpacity>
              <Text className="text-lg text-gray-600">and</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="text-blue-600 text-lg font-semibold">
                  Privacy Policy
                </Text>
              </TouchableOpacity>
            </View>
          </View>

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
              Already have an account?
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              className=""
              onPress={() => router.push("/login")}
            >
              <Text className="text-lg font-semibold text-blue-600">
                Log in
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusBar barStyle={"dark-content"} />
    </SafeAreaView>
  );
}
