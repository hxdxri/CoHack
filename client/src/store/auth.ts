import { create } from 'zustand';
import { User, LoginRequest, RegisterRequest } from '@/types';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('harvestlink_token'),
  isLoading: false,
  isAuthenticated: false,

  login: async (data: LoginRequest) => {
    try {
      set({ isLoading: true });
      const response = await authAPI.login(data);
      const { user, token } = response.data;

      localStorage.setItem('harvestlink_token', token);
      localStorage.setItem('harvestlink_user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      toast.success(`Welcome back, ${user.name}!`);
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      throw error;
    }
  },

  register: async (data: RegisterRequest) => {
    try {
      set({ isLoading: true });
      const response = await authAPI.register(data);
      const { user, token } = response.data;

      localStorage.setItem('harvestlink_token', token);
      localStorage.setItem('harvestlink_user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      toast.success(`Welcome to HarvestLink, ${user.name}!`);
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('harvestlink_token');
    localStorage.removeItem('harvestlink_user');
    
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });

    toast.success('Logged out successfully');
  },

  checkAuth: async () => {
    const token = localStorage.getItem('harvestlink_token');
    const storedUser = localStorage.getItem('harvestlink_user');

    if (!token) {
      set({ isAuthenticated: false, user: null, token: null });
      return;
    }

    try {
      // Try to get current user from API to verify token
      const response = await authAPI.getCurrentUser();
      const { user } = response.data;

      set({
        user,
        token,
        isAuthenticated: true,
      });
    } catch (error) {
      // Token is invalid, clear storage
      localStorage.removeItem('harvestlink_token');
      localStorage.removeItem('harvestlink_user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },

  setUser: (user: User) => {
    localStorage.setItem('harvestlink_user', JSON.stringify(user));
    set({ user });
  },
}));
