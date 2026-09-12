import BackText from "@/components/backtext";
import CustomButton from "@/components/custombutton";
import InputText from "@/components/input";
import { apiFetch, AUTH_ENDPOINTS } from "@/lib/api";
import {
    formatPhone,
    isValidEmail,
    isValidPhone,
    normalizePhone,
} from "@/lib/authValidation";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
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

export default function ForgotPassword() {
  const [target, setTarget] = useState("");
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRequestCode() {
    setError("");
    setSubmitted(true);
    if (!target.trim()) {
      setError(`Enter your ${mode} address.`);
      return;
    }

    const normalizedTarget =
      mode === "email" ? target.trim().toLowerCase() : normalizePhone(target);
    if (mode === "email" && !isValidEmail(normalizedTarget)) {
      setError("Enter a valid email address.");
      return;
    }
    if (mode === "phone" && !isValidPhone(normalizedTarget)) {
      setError("Enter a valid phone number.");
      return;
    }
    setLoading(true);
    try {
      await apiFetch(AUTH_ENDPOINTS.requestPasswordReset, {
        method: "POST",
        body: { target: normalizedTarget },
        timeoutMs: 90000,
        timeoutMessage:
          "The reset email is taking longer than expected. Please try again later.",
      });
      router.push({
        pathname: "/(auth)/emailverify",
        params: { email: normalizedTarget, purpose: "reset", method: "reset" },
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to send reset code",
      );
    } finally {
      setLoading(false);
    }
  }

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
              <Ionicons name="lock-closed-outline" size={40} color="white" />
            </View>
          </View>
          <View className="flex gap-3 mt-4">
            <Text className="text-4xl text-center font-semibold">
              Forgot Password
            </Text>
            <Text className="text-xl text-center text-wrap font-normal text-gray-500 px-14">
              Choose where to receive your reset code.
            </Text>
          </View>

          <View className="flex gap-4 py-5 mb-3">
            <View className="flex-row rounded-2xl bg-gray-100 p-1">
              {(["email", "phone"] as const).map((option) => (
                <TouchableOpacity
                  key={option}
                  activeOpacity={0.8}
                  className={`flex-1 rounded-xl py-3 items-center ${
                    mode === option ? "bg-white" : ""
                  }`}
                  onPress={() => {
                    setMode(option);
                    setTarget("");
                    setError("");
                    setSubmitted(false);
                  }}
                  disabled={loading}
                >
                  <Text
                    className={`font-semibold capitalize ${
                      mode === option ? "text-blue-700" : "text-gray-500"
                    }`}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <InputText
              placeHolder={
                mode === "email" ? "Email address" : "+233 241 234 567"
              }
              icon={mode === "email" ? "mail-outline" : "call-outline"}
              keyboardType={mode === "email" ? "email-address" : "phone-pad"}
              onChangeText={(value) =>
                mode === "email"
                  ? setTarget(value)
                  : setTarget(formatPhone(value))
              }
              value={target}
              editable={!loading}
              error={
                submitted &&
                (!target.trim() ||
                  (mode === "email"
                    ? !isValidEmail(target)
                    : !isValidPhone(target)))
              }
            />
            {error ? (
              <View className="flex-row items-center gap-2 rounded-2xl bg-red-50 border border-red-200 px-3 py-3">
                <Ionicons name="alert-circle" size={20} color="#dc2626" />
                <Text className="flex-1 text-red-700 font-semibold">
                  {error}
                </Text>
              </View>
            ) : null}
          </View>

          <CustomButton
            name="Send Reset Code"
            color="white"
            bgColor="#2563eb"
            loading={loading}
            disabled={loading}
            onPress={handleRequestCode}
          />

          <View className="flex-row items-center justify-center mt-3 gap-2">
            <Text className="text-gray-500 text-lg font-semibold">
              Remembered it?
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              className=""
              onPress={() => router.back()}
            >
              <Text className="text-lg font-semibold text-blue-600">
                Back to login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusBar barStyle={"dark-content"} />
    </SafeAreaView>
  );
}
