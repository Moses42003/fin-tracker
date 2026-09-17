import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Modal, Text, TouchableOpacity, View } from "react-native";

interface Props {
  visible: boolean;
  targetName: string;
  amount?: string;
  onClose: () => void;
}

export default function AchievementModal({
  visible,
  targetName,
  amount,
  onClose,
}: Props) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    scale.setValue(0.8);
    opacity.setValue(0);
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, scale, opacity]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="bg-gray-900/50 flex-1 items-center justify-center px-6">
        <Animated.View
          style={{ transform: [{ scale }], opacity }}
          className="w-full max-w-md rounded-3xl bg-white p-6 items-center"
        >
          <View className="w-24 h-24 rounded-full bg-amber-400 items-center justify-center">
            <Ionicons name="trophy" size={46} color="white" />
          </View>

          <View className="flex-row items-center gap-2 mt-4">
            <Ionicons name="sparkles" size={20} color="#d97706" />
            <Text className="text-amber-600 font-bold tracking-widest">
              ACHIEVEMENT UNLOCKED
            </Text>
          </View>

          <Text className="text-3xl font-bold text-center mt-3">
            Target reached!
          </Text>
          <Text className="text-gray-500 text-center mt-3 text-lg">
            You saved{" "}
            <Text className="font-bold text-gray-700">{targetName}</Text>
            {amount ? ` — ${amount}` : ""}. That is a real win.
          </Text>

          <View className="flex-row items-center gap-2 mt-5 rounded-2xl bg-amber-50 border-2 border-amber-200 px-4 py-3">
            <Ionicons name="medal-outline" size={22} color="#d97706" />
            <Text className="text-amber-800 font-semibold flex-1">
              Goal collector — keep the streak going.
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            className="w-full bg-amber-500 rounded-3xl py-4 mt-6 items-center"
          >
            <Text className="text-white font-bold text-xl">Celebrate</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}
