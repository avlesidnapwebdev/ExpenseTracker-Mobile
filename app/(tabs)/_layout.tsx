import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Platform } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        // ACTIVE / INACTIVE COLORS
        tabBarActiveTintColor: "#7C3AED",
        tabBarInactiveTintColor: "#9CA3AF",

        // TAB BAR STYLE
        tabBarStyle: {
          position: "absolute",
          bottom: 14,
          left: 12,
          right: 12,
          height: 100,
          backgroundColor: "#ffffff",

          // Shadow (iOS)
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 5 },

          // Shadow (Android)
          elevation: 8,

          borderTopWidth: 0,
        },

        // LABEL STYLE
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",

          marginBottom: Platform.OS === "ios" ? 0 : 6,
        },

        // ICON STYLE
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      {/* DASHBOARD */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Feather name="grid" size={size} color={color} />
          ),
        }}
      />

      {/* INCOME */}
      <Tabs.Screen
        name="income"
        options={{
          title: "Income",
          tabBarIcon: ({ color, size }) => (
            <Feather name="trending-up" size={size} color={color} />
          ),
        }}
      />

      {/* EXPENSE */}
      <Tabs.Screen
        name="expenses"
        options={{
          title: "Expense",
          tabBarIcon: ({ color, size }) => (
            <Feather name="credit-card" size={size} color={color} />
          ),
        }}
      />

      {/* SETTINGS */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}