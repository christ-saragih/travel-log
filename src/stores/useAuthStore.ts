import { create } from "zustand";
import type { ApiError, User } from "@/types/auth.types";
import { authService } from "@/services/auth.service";
import type { LoginSchema, RegisterSchema } from "@/schemas/auth.schema";
import { AxiosError } from "axios";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  register: (data: RegisterSchema) => Promise<void>;
  login: (data: LoginSchema) => Promise<void>;
  logout: () => void;

  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);

      set({
        user: response.user,
        token: response.jwt,
        isLoading: false,
      });

      localStorage.setItem("token", response.jwt);
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const errorMessage =
        error.response?.data?.error?.message || "Registrasi gagal, coba lagi.";

      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  login: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(data);

      set({
        user: response.user,
        token: response.jwt,
        isLoading: false,
      });

      localStorage.setItem("token", response.jwt);
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const errorMessage =
        error.response?.data?.error?.message ||
        "Login gagal, periksa koneksi Anda.";

      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  hydrate: () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ token, user });
      } catch (e) {
        console.log("Error: ", e);
        localStorage.clear();
      }
    }
  },
}));
