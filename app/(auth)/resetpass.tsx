import BackText from "@/components/backtext";
import CustomButton from "@/components/custombutton";
import InputText from "@/components/input";
import { apiFetch, AUTH_ENDPOINTS } from "@/lib/api";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResetPasswordScreen() {
  const { target = "", code = "" } = useLocalSearchParams<{
    target?: string;
    code?: string;
  }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleResetPassword() {
    setError("");
    setSubmitted(true);
    if (!password || !confirmPassword) {
      setError(
        `Please complete: ${!password ? "new password" : "password confirmation"}.`,
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!isAcceptablePassword(password)) {
      setError("Your password must be at least Fair before continuing.");
      return;
    }

    setLoading(true);
    try {
      await apiFetch(AUTH_ENDPOINTS.resetPassword, {
        method: "PUT",
        body: { target, code, new_password: password },
      });
      router.replace("/(auth)/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reset password");
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
          <View className="mt-10 gap-3">
            <Text className="text-4xl text-center font-semibold">
              Create a new password
            </Text>
            <Text className="text-xl text-center text-gray-500 px-6">
              Choose a secure password for your account.
            </Text>
          </View>

          <View className="py-8 gap-3">
            <InputText
              placeHolder="New password"
              icon="lock-closed-outline"
              secure
              onChangeText={setPassword}
              value={password}
              editable={!loading}
              error={submitted && !password}
            />
            <InputText
              placeHolder="Confirm new password"
              icon="lock-closed-outline"
              secure
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              editable={!loading}
              error={
                submitted && (!confirmPassword || password !== confirmPassword)
              }
            />
            <PasswordFeedback
              password={password}
              confirmPassword={confirmPassword}
            />
            {error ? (
              <View className="flex-row items-center gap-2 rounded-2xl bg-red-50 border border-red-200 px-3 py-3">
                <Text className="text-red-700 font-semibold">{error}</Text>
              </View>
            ) : null}
          </View>

          <CustomButton
            name={loading ? "Updating password..." : "Update password"}
            color="white"
            bgColor="#2563eb"
            loading={loading}
            disabled={loading}
            onPress={handleResetPassword}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusBar barStyle="dark-content" />
    </SafeAreaView>
  );
}

function PasswordFeedback({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) {
  const checks = [
    { label: "8+ characters", valid: password.length >= 8 },
    { label: "uppercase", valid: /[A-Z]/.test(password) },
    { label: "number", valid: /\d/.test(password) },
    { label: "special character", valid: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((check) => check.valid).length;
  const color = score <= 1 ? "#dc2626" : score === 2 ? "#d97706" : "#16a34a";
  return (
    <View className="px-2 gap-1">
      <View className="flex-row items-center gap-2">
        <View className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{
              width: `${Math.max(score, 1) * 25}%`,
              backgroundColor: color,
            }}
          />
        </View>
        <Text style={{ color }} className="font-semibold">
          {password
            ? score === 4
              ? "Strong"
              : score >= 2
                ? "Fair"
                : "Weak"
            : "Password strength"}
        </Text>
      </View>
      {confirmPassword ? (
        <Text
          className={
            password === confirmPassword ? "text-green-600" : "text-red-600"
          }
        >
          {password === confirmPassword
            ? "✓ Passwords match"
            : "Passwords do not match"}
        </Text>
      ) : null}
    </View>
  );
}

function isAcceptablePassword(password: string) {
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  return score >= 2;
}
