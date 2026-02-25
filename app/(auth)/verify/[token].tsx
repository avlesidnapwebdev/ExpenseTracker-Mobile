import { useLocalSearchParams, router } from "expo-router";
import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { verifyEmail } from "@/api/api";

export default function VerifyScreen() {
  const { token } = useLocalSearchParams();

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyEmail(token as string);

        // go login after success
        router.replace("/(auth)/login");
      } catch (err) {
        console.log("Verify failed", err);
      }
    };

    if (token) verify();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 10 }}>Verifying email...</Text>
    </View>
  );
}