import { View, Text, TouchableOpacity, Alert } from "react-native";
import AppHeader from "../../components/AppHeader";

export default function Home() {

  return (
    <>
      <View style={{ marginTop: 35, flex: 1 }}>
        <AppHeader />

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >

          <Text style={{ fontSize: 22, marginBottom: 20 }}>
            Home Screen
          </Text>

        </View>
      </View>
    </>
  );
}