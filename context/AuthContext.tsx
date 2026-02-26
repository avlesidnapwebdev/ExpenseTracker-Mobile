import { createContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import API from "../api/api";

type User = {
  _id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  currency?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD USER ON APP START
  ========================= */
  const loadUser = async () => {
    const token = await SecureStore.getItemAsync("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await API.get("/auth/me");

      // backend safe handling
      setUser(res.data.user || res.data);
    } catch {
      await SecureStore.deleteItemAsync("token");
      setUser(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  /* =========================
     LOGIN
  ========================= */
  const login = async (email: string, password: string) => {
    const res = await API.post("/auth/login", { email, password });

    await SecureStore.setItemAsync("token", res.data.token);

    setUser(res.data.user || res.data);
  };

  /* =========================
     LOGOUT
  ========================= */
  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    setUser(null);
  };

  /* =========================
     REFRESH USER (VERY USEFUL)
  ========================= */
  const refreshUser = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data.user || res.data);
    } catch {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        setUser,     // ⭐ FIXED
        refreshUser, // ⭐ BONUS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};