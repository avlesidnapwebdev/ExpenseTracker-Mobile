import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";

import API from "../../api/api";
import { router } from "expo-router";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
          placeholderTextColor="#777"
          value={name}
          onChangeText={setName}
        />

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

        <TouchableOpacity style={styles.signupBtn} onPress={handleRegister}>
          <Text style={styles.btnText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
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