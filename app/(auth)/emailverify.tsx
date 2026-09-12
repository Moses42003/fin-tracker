import BackText from "@/components/backtext";
import CustomButton from "@/components/custombutton";
import { apiFetch, AUTH_ENDPOINTS } from "@/lib/api";
import { saveSession } from "@/lib/session";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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
  const {
    email = "",
    phone = "",
    purpose = "signup",
  } = useLocalSearchParams<{
    email?: string;
    phone?: string;
    purpose?: string;
  }>();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);
  const target = (purpose === "reset" ? email || phone : phone || email).trim();
  const isEmailTarget = target.includes("@");
  const targetLabel = isEmailTarget ? "email address" : "phone number";

  function handleChange(text: string, index: number) {
    setError("");
    const digits = text.replace(/\D/g, "").slice(0, otp.length);
    const newOtp = [...otp];

    if (!digits) {
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    digits.split("").forEach((digit, offset) => {
      if (index + offset < newOtp.length) {
        newOtp[index + offset] = digit;
      }
    });
    setOtp(newOtp);

    const nextIndex = Math.min(index + digits.length, newOtp.length - 1);
    if (nextIndex < newOtp.length - 1) {
      inputRefs.current[nextIndex]?.focus();
    }

    if (newOtp.every((value) => value !== "")) {
      Keyboard.dismiss();
    }
  }

  function handleKeyPress(e: { nativeEvent: { key: string } }, index: number) {
    if (e.nativeEvent.key !== "Backspace") {
      return;
    }

    if (otp[index]) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    if (index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  }

  function clearCode() {
    setOtp(["", "", "", "", "", ""]);
    setTimeout(() => inputRefs.current[0]?.focus(), 50);
  }

  async function handleVerify() {
    const code = otp.join("");
    setError("");
    if (code.length !== otp.length) {
      setError("Enter the 6-digit verification code");
      return;
    }

    setLoading(true);
    try {
      if (purpose === "reset") {
        router.push({
          pathname: "/(auth)/resetpass",
          params: { target, code },
        });
        return;
      }

      const data = await apiFetch(AUTH_ENDPOINTS.verifyOtp, {
        method: "POST",
        body: { target, code },
      });
      const token = data.token || data.access_token;
      if (token) {
        await saveSession(token);
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/login");
      }
    } catch (err) {
      clearCode();
      setError(
        err instanceof Error ? err.message : `Unable to verify ${targetLabel}`,
      );
    } finally {
      setLoading(false);
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
              <Ionicons
                name={isEmailTarget ? "mail-unread" : "call"}
                size={70}
                color="white"
              />
            </View>
            <Text className="text-4xl font-bold">
              Verify Your {isEmailTarget ? "Email" : "Phone"}
            </Text>
            <Text className="text-lg text-gray-500 font-semibold text-center">
              We&apos;ve requested a 6-digit code for your {targetLabel}
            </Text>
            <Text className="text-xl text-gray-600 font-semibold">
              {target || "your email address"}
            </Text>
            <Text className="text-sm text-gray-500 text-center px-8">
              Enter exactly 6 numbers. We&apos;ll send target and code to the
              verification service.
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
                editable={!loading}
                style={error ? { borderColor: "#ef4444" } : undefined}
                keyboardType="number-pad"
                onKeyPress={(e) => handleKeyPress(e, index)}
                autoFocus={index === 0}
                maxLength={6}
                placeholder={(index + 1).toString()}
                placeholderTextColor="#d1d5db"
                className="w-12 h-14 text-2xl font-bold text-center text-gray-800 border-2 border-gray-400 rounded-2xl"
              />
            ))}
          </View>

          <View className="flex-row items-center justify-center gap-2 mt-5 mb-7 flex-wrap">
            <Text className="text-lg font-semibold text-gray-500">
              {purpose === "login"
                ? "Need a new code? Go back and log in again."
                : isEmailTarget
                  ? "No email yet? Check spam or try again later."
                  : "No text yet? Check your signal or try again later."}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              className=""
              onPress={() => router.back()}
            >
              <Text className="text-lg font-semibold text-blue-600">
                {purpose === "login" ? "Try again" : "Back"}
              </Text>
            </TouchableOpacity>
          </View>

          {error ? (
            <View className="flex-row items-center gap-2 rounded-2xl bg-red-50 border border-red-200 px-3 py-3">
              <Ionicons name="alert-circle" size={20} color="#dc2626" />
              <Text className="flex-1 text-red-700 font-semibold">{error}</Text>
            </View>
          ) : null}

          <CustomButton
            name="Verify"
            bgColor="#2563eb"
            color="white"
            icon="arrow-forward"
            disabled={loading}
            onPress={handleVerify}
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
