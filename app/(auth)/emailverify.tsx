import BackText from "@/components/backtext";
import CustomButton from "@/components/custombutton";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EmailVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const inputRefs = useRef([]);

  // @ts-ignore
  function handleChange(text, index) {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    const isComplete = newOtp.every((value) => value !== "");

    if (isComplete) {
      Keyboard.dismiss();
    }

    if (text && index < 5) {
      setTimeout(() => {
        // @ts-ignore
        inputRefs.current[index + 1]?.focus();
      }, 50);
    }
  }

  // @ts-ignore
  function handleKeyPress(e, index) {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      setTimeout(() => {
        // @ts-ignore
        inputRefs.current[index - 1]?.focus();
      }, 50);
    }
  }
  return (
    <SafeAreaView className="flex-1 py-3 px-4">
      <View>
        <BackText />
      </View>
      <KeyboardAvoidingView
        className="flex-1 items-center justify-center"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View className="items-center gap-3 flex-1 justify-center">
            <View className="w-32 h-32 rounded-3xl bg-blue-600 justify-center items-center my-5">
              <Ionicons name="mail-unread" size={70} color="white" />
            </View>
            <Text className="text-4xl font-bold">Verify Your Email</Text>
            <Text className="text-lg text-gray-500 font-semibold">
              We&apos;ve sent a 6-digit code to
            </Text>
            <Text className="text-xl text-gray-600 font-semibold">
              moses@goalflow.com
            </Text>
          </View>

          <View className="flex-1 flex-row items-center justify-center px-6 gap-3 mt-7 mb-3">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                // @ts-ignore;
                ref={(el) => {
                  // @ts-ignore
                  if (el) inputRefs.current[index] = el;
                }}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                keyboardType="number-pad"
                onKeyPress={(e) => handleKeyPress(e, index)}
                autoFocus={index === 0}
                maxLength={1}
                placeholder={(index + 1).toString()}
                placeholderTextColor="#d1d5db"
                className="w-12 h-14 text-2xl font-bold text-center text-gray-800 border-2 border-gray-400 rounded-2xl"
              />
            ))}
          </View>

          <View className="flex-row items-center justify-center gap-2 mt-5 mb-7">
            <Text className="text-lg font-semibold text-gray-500">
              Did&apos;t receive the code?
            </Text>
          </View>

          <CustomButton
            name="Verify"
            bgColor="#2563eb"
            color="white"
            icon="arrow-forward"
            onPress={() => router.replace("/(tabs)")}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            className="items-center justify-center mt-8"
            onPress={() => router.replace("/(auth)/login")}
          >
            <Text className="text-blue-600 text-lg font-semibold">
              Back to login
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <StatusBar barStyle={"dark-content"} />
    </SafeAreaView>
  );
}
