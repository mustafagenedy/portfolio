import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

/**
 * Auth store — persisted to localStorage. Holds the user object and both
 * tokens. Writes `accessToken` / `refreshToken` / `user` to localStorage so
 * the axios interceptor in `lib/api.js` can refresh on 401 without re-fetching.
 */
export const useAuth = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      isAuthenticated: () => !!get().accessToken,
      isAdmin: () => get().user?.role === 'admin',

      setSession: ({ user, accessToken, refreshToken }) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, accessToken, refreshToken });
      },

      login: async ({ email, password }) => {
        const { data } = await api.post('/auth/login', { email, password });
        get().setSession(data);
        return data.user;
      },

      register: async ({ name, email, password }) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        get().setSession(data);
        return data.user;
      },

      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        set({ user: null, accessToken: null, refreshToken: null });
      },

      refreshUser: async () => {
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.user });
          localStorage.setItem('user', JSON.stringify(data.user));
        } catch {
          get().logout();
        }
      },
    }),
    { name: 'portfolio-auth' }
  )
);
