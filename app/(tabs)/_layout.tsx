import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007aff",
        tabBarInactiveTintColor: "#ccc",
        tabBarStyle: {
          paddingBottom: 10,
          paddingTop: 10,
          height: 70,
          overflow: "visible",
          borderTopWidth: 0,
          backgroundColor: "#fff",

          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
          elevation: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ marginTop: focused ? -10 : 0 }}>
              <Ionicons name="home" color={color} size={size} />
            </View>
          ),
          tabBarLabel: ({ focused }) =>
            focused ? (
              <Text className="font-bold text-sm color-blue-500">Home</Text>
            ) : (
              ""
            ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          headerShown: false,
          title: "Records",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ marginTop: focused ? -10 : 0 }}>
              <Ionicons name="book" color={color} size={size} />
            </View>
          ),
          tabBarLabel: ({ focused }) =>
            focused ? (
              <Text className="font-bold text-sm color-blue-500">Records</Text>
            ) : (
              ""
            ),
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          headerShown: false,
          title: "",
          tabBarIcon: ({ color, size, focused }) => (
            <View className="flex items-center">
              <Ionicons
                style={{
                  marginTop: -25,
                  borderRadius: 30,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                  width: 50,
                }}
                name="add-circle"
                color="#007aff"
                size={55}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="targets"
        options={{
          headerShown: false,
          title: "Targets",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ marginTop: focused ? -10 : 0 }}>
              <Ionicons name="trophy" color={color} size={size} />
            </View>
          ),
          tabBarLabel: ({ focused }) =>
            focused ? (
              <Text className="font-bold text-sm color-blue-500">Targets</Text>
            ) : (
              ""
            ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ marginTop: focused ? -10 : 0 }}>
              <Ionicons name="person" color={color} size={size} />
            </View>
          ),
          tabBarLabel: ({ focused }) =>
            focused ? (
              <Text className="font-bold text-sm color-blue-500">Profile</Text>
            ) : (
              ""
            ),
        }}
      />
    </Tabs>
  );
}
