"use client";
import { create } from "zustand";
import apiClient from "@/lib/api-client";
import type { LoginRequest, LoginResponse } from "@/lib/auth-types";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  initialize: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  initialize: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        set({ token, isAuthenticated: true });
      }
    }
  },

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await apiClient.post<LoginResponse>(
        "/api/login",
        credentials
      );
      const token = data.access_token;
      localStorage.setItem("access_token", token);
      set({ token, isAuthenticated: true, isLoading: false });
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { detail?: string } }; message?: string };
      const message =
        axiosError.response?.data?.detail || axiosError.message || "Login failed";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    set({ token: null, isAuthenticated: false });
    window.location.href = "/login";
  },
}));

export default useAuthStore;
