import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import API from "../../api/api";
import { router } from "expo-router";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 👇 show / hide password
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
        platform: "mobile",
      });

      Alert.alert("Success", "Verify your email before login");
      router.back();
    } catch (err: any) {
      Alert.alert(
        "Register Failed",
        err?.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* LOGO */}
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />

          <Text style={styles.title}>Create Account</Text>

          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#000"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#000"
              value={email}
              onChangeText={setEmail}
            />

            {/* PASSWORD WITH EYE ICON */}
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

            <TouchableOpacity
              style={styles.signupBtn}
              onPress={handleRegister}
            >
              <Text style={styles.btnText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.link}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// =====================
// STYLES
// =====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20,
  },

  logo: {
    width: 130,
    height: 130,
    alignSelf: "center",
    resizeMode: "contain",
    marginBottom: 10,
  },

  title: {
    fontSize: 26,
    textAlign: "center",
    fontWeight: "bold",
    color: "#6d28d9",
    marginBottom: 20,
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
    color: "#000",
  },

  // 👇 PASSWORD STYLE
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

  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    color: "#000",
  },

  signupBtn: {
    backgroundColor: "#6d28d9",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  link: {
    textAlign: "center",
    marginTop: 14,
    color: "#6d28d9",
    fontWeight: "600",
  },
});