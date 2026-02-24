import Colors from "@/services/Colors";
import { useNavigation } from "@react-navigation/native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


export default function Index() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  WebBrowser.maybeCompleteAuthSession();

  const [request, response, promptAsync] =
    Google.useAuthRequest({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    });

  useEffect(() => {
    if (response?.type === "success") {
      console.log("LOGIN SUCCESS");
      console.log(response.authentication);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Image
        style={styles.imagestyle}
        source={require("../assets/images/logo.png")}
      />

      <Text style={styles.headeing}>Welcome to</Text>
      <Text style={styles.headeing}>Expenses Tracker</Text>

      <View style={styles.CONTAINER2}>
        <Text
          style={{
            fontSize: 18,
            color: Colors.black,
            textAlign: "center",
          }}
        >
          Track your expenses and manage your budget with ease.
        </Text>

        {/* GOOGLE LOGIN BUTTON */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
          onPress={() => promptAsync()}
          disabled={!request}
        >
          <Image
            source={require("../assets/images/google.png")}
            style={{ width: 20, height: 20, marginRight: 10 }}
          />
          <Text style={styles.google}>
            Sign In With Google
          </Text>
        </TouchableOpacity>

        {/* SKIP BUTTON */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: Colors.logo,
              borderColor: Colors.logo,
            },
          ]}
        >
          <Text
            style={[styles.google, { color: Colors.white }]}
          >
            Skip
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    height: "100%",
  },
  imagestyle: {
    width: "100%",
    height: 300,
    marginTop: 120,
    marginBottom: 25,
  },
  headeing: {
    fontSize: 30,
    fontFamily: "monstreater-bold",
    fontWeight: "bold",
    color: Colors.logo,
    textAlign: "center",
  },
  CONTAINER2: {
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    margin: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 30,
  },
  button: {
    borderWidth: 1,
    borderColor: Colors.logo,
    padding: 10,
    borderRadius: 100,
    marginTop: 20,
  },
  google: {
    fontSize: 15,
    textAlign: "center",
  },
});