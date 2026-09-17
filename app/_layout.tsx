import WelcomeModal from "@/components/welcomemodal";
import { SessionProvider, useSession } from "@/lib/sessionContext";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Stack, usePathname } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";

function RootNavigator() {
  const { welcomeVisible, dismissWelcome, name, refreshUser } = useSession();
  const pathname = usePathname();

  // The auth flow writes the session with SecureStore directly, so re-read it
  // whenever navigation settles on a different screen. This is what makes the
  // greeting name and the welcome dialog appear right after login or signup.
  useEffect(() => {
    refreshUser();
  }, [pathname, refreshUser]);

  return (
    <>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="targets" options={{ headerShown: false }} />
        <Stack.Screen name="notification" options={{ headerShown: false }} />
        <Stack.Screen name="transaction" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
      <WelcomeModal
        visible={welcomeVisible}
        name={name}
        onClose={dismissWelcome}
      />
    </>
  );
}

export default function RootLayout() {
  // The icon font must be loaded before any <Ionicons> renders, otherwise every
  // glyph falls back to a "?" placeholder box.
  const [fontsLoaded, fontError] = useFonts({
    ...Ionicons.font,
  });

  if (!fontsLoaded && !fontError) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <SessionProvider>
      <RootNavigator />
    </SessionProvider>
  );
}
