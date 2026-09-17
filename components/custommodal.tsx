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
  /** Label for the confirming button (default "Delete"). */
  confirmLabel?: string;
  /** Colour of the confirming button (default red). */
  confirmColor?: string;
  /** Label for the dismissing button (default "Cancel"). */
  cancelLabel?: string;
}

export default function CustomMadal({
  heading,
  onClose,
  onComfirm,
  visible,
  description,
  loading,
  confirmLabel = "Delete",
  confirmColor = "red",
  cancelLabel = "Cancel",
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
              name={cancelLabel}
              color="white"
              bgColor="gray"
              onPress={onClose}
              disabled={loading}
            />
            <CustomButton
              name={confirmLabel}
              color="white"
              bgColor={confirmColor}
              onPress={onComfirm}
              loading={loading}
              disabled={loading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
