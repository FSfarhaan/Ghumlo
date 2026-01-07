import { Platform, Modal, View, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { dateToTimeString, timeStringToDate } from "../utils/time";

type TimePickerProps = {
  visible: boolean;
  value: string;
  onClose: () => void;
  onChange: (value: string) => void;
};

export default function TimePicker({
  visible,
  value,
  onClose,
  onChange,
}: TimePickerProps) {
  const dateValue = timeStringToDate(value);

  /* ---------------- WEB ---------------- */
  if (Platform.OS === "web") {
    return (
      <Modal transparent visible={visible} animationType="fade">
        <Pressable
          onPress={onClose}
          className="absolute inset-0 bg-black/50"
        />

        <View className="flex-1 items-center justify-center">
          <View className="bg-white rounded-xl p-4 w-72">
            <input
              type="time"
              autoFocus
              value={dateValue.toISOString().substring(11, 16)}
              onChange={(e) => {
                const [h, m] = e.target.value.split(":").map(Number);
                const d = new Date(dateValue);
                d.setHours(h, m);
                onChange(dateToTimeString(d));
                onClose();
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base"
            />
          </View>
        </View>
      </Modal>
    );
  }

  /* ---------------- MOBILE ---------------- */
  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable
        onPress={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <View className="flex-1 justify-center items-center">
        <View className="bg-white rounded-xl p-4">
          <DateTimePicker
            value={dateValue}
            mode="time"
            is24Hour={false}
            display={Platform.OS === "ios" ? "spinner" : "clock"}
            onChange={(_, date) => {
              if (date) {
                onChange(dateToTimeString(date));
              }
              onClose(); // 🔑 FIXES FLICKER
            }}
          />
        </View>
      </View>
    </Modal>
  );
}
