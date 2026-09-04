import TransactionCard from "@/components/transcard";
import { Link } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text className="text-green-500 font-bold">
        Edit app/index.tsx to edit this screen.
      </Text>
      <Link href="/(tabs)" className="text-blue-500">
        Go to the tabs layout
      </Link>
      <TransactionCard />
    </SafeAreaView>
  );
}
