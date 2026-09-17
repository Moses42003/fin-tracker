import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface Props {
  name: string | "Button";
  onPress?: () => void;
  color?: string;
  bgColor?: string;
  icon?: "arrow-forward" | string;
  disabled?: boolean;
  loading?: boolean;
  /**
   * How the button sizes itself. "full" fills its row (default). "auto" lets it
   * share a row with other buttons rather than forcing 100% width, which is
   * what makes two side-by-side buttons overlap.
   */
  width?: "full" | "auto";
  /** Extra classes, e.g. "flex-1" when placed in a row. */
  className?: string;
}

export default function CustomButton({
  name,
  onPress,
  color,
  bgColor,
  icon,
  disabled,
  loading = false,
  width = "full",
  className = "",
}: Props) {
  return (
    <TouchableOpacity
      className={`${
        width === "full" ? "w-full" : ""
      } py-5 rounded-3xl my-3 flex-row items-center gap-2 justify-center ${className}`}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      style={{
        shadowColor: bgColor !== "white" ? bgColor : "gray",
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 2,
        shadowOpacity: 0.4,
        backgroundColor: bgColor ? bgColor : "white",
      }}
    >
      {loading ? <ActivityIndicator color={color} /> : null}
      <Text className="font-bold text-xl text-center" style={{ color: color }}>
        {name}
      </Text>
      {icon && !loading ? (
        // @ts-ignore Ionicons accepts the runtime icon names passed by callers.
        <Ionicons name={icon} size={20} color={color} />
      ) : null}
    </TouchableOpacity>
  );
}
