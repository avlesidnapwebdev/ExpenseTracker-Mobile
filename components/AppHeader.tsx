import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { useRouter } from "expo-router";
import { AuthContext } from "../context/AuthContext";

export default function AppHeader() {
  const { user } = useContext(AuthContext)!;
  const router = useRouter();

  const avatar =
    user?.avatar
      ? { uri: user.avatar }
      : require("../assets/images/default-avatar.png");

  return (
    <View style={styles.header}>
      {/* LEFT SIDE */}
      <View style={styles.left}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />

        <View>
          <Text style={styles.appName}>Expense Tracker</Text>
          <Text style={styles.hello}>
            Hello, {user?.name || "User"} 👋
          </Text>
        </View>
      </View>

      {/* PROFILE (OPEN SETTINGS) */}
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/settings")}
        activeOpacity={0.8}
      >
        <Image source={avatar} style={styles.avatar} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 68,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  // ⭐ reduced size
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
  },

  appName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },

  hello: {
    fontSize: 12,
    color: "#666",
    marginTop: 1,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#7C3AED",
  },
});