import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { sendOtp, resetPassword } from "@/api/api";

export default function ForgotScreen() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [loading, setLoading] = useState(false);

  // 👇 NEW STATES (show / hide)
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // ======================
  // SEND OTP
  // ======================
  const handleSendOtp = async () => {
    if (!email) return Alert.alert("Enter email");

    try {
      setLoading(true);
      await sendOtp(email);
      setOtpSent(true);
      Alert.alert("Success", "OTP sent to your email");
    } catch {
      Alert.alert("Error", "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // RESET PASSWORD
  // ======================
  const handleResetPassword = async () => {
    if (!otp || !newPass || !confirmPass) {
      return Alert.alert("Fill all fields");
    }

    if (newPass !== confirmPass) {
      return Alert.alert("Passwords do not match");
    }

    try {
      setLoading(true);

      await resetPassword({
        email,
        otp,
        password: newPass,
        confirmPassword: confirmPass,
      });

      Alert.alert("Success", "Password reset successful", [
        {
          text: "Go Login",
          onPress: () => router.replace("/(auth)/login"),
        },
      ]);
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Forgot Password</Text>

          {/* EMAIL */}
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            editable={!otpSent}
            placeholderTextColor="#000"
          />

          {!otpSent && (
            <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
              <Text style={styles.buttonText}>
                {loading ? "Sending..." : "Send OTP"}
              </Text>
            </TouchableOpacity>
          )}

          {otpSent && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                placeholderTextColor="#000"
              />

              {/* NEW PASSWORD */}
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="New Password"
                  secureTextEntry={!showNewPass}
                  value={newPass}
                  onChangeText={setNewPass}
                  placeholderTextColor="#000"
                />
                <TouchableOpacity
                  onPress={() => setShowNewPass(!showNewPass)}
                >
                  <Ionicons
                    name={showNewPass ? "eye-off" : "eye"}
                    size={22}
                    color="#6d28d9"
                  />
                </TouchableOpacity>
              </View>

              {/* CONFIRM PASSWORD */}
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm Password"
                  secureTextEntry={!showConfirmPass}
                  value={confirmPass}
                  onChangeText={setConfirmPass}
                  placeholderTextColor="#000"
                />
                <TouchableOpacity
                  onPress={() =>
                    setShowConfirmPass(!showConfirmPass)
                  }
                >
                  <Ionicons
                    name={showConfirmPass ? "eye-off" : "eye"}
                    size={22}
                    color="#6d28d9"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleResetPassword}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Resetting..." : "Reset Password"}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.replace("/(auth)/login")}
          >
            <Text style={styles.backText}>← Back to Login</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    color: "#000",
    backgroundColor: "#fff",
  },

  // 👇 PASSWORD FIELD STYLE
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    color: "#000",
  },

  button: {
    backgroundColor: "#6d28d9",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  backBtn: {
    marginTop: 20,
    alignItems: "center",
  },

  backText: {
    color: "#6d28d9",
    fontWeight: "600",
  },
});