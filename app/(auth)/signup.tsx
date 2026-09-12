import BackText from "@/components/backtext";
import CustomButton from "@/components/custombutton";
import InputText from "@/components/input";
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

import { apiFetch, AUTH_ENDPOINTS } from "@/lib/api";
import {
    formatPhone,
    isValidEmail,
    normalizePhone,
} from "@/lib/authValidation";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [canContinueToVerification, setCanContinueToVerification] =
    useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    console.log("Signup button pressed");
    setError("");
    setCanContinueToVerification(false);
    setSubmitted(true);
    setEmailError(isValidEmail(email) ? "" : "Enter a valid email address.");

    const missingFields = [
      !firstName.trim() && "first name",
      !lastName.trim() && "last name",
      !email.trim() && "email",
      !phone.trim() && "phone number",
      !password && "password",
      !confirmPassword && "password confirmation",
    ].filter(Boolean);

    if (missingFields.length) {
      setError(`Please complete: ${missingFields.join(", ")}.`);
      return;
    }

    if (!isValidEmail(email)) {
      setError("Enter a valid email address before continuing.");
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
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPhone = normalizePhone(phone);
      await apiFetch(AUTH_ENDPOINTS.signup, {
        method: "POST",
        body: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: normalizedEmail,
          phone: normalizedPhone,
          password,
        },
        timeoutMs: 90000,
        timeoutMessage:
          "Account creation or email delivery is taking longer than expected. Please try again.",
      });

      router.push({
        pathname: "/(auth)/emailverify",
        params: {
          email: normalizedEmail,
          phone: normalizedPhone,
          purpose: "signup",
        },
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to create account";
      const isDuplicate = /already exists|duplicate/i.test(message);
      const recoverable = /too long|timed out/i.test(message);
      setCanContinueToVerification(recoverable);
      setError(
        isDuplicate
          ? "This email is already registered, including a previous deleted account. The backend must restore or permanently remove it before you can reuse it."
          : message,
      );
      if (recoverable) {
        router.push({
          pathname: "/(auth)/emailverify",
          params: {
            email: email.trim().toLowerCase(),
            phone: normalizePhone(phone),
            purpose: "signup",
          },
        });
      }
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
              <InputText
                placeHolder="FirstName"
                onChangeText={(e) => setFirstName(e)}
                value={firstName}
                editable={!loading}
                error={submitted && !firstName.trim()}
              />
              <InputText
                placeHolder="LastName"
                onChangeText={(e) => setLastName(e)}
                value={lastName}
                editable={!loading}
                error={submitted && !lastName.trim()}
              />
            </View>
            <InputText
              placeHolder="Email Address"
              icon="mail-outline"
              keyboardType="email-address"
              onChangeText={(e) => setEmail(e)}
              value={email}
              editable={!loading}
              error={Boolean(emailError) || (submitted && !email.trim())}
              onBlur={() => {
                if (email.trim() && !isValidEmail(email)) {
                  setEmailError("Enter a valid email address.");
                } else {
                  setEmailError("");
                }
              }}
            />
            {emailError ? (
              <Text className="text-red-700 font-semibold">{emailError}</Text>
            ) : null}
            <InputText
              placeHolder="+233 123 3456 789"
              icon="call-outline"
              keyboardType="phone-pad"
              onChangeText={(e) => setPhone(formatPhone(e))}
              value={phone}
              editable={!loading}
              error={submitted && !phone.trim()}
            />
            <InputText
              placeHolder="Create a password"
              icon="lock-closed-outline"
              secure
              onChangeText={setPassword}
              value={password}
              editable={!loading}
              error={submitted && !password}
            />
            <InputText
              placeHolder="Repeat password"
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
                <Ionicons name="alert-circle" size={20} color="#dc2626" />
                <Text className="flex-1 text-red-700 font-semibold">
                  {error}
                </Text>
              </View>
            ) : null}
            {canContinueToVerification ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  router.push({
                    pathname: "/(auth)/emailverify",
                    params: {
                      email: email.trim().toLowerCase(),
                      phone: normalizePhone(phone),
                      purpose: "signup",
                    },
                  })
                }
              >
                <Text className="text-blue-600 text-center font-semibold">
                  Continue to email verification
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <CustomButton
            disabled={loading}
            loading={loading}
            name={loading ? "Creating account..." : "Create Account"}
            color="white"
            bgColor="#2563eb"
            onPress={() => handleSignup()}
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

function isAcceptablePassword(password: string) {
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  return score >= 2;
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
    { label: "uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "number", valid: /\d/.test(password) },
    { label: "special character", valid: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((check) => check.valid).length;
  const strength =
    score <= 1
      ? "Weak"
      : score === 2
        ? "Fair"
        : score === 3
          ? "Good"
          : "Strong";
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
          {password ? strength : "Password strength"}
        </Text>
      </View>
      <Text className="text-gray-500 text-sm">
        {checks
          .map((check) => `${check.valid ? "✓" : "○"} ${check.label}`)
          .join("   ")}
      </Text>
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
