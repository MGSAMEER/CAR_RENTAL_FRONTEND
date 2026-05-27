import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from './types';
import { authApi } from './services';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  /** Called after Google OAuth to hydrate store + persist tokens */
  setGoogleUser: (user: User, accessToken: string, refreshToken: string) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await authApi.login({ email, password });
          const { accessToken, refreshToken, user } = res.data.data!;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        const { refreshToken } = get();
        try {
          if (refreshToken) await authApi.logout(refreshToken);
        } finally {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
        }
      },

      setUser: (user) => set({ user }),

      setGoogleUser: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });
      },

      initialize: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        try {
          const res = await authApi.getMe();
          set({ user: res.data.data, isAuthenticated: true });
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

