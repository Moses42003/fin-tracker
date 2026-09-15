import BackText from "@/components/backtext";
import CustomButton from "@/components/custombutton";
import CustomMadal from "@/components/custommodal";
import InputText from "@/components/input";
import { deleteUserOnBackend, getSessionUser } from "@/lib/session";
import { router } from "expo-router";
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

export default function AccountInfo() {
  const [showModal, setShowModal] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const userInfo = [firstName, lastName, phone, email];

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  async function handleDeleteAccount() {
    try {
      setLoading(false);
      await deleteUserOnBackend();
      setLoading(true);
      router.back();
      router.replace("/(auth)/signup");
    } catch (error) {
      console.log("delete failed :", error);
      const message =
        error instanceof Error ? error.message : "Unable to create account";
      setError(message);
    }
  }

  async function handleSaveChanges() {
    try {
      setSaveLoading(false);
      const oldInfo = getSessionUser();
      console.log(oldInfo);
      // await updateUserOnBackend(userInfo);
    } catch (error) {
      console.log(error);
    }
  }

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
                  placeHolder="FirstName"
                  value={firstName}
                  onChangeText={setFirstName}
                />
                <InputText
                  placeHolder="FirstName"
                  value={lastName}
                  onChangeText={setLastName}
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
                Change your email and phone, but you will need to verify to
                change them
              </Text>
            </View>
            <InputText
              placeHolder="Phone Number"
              icon="call-outline"
              value={phone}
              onChangeText={setPhone}
            />
            <InputText
              placeHolder="Email"
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View className="p-2 rounded-2xl border-2 border-gray-300 bg-white my-3">
            <View className="my-2">
              <Text className="text-2xl font-bold text-center">Security</Text>
              <Text className="text-gray-400 text-center">
                Change your password
              </Text>
            </View>

            <InputText
              placeHolder="New Password"
              icon="lock-closed-outline"
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <InputText
              placeHolder="Confirm Password"
              icon="lock-closed-outline"
            />
          </View>

          <View className="p-2 rounded-2xl border-2 border-gray-300 bg-white my-3">
            <CustomButton
              name="Save Changes"
              bgColor="blue"
              color="white"
              loading={saveLoading}
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
        heading="Are you sure you want to delete your Account?"
        description="Deleting your account is an action that cannot be undone"
        visible={showModal}
        onClose={() => setShowModal(false)}
        onComfirm={() => handleDeleteAccount()}
        loading={loading}
      />
      <StatusBar barStyle={"dark-content"} />
    </SafeAreaView>
  );
}
