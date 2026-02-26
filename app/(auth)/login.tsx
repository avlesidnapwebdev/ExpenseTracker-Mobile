import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { AuthContext } from "@/context/AuthContext";
import { googleLogin } from "@/api/api";

export default function Login() {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =====================
  // GOOGLE CONFIG
  // =====================
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      offlineAccess: false,
    });
  }, []);

  // =====================
  // GOOGLE LOGIN (FIXED)
  // =====================
  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();

      // ⭐ THIS IS THE FIX
      const user = (userInfo as any).data?.user || (userInfo as any).user;

      console.log("GOOGLE USER:", user);

      if (!user?.email) {
        Alert.alert("Google login failed", "No email received");
        return;
      }

      const backendRes = await googleLogin({
        email: user.email,
        name: user.name || "",
        picture: user.photo || "",
      });

      await SecureStore.setItemAsync(
        "token",
        backendRes.data.token
      );

      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.log("GOOGLE ERROR:", error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) return;
      if (error.code === statusCodes.IN_PROGRESS) return;

      Alert.alert("Google login failed");
    }
  };

  // =====================
  // EMAIL LOGIN (UNCHANGED)
  // =====================
  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace("/(tabs)/home");
    } catch (err: any) {
      Alert.alert(
        "Login Failed",
        err?.response?.data?.message || "Invalid credentials"
      );
    }
  };

  // =====================
  // UI (UNCHANGED)
  // =====================
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Welcome to</Text>
      <Text style={styles.title2}>Expenses Tracker</Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#777"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.googleBtn}
          onPress={handleGoogleLogin}
        >
          <Image
            source={require("../../assets/images/google.png")}
            style={{ width: 20, height: 20, marginRight: 10 }}
          />
          <Text style={{ fontWeight: "600" }}>
            Sign in with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/forgot")}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>

        <View>
          <Text style={{ textAlign: "center", marginTop: 12, color: "#777" }}>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.link}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// =====================
// STYLES (UNCHANGED)
// =====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20,
  },

  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 10,
    resizeMode: "contain",
  },

  title: {
    fontSize: 26,
    textAlign: "center",
    fontWeight: "bold",
  },

  title2: {
    fontSize: 26,
    textAlign: "center",
    fontWeight: "bold",
    color: "#6d28d9",
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#f9fafb",
    padding: 20,
    borderRadius: 14,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },

  loginBtn: {
    backgroundColor: "#6d28d9",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  googleBtn: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  link: {
    textAlign: "center",
    marginTop: 12,
    color: "#6d28d9",
    fontWeight: "600",
  },
});