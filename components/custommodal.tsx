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
      <View className="bg-gray-900/50 flex-1 items-center justify-center px-6">
        <View className="w-full rounded-2xl bg-white p-5 gap-2">
          <Text className="text-2xl font-bold text-center">{heading}</Text>

          {description ? (
            <Text className="text-lg font-semibold text-gray-500 text-center">
              {description}
            </Text>
          ) : null}

          <View className="flex-row items-center gap-3 mt-2">
            <CustomButton
              name={cancelLabel}
              color="white"
              bgColor="#64748b"
              width="auto"
              className="flex-1"
              onPress={onClose}
              disabled={loading}
            />
            <CustomButton
              name={confirmLabel}
              color="white"
              bgColor={confirmColor}
              width="auto"
              className="flex-1"
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
