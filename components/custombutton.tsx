import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";

interface Props {
  name: string | "Button";
  onPress?: () => void;
  color?: string;
  bgColor?: string;
  icon?: "arrow-forward" | string;
}

export default function CustomButton({
  name,
  onPress,
  color,
  bgColor,
  icon,
}: Props) {
  return (
    <TouchableOpacity
      className="flex py-5 rounded-3xl my-3 w-full flex-row items-center gap-2 justify-center"
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        shadowColor: bgColor !== "white" ? bgColor : "gray",
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 2,
        shadowOpacity: 0.4,
        backgroundColor: bgColor ? bgColor : "white",
      }}
    >
      <Text className="font-bold text-xl text-center" style={{ color: color }}>
        {name}
      </Text>
      <Ionicons name={icon} size={20} color={color} />
    </TouchableOpacity>
  );
}
