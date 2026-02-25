import { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { AuthContext } from "@/context/AuthContext";

import { auth } from "@/config/firebase";
import {
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const { login } = useContext(AuthContext);

  // =====================
  // EMAIL LOGIN STATE (UNCHANGED)
  // =====================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =====================
  // FIREBASE GOOGLE LOGIN
  // =====================
  const [request, response, promptAsync] =
    Google.useIdTokenAuthRequest({
      clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      androidClientId:
        process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    });

  const handleGoogleLogin = async () => {
    try {
      const res = await promptAsync();

      if (res.type !== "success") return;

      const idToken = res.authentication?.idToken;

      if (!idToken) {
        Alert.alert("Google login failed");
        return;
      }

      // Firebase login
      const credential =
        GoogleAuthProvider.credential(idToken);

      const userCred = await signInWithCredential(
        auth,
        credential
      );

      // Save Firebase token (optional for backend use)
      const token = await userCred.user.getIdToken();

      await SecureStore.setItemAsync("token", token);

      router.replace("/(tabs)/home");
    } catch (error) {
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
      {/* LOGO */}
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Welcome to</Text>
      <Text style={styles.title2}>Expenses Tracker</Text>

      {/* EMAIL LOGIN */}
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

        {/* GOOGLE BUTTON */}
        <TouchableOpacity
          style={styles.googleBtn}
          onPress={handleGoogleLogin}
          disabled={!request}
        >
          <Image
            source={require("../../assets/images/google.png")}
            style={{ width: 20, height: 20, marginRight: 10 }}
          />
          <Text style={{ fontWeight: "600" }}>
            Sign in with Google
          </Text>
        </TouchableOpacity>

        {/* LINKS */}
        <TouchableOpacity
          onPress={() => router.push("/(auth)/forgot")}
        >
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>

        <View>
          <Text style={{ textAlign: "center", marginTop: 12, color: "#777" }}>
            Don't have an account?
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/register")}
          >
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