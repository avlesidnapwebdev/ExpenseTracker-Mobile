import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

export default function Home() {

  const handleLogout = async () => {
    try {
      // remove token
      await SecureStore.deleteItemAsync("token");

      // go back to auth screen
      router.replace("/(auth)/login");

    } catch (error) {
      Alert.alert("Error", "Logout failed");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 22, marginBottom: 20 }}>
        Home Screen
      </Text>

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: "#e11d48",
          paddingHorizontal: 30,
          paddingVertical: 12,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}