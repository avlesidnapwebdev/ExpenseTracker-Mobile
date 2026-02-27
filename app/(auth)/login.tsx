import { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { AuthContext } from "@/context/AuthContext";
import { googleLogin } from "@/api/api";

export default function Login() {
  const { login } = useContext(AuthContext)!;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* ---------- BEAUTIFUL POPUP ---------- */
  const [popupMsg, setPopupMsg] = useState("");
  const [popupColor, setPopupColor] = useState("#16a34a");
  const popupAnim = useRef(new Animated.Value(0)).current;

  const showPopup = (msg: string, color: string) => {
    setPopupMsg(msg);
    setPopupColor(color);

    Animated.sequence([
      Animated.timing(popupAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.delay(1800),
      Animated.timing(popupAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };
  /* ------------------------------------ */

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
      offlineAccess: false,
      forceCodeForRefreshToken: false,
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();

      const user =
        (userInfo as any).data?.user ||
        (userInfo as any).user;

      if (!user?.email) {
        showPopup("Google login failed", "#dc2626");
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

      showPopup("Login successful", "#16a34a");

      setTimeout(() => {
        router.replace("/(tabs)/home");
      }, 700);

    } catch (error: any) {
      console.log("GOOGLE ERROR:", error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) return;
      if (error.code === statusCodes.IN_PROGRESS) return;

      showPopup("Google login failed", "#dc2626");
    }
  };

  const handleLogin = async () => {
    try {
      await login(email, password);

      showPopup("Login successful", "#16a34a");

      setTimeout(() => {
        router.replace("/(tabs)/home");
      }, 700);

    } catch (err: any) {
      showPopup(
        err?.response?.data?.message || "Invalid credentials",
        "#dc2626"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* POPUP */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.popup,
          {
            backgroundColor: popupColor,
            opacity: popupAnim,
            transform: [
              {
                scale: popupAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.popupText}>{popupMsg}</Text>
      </Animated.View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              placeholderTextColor="#000"
              value={email}
              onChangeText={setEmail}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#000"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#6d28d9"
                />
              </TouchableOpacity>
            </View>

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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center", padding: 20 },

  popup: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    zIndex: 9999,
    elevation: 50,
  },

  popupText: { color: "#fff", fontWeight: "700" },

  logo: { width: 150, height: 150, alignSelf: "center", marginBottom: 10, resizeMode: "contain" },

  title: { fontSize: 26, textAlign: "center", fontWeight: "bold" },
  title2: { fontSize: 26, textAlign: "center", fontWeight: "bold", color: "#6d28d9", marginBottom: 25 },

  card: { backgroundColor: "#f9fafb", padding: 20, borderRadius: 14 },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    color: "#000",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  passwordInput: { flex: 1, paddingVertical: 12, color: "#000" },

  loginBtn: { backgroundColor: "#6d28d9", padding: 14, borderRadius: 10, alignItems: "center", marginBottom: 12 },
  btnText: { color: "#fff", fontWeight: "bold" },

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

  link: { textAlign: "center", marginTop: 12, color: "#6d28d9", fontWeight: "600" },
});