import React from "react";
import { Modal, Text, View } from "react-native";
import CustomButton from "./custombutton";

interface Props {
  heading: string;
  description?: string;
  onClose?: () => void;
  onComfirm?: () => void;
  visible?: boolean;
  loading?: boolean;
}

export default function CustomMadal({
  heading,
  onClose,
  onComfirm,
  visible,
  description,
  loading,
}: Props) {
  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      transparent
      animationType="fade"
    >
      <View className="bg-gray-500/25 flex-1 items-center justify-center">
        <View className="p-3 bg-white rounded-2xl max-w-96 flex gap-2">
          <Text className="text-2xl font-bold text-center">{heading}</Text>

          <Text className="text-lg font-semibold text-gray-500">
            {description}
          </Text>

          <View className="flex-row items-center gap-2">
            <CustomButton
              name="Cancel"
              color="white"
              bgColor="gray"
              onPress={onClose}
            />
            <CustomButton
              name="Delete"
              color="white"
              bgColor="red"
              onPress={onComfirm}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
