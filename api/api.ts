import axios, { InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

// =============================
// API INSTANCE
// =============================
const API = axios.create({
  baseURL:
    process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://192.168.0.2:8082/api",
  timeout: 20000,
});

// =============================
// TOKEN INTERCEPTOR
// =============================
API.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // DO NOT force multipart
    if (!(config.data instanceof FormData) && config.headers) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =============================
// TYPES
// =============================
type LoginData = {
  email: string;
  password: string;
};

type RegisterData = FormData;

type ResetPasswordData = {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
};

// =============================
// AUTH
// =============================
export const register = (data: RegisterData) =>
  API.post("/auth/register", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const verifyEmail = (token: string) =>
  API.get(`/auth/verify/${token}`);

export const login = (data: LoginData) =>
  API.post("/auth/login", data);

export const getProfile = () => API.get("/auth/me");

export const updateProfile = (data: FormData | object) =>
  API.put("/auth/profile", data);

export const resendVerify = (email: string) =>
  API.post("/auth/resend-verify", { email });

// =============================
// FORGOT PASSWORD
// =============================
export const sendOtp = (email: string) =>
  API.post("/auth/forgot", { email });

export const resetPassword = (data: ResetPasswordData) =>
  API.post("/auth/reset", data);

// =============================
// GOOGLE LOGIN
// =============================
export const googleLogin = (data: {
  email: string;
  name: string;
  picture?: string;
}) => API.post("/auth/google", data);

// =============================
// EXPENSES
// =============================
export const addExpense = (data: object) =>
  API.post("/expenses", data);

export const getExpenses = (params?: object) =>
  API.get("/expenses", { params });

export const updateExpense = (id: string, data: object) =>
  API.put(`/expenses/${id}`, data);

export const deleteExpense = (id: string) =>
  API.delete(`/expenses/${id}`);

export const getExpensesByCategory = () =>
  API.get("/reports/expenses-by-category");

// =============================
// INCOMES
// =============================
export const addIncome = (data: object) =>
  API.post("/incomes", data);

export const getIncomes = (params?: object) =>
  API.get("/incomes", { params });

export const updateIncome = (id: string, data: object) =>
  API.put(`/incomes/${id}`, data);

export const deleteIncome = (id: string) =>
  API.delete(`/incomes/${id}`);

export const getIncomesByCategory = () =>
  API.get("/reports/incomes-by-category");

// =============================
// REPORTS
// =============================
export const getDashboard = () =>
  API.get("/reports/summary");

export const getExpensesTimeline = () =>
  API.get("/reports/timeline");

export default API;