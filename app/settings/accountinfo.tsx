import BackText from "@/components/backtext";
import CustomButton from "@/components/custombutton";
import CustomMadal from "@/components/custommodal";
import InputText from "@/components/input";
import { requestPasswordResetForAccount, updateUserAccount } from "@/lib/finance";
import { isValidEmail, normalizePhone } from "@/lib/authValidation";
import { useSession } from "@/lib/sessionContext";
import { deleteUserOnBackend, getSessionUser, SessionUser } from "@/lib/session";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountInfo() {
  const [showModal, setShowModal] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState<SessionUser | null>(null);

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordSent, setPasswordSent] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const { setUser: setSessionUser } = useSession();

  async function handleSendPasswordCode() {
    setSaveError("");
    setSuccess("");
    const target = email.trim().toLowerCase() || normalizePhone(phone);
    if (!target) {
      setSaveError("Add an email or phone number first.");
      return;
    }
    setPasswordLoading(true);
    try {
      await requestPasswordResetForAccount(target);
      setPasswordSent(true);
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : "Unable to start the password reset.",
      );
    } finally {
      setPasswordLoading(false);
    }
  }

  async function handleDeleteAccount() {
    try {
      setError("");
      setLoading(true);
      await deleteUserOnBackend();
      await setSessionUser(null);
      setShowModal(false);
      router.replace("/(auth)/signup");
    } catch (error) {
      console.log("delete failed :", error);
      const message =
        error instanceof Error ? error.message : "Unable to delete account";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveChanges() {
    setSaveError("");
    setSuccess("");

    if (!email.trim() || !isValidEmail(email)) {
      setSaveError("Enter a valid email address.");
      return;
    }
    setSaveLoading(true);
    try {
      const updated = await updateUserAccount({
        email: email.trim().toLowerCase(),
        firstName,
        lastName,
        phone: normalizePhone(phone),
      });

      // The PUT returns the new UserSchema; push it into the shared session so
      // the greeting card and every other screen reflect the change at once.
      const nextUser = { ...(updated as SessionUser) };
      if (!nextUser.id) nextUser.id = user?.id;
      setUser(nextUser);
      await setSessionUser(nextUser);

      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Your account information has been updated.");
      setPasswordSent(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to update your account";
      setSaveError(message);
    } finally {
      setSaveLoading(false);
    }
  }

  useEffect(() => {
    getSessionUser().then((sessionUser) => {
      setUser(sessionUser);
      setFirstName(sessionUser?.first_name || "");
      setLastName(sessionUser?.last_name || "");
      setPhone(sessionUser?.phone || "");
      setEmail(sessionUser?.email || "");
    });
  }, []);

  return (
    <SafeAreaView className="flex-1 pt-5 px-4 bg-gray-100">
      <View className="mb-5">
        <BackText title="Settings" />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="p-2 rounded-2xl border-2 border-gray-300 bg-white mb-3">
            <Text className="text-center text-2xl font-bold">
              Account Information
            </Text>
            <Text className="text-gray-500 text-center">
              View, change and delete your account info here
            </Text>
          </View>
          <View className="p-2 rounded-2xl border-2 border-gray-300 bg-white">
            <View className="flex-1 justify-center items-center my-3">
              <View className="w-36 h-36 rounded-full bg-blue-800"></View>
            </View>

            <View className="flex-1">
              <View className="flex-row gap-2 items-center">
                <InputText
                  placeHolder="First Name"
                  icon="person-outline"
                  value={firstName}
                  onChangeText={setFirstName}
                  editable={!saveLoading}
                />
                <InputText
                  placeHolder="Last Name"
                  icon="person-outline"
                  value={lastName}
                  onChangeText={setLastName}
                  editable={!saveLoading}
                />
              </View>
            </View>
          </View>

          <View className="p-2 rounded-2xl border-2 border-gray-300 bg-white my-3">
            <View className="my-2">
              <Text className="text-2xl font-bold text-center">
                Contact Info
              </Text>
              <Text className="text-gray-400 text-center">
                Update your contact details. Email changes are saved right away;
                phone changes are confirmed by the server after verification.
              </Text>
            </View>
            <InputText
              placeHolder="Phone Number"
              icon="call-outline"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              editable={!saveLoading}
            />
            <InputText
              placeHolder="Email"
              icon="mail-outline"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={!saveLoading}
            />
          </View>

          <View className="p-2 rounded-2xl border-2 border-gray-300 bg-white my-3">
            <View className="my-2">
              <Text className="text-2xl font-bold text-center">Security</Text>
              <Text className="text-gray-400 text-center">
                Change your password with a one-time code
              </Text>
            </View>

            <InputText
              placeHolder="New Password"
              icon="lock-closed-outline"
              secure
              value={newPassword}
              onChangeText={setNewPassword}
              editable={!passwordLoading}
            />
            <InputText
              placeHolder="Confirm Password"
              icon="lock-closed-outline"
              secure
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!passwordLoading}
              error={Boolean(
                confirmPassword && newPassword !== confirmPassword,
              )}
            />

            <Text className="text-gray-500 px-1">
              For your security, we email you a 6-digit code before your
              password can be changed.
            </Text>

            {passwordSent ? (
              <View className="flex-row items-center gap-2 rounded-2xl bg-blue-50 border-blue-200 px-3 py-3 mt-2">
                <Ionicons name="mail-outline" size={20} color="#2563eb" />
                <Text className="flex-1 text-blue-700 font-semibold">
                  Code sent. Enter it with your new password to finish.
                </Text>
              </View>
            ) : null}

            <CustomButton
              name="Send Reset Code"
              bgColor="#0f172a"
              color="white"
              loading={passwordLoading}
              disabled={passwordLoading}
              onPress={handleSendPasswordCode}
            />
          </View>

          <View className="p-2 rounded-2xl border-2 border-gray-300 bg-white my-3">
            {saveError ? (
              <View className="flex-row items-center gap-2 rounded-2xl bg-red-50 border-red-200 px-3 py-3 mb-2">
                <Ionicons name="alert-circle" size={20} color="#dc2626" />
                <Text className="flex-1 text-red-700 font-semibold">
                  {saveError}
                </Text>
              </View>
            ) : null}

            {success ? (
              <View className="flex-row items-center gap-2 rounded-2xl bg-green-50 border-green-200 px-3 py-3 mb-2">
                <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
                <Text className="flex-1 text-green-700 font-semibold">
                  {success}
                </Text>
              </View>
            ) : null}

            <CustomButton
              name="Save Changes"
              bgColor="#2563eb"
              color="white"
              loading={saveLoading}
              disabled={saveLoading}
              onPress={() => handleSaveChanges()}
            />
          </View>

          <View className="p-2 rounded-2xl border-2 border-red-400 bg-red-50 my-3">
            <View className="my-2">
              <Text className="text-2xl text-red-600 text-center font-bold">
                Remove Account
              </Text>
              <Text className="text-center text-red-400">
                Remove your account
              </Text>
            </View>

            {error ? (
              <View className="p-2 border-2 border-red-400 bg-red-100 rounded-xl">
                <Text className="text-red-500 font-semibold">
                  Error: {error}
                </Text>
              </View>
            ) : (
              ""
            )}

            <CustomButton
              name="Delete Account"
              color="white"
              bgColor="red"
              onPress={() => setShowModal(true)}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <CustomMadal
        heading="Delete your account?"
        description="This permanently removes your account and all of your records. This cannot be undone."
        confirmLabel="Delete account"
        confirmColor="#dc2626"
        cancelLabel="Keep account"
        visible={showModal}
        onClose={() => setShowModal(false)}
        onComfirm={() => handleDeleteAccount()}
        loading={loading}
      />
      <StatusBar barStyle={"dark-content"} />
    </SafeAreaView>
  );
}
