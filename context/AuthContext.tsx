// import { createContext, useEffect, useState } from "react";
// import * as SecureStore from "expo-secure-store";
// import API from "../api/api";

// export const AuthContext = createContext<any>(null);

// type Props ={
//     children: React.ReactNode;
// }
// export const AuthProvider = ({ children }: Props) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const loadUser = async () => {
//     const token = await SecureStore.getItemAsync("token");

//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await API.get("/auth/me");
//       setUser(res.data);
//     } catch {
//       await SecureStore.deleteItemAsync("token");
//       setUser(null);
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     loadUser();
//   }, []);

//   const login = async (email: string, password: string) => {
//     const res = await API.post("/auth/login", { email, password });
//     await SecureStore.setItemAsync("token", res.data.token);
//     setUser(res.data.user);
//   };

//   const logout = async () => {
//     await SecureStore.deleteItemAsync("token");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useEffect, useState } from "react";
import { auth } from "@/config/firebase";
import {
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return unsub;
  }, []);

  const firebaseGoogleLogin = async (idToken: string) => {
    const credential = GoogleAuthProvider.credential(idToken);
    const res = await signInWithCredential(auth, credential);
    setUser(res.user);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, firebaseGoogleLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};