import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Animated,
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

  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

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

  // ======================
  // SEND OTP
  // ======================
  const handleSendOtp = async () => {
    if (!email) {
      showPopup("Enter email", "#dc2626");
      return;
    }

    try {
      setLoading(true);
      await sendOtp(email);
      setOtpSent(true);
      showPopup("OTP sent to your email", "#16a34a");
    } catch {
      showPopup("Failed to send OTP", "#dc2626");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // RESET PASSWORD
  // ======================
  const handleResetPassword = async () => {
    if (!otp || !newPass || !confirmPass) {
      showPopup("Fill all fields", "#dc2626");
      return;
    }

    if (newPass !== confirmPass) {
      showPopup("Passwords do not match", "#dc2626");
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        email,
        otp,
        password: newPass,
        confirmPassword: confirmPass,
      });

      showPopup("Password reset successful", "#16a34a");

      setTimeout(() => {
        router.replace("/(auth)/login");
      }, 700);

    } catch (err: any) {
      showPopup(
        err?.response?.data?.message || "Reset failed",
        "#dc2626"
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

  popupText: {
    color: "#fff",
    fontWeight: "700",
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