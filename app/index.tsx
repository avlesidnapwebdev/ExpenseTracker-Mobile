import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { router } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    if (loading) return;

    if (user) {
      router.replace("/(tabs)/home");
    } else {
      router.replace("/(auth)/login");
    }
  }, [user, loading]);

  return (
    <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}