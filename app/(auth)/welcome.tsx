// import { useState, useEffect, useContext } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Alert,
// } from "react-native";

import { View, Text } from "react-native";

// import * as Google from "expo-auth-session/providers/google";
// import * as WebBrowser from "expo-web-browser";

// import { router } from "expo-router";
// import { AuthContext } from "@/context/AuthContext";
// import { googleLogin } from "@/api/api";

// WebBrowser.maybeCompleteAuthSession();

// export default function Welcome() {
//   const { login } = useContext(AuthContext);

//   // =====================
//   // EMAIL LOGIN STATE
//   // =====================
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   // =====================
//   // GOOGLE LOGIN
//   // =====================
//   const [request, response, promptAsync] =
//     Google.useAuthRequest({
//       webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
//       androidClientId:
//         process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
//     });

//   // GOOGLE RESPONSE
//   useEffect(() => {
//     const handleGoogleLogin = async () => {
//       try {
//         if (response?.type === "success") {
//           const token = response.authentication?.accessToken;

//           if (!token) return;

//           // get user info from google
//           const res = await fetch(
//             "https://www.googleapis.com/userinfo/v2/me",
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );

//           const user = await res.json();

//           // send to backend
//           await googleLogin({
//             email: user.email,
//             name: user.name,
//             picture: user.picture,
//           });

//           router.replace("/(tabs)/home");
//         }
//       } catch (err) {
//         Alert.alert("Google login failed");
//       }
//     };

//     handleGoogleLogin();
//   }, [response]);

//   // =====================
//   // EMAIL LOGIN
//   // =====================
//   const handleLogin = async () => {
//     try {
//       await login(email, password);
//       router.replace("/(tabs)/home");
//     } catch (err: any) {
//       Alert.alert(
//         "Login Failed",
//         err?.response?.data?.message || "Invalid credentials"
//       );
//     }
//   };

//   // =====================
//   // UI
//   // =====================
//   return (
//     <View style={styles.container}>

//       {/* LOGO */}
//       <Image
//         source={require("../../assets/images/logo.png")}
//         style={styles.logo}
//       />

//       <Text style={styles.title}>Welcome to</Text>
//       <Text style={styles.title2}>Expenses Tracker</Text>

//       {/* EMAIL LOGIN */}
//       <View style={styles.card}>
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           placeholderTextColor="#777"
//           value={email}
//           onChangeText={setEmail}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           placeholderTextColor="#777"
//           secureTextEntry
//           value={password}
//           onChangeText={setPassword}
//         />

//         <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
//           <Text style={styles.btnText}>Login</Text>
//         </TouchableOpacity>

//         {/* GOOGLE BUTTON */}
//         <TouchableOpacity
//           style={styles.googleBtn}
//           onPress={() => promptAsync()}
//           disabled={!request}
//         >
//           <Image
//             source={require("../../assets/images/google.png")}
//             style={{ width: 20, height: 20, marginRight: 10 }}
//           />
//           <Text style={{ fontWeight: "600" }}>
//             Sign in with Google
//           </Text>
//         </TouchableOpacity>

//         {/* LINKS */}
//         <TouchableOpacity
//           onPress={() => router.push("/(auth)/forgot")}
//         >
//           <Text style={styles.link}>Forgot Password?</Text>
//         </TouchableOpacity>

//         <View style={{ marginTop: 20 }} >
//           <Text style={{ textAlign: "center", marginTop: 12, color: "#777" }}>
//             Don't have an account?
//           </Text>
//           <TouchableOpacity
//             onPress={() => router.push("/(auth)/register")}
//           >
//             <Text style={styles.link}>Create Account</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// }

// // =====================
// // STYLES
// // =====================
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     justifyContent: "center",
//     padding: 20,
//   },

//   logo: {
//     width: 150,
//     height: 150,
//     alignSelf: "center",
//     marginBottom: 10,
//     resizeMode: "contain",
//   },

//   title: {
//     fontSize: 26,
//     textAlign: "center",
//     fontWeight: "bold",
//   },

//   title2: {
//     fontSize: 26,
//     textAlign: "center",
//     fontWeight: "bold",
//     color: "#6d28d9",
//     marginBottom: 25,
//   },

//   card: {
//     backgroundColor: "#f9fafb",
//     padding: 20,
//     borderRadius: 14,
//   },

//   input: {
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 12,
//   },

//   loginBtn: {
//     backgroundColor: "#6d28d9",
//     padding: 14,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 12,
//   },

//   btnText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },

//   googleBtn: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     padding: 12,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   link: {
//     textAlign: "center",
//     marginTop: 12,
//     color: "#6d28d9",
//     fontWeight: "600",
//   },
// });
export default function Welcome() {
    return (
        <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                Welcome to Expenses Tracker!
            </Text>
        </View>
    )
}
