import React from "react";
import { Modal, View, Text, TouchableOpacity, Platform } from "react-native";
// import { BlurView } from "expo-blur";

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      {/* Overlay */}
      {/* {Platform.OS !== "web" ? (
        <BlurView intensity={20} className="absolute inset-0">
          <View className="absolute inset-0 bg-black/50" />
        </BlurView>
      ) : (
    )} */}
    <View className="absolute inset-0 bg-black/50" />

      {/* Modal Container */}
      <View className={`flex-1 items-center justify-center ${Platform.OS === "web" ? "px-4" : "px-6"} `}>
        <View className="w-full max-w-md rounded-xl bg-white p-5">
          <Text className="text-xl font-semibold text-black">
            {title}
          </Text>

          <Text className="mt-2 text-md text-neutral-700">
            {message}
          </Text>

          <View className="mt-6 flex-row justify-end gap-6">
            <TouchableOpacity onPress={onCancel}>
              <Text className="text-md text-neutral-600">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onConfirm}>
              <Text className="text-md font-semibold text-red-600">
                Yes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
