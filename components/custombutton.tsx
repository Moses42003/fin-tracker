import { Text, TouchableOpacity } from "react-native";

interface Props {
  name: string | "Button";
  onPress?: () => void;
  color?: string;
  bgColor?: string;
}

export default function CustomButton({ name, onPress, color, bgColor }: Props) {
  return (
    <TouchableOpacity
      className="flex py-4 rounded-2xl my-3"
      activeOpacity={0.7}
      style={{
        shadowColor: "gray",
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 2,
        shadowOpacity: 0.4,
        backgroundColor: bgColor ? bgColor : "white",
      }}
    >
      <Text className="font-bold text-xl text-center" style={{ color: color }}>
        {name}
      </Text>
    </TouchableOpacity>
  );
}
