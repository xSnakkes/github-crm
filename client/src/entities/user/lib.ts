import { create } from "zustand";
import { authApi, ISignUpData } from "shared/api";
import { IUser } from "./model";

interface AuthState {
  user: IUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: ISignUpData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isInitialized: false,

  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      const user = await authApi.getAuthUser();

      if (user) {
        const convertedUser: IUser = {
          ...user,
          firstName: user.first_name,
          lastName: user.last_name,
        };
        set({
          user: convertedUser,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
        });
      }
    } catch (error) {
      console.log("Error during initialization:", error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const user = await authApi.signIn({ email, password });
      const convertedUser: IUser = {
        ...user,
        firstName: user.first_name,
        lastName: user.last_name,
      };
      set({
        user: convertedUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message ?? "Failed to login",
        isLoading: false,
      });
    }
  },

  signup: async (userData: ISignUpData) => {
    try {
      set({ isLoading: true, error: null });
      const user = await authApi.signUp(userData);
      const convertedUser: IUser = {
        ...user,
        firstName: user.first_name,
        lastName: user.last_name,
      };
      set({
        user: convertedUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message ?? "Failed to sign up",
        isLoading: false,
      });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      await authApi.signOut();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message ?? "Failed to logout",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
