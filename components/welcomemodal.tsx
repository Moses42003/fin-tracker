import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface Props {
  visible: boolean;
  name: string;
  onClose: () => void;
}

/**
 * A one-time welcome dialog shown the first time an account reaches the app
 * after signing up or logging in. The notifications API has no create endpoint,
 * so this greeting is presented on-device rather than fetched from the server.
 */
export default function WelcomeModal({ visible, name, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="bg-gray-500/40 flex-1 items-center justify-center px-6">
        <View className="w-full max-w-md rounded-3xl bg-white p-6 items-center">
          <View className="w-20 h-20 rounded-full bg-blue-600 items-center justify-center">
            <Ionicons name="sparkles" size={38} color="white" />
          </View>

          <Text className="text-3xl font-bold text-center mt-5">
            Welcome, {name}!
          </Text>
          <Text className="text-gray-500 text-center mt-3 text-lg">
            GoalFlow is ready. Track your income and expenses, and set targets
            to keep your money moving in the right direction.
          </Text>

          <View className="w-full mt-6 gap-2">
            <View className="flex-row items-center gap-3">
              <Ionicons name="trending-up" size={20} color="#16a34a" />
              <Text className="text-gray-600 font-semibold flex-1">
                Record income as it comes in
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Ionicons name="trending-down" size={20} color="#dc2626" />
              <Text className="text-gray-600 font-semibold flex-1">
                Track every expense
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Ionicons name="trophy-outline" size={20} color="#d97706" />
              <Text className="text-gray-600 font-semibold flex-1">
                Set a target and watch it grow
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            className="w-full bg-blue-600 rounded-3xl py-4 mt-6 items-center"
          >
            <Text className="text-white font-bold text-xl">
              Let&apos;s get started
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
