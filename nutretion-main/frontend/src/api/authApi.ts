import api from './axios';
import { LoginPayload, RegisterPayload } from '../types/auth';

const isDemoFallbackNeeded = (error?: any) => {
  if (!error) return true;
  const status = error?.response?.status;
  const code = error?.code;
  return status === 404 || status === 500 || !error.response || code === 'ERR_NETWORK';
};

const buildDemoUser = (payload: Partial<RegisterPayload & LoginPayload> = {}) => ({
  id: 1,
  name: payload.name || 'Demo User',
  email: payload.email || 'demo@nutrimeasure.local',
  role: 'USER',
  age: 22,
  gender: 'male',
  height: 170,
  weight: 65,
  activity_level: 'Moderately Active',
  workout_type: 'Gym',
  fitness_goal: 'Weight Maintenance',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

const buildDemoAuthResponse = (payload: Partial<RegisterPayload & LoginPayload> = {}) => ({
  success: true,
  data: {
    token: 'demo-token-local',
    user: buildDemoUser(payload),
  },
  message: 'Demo mode active. Backend unavailable; using local fallback.',
});

export const authApi = {
  login: async (payload: LoginPayload) => {
    try {
      const res = await api.post('/auth/login', payload);
      return res.data;
    } catch (error) {
      if (isDemoFallbackNeeded(error)) {
        return buildDemoAuthResponse(payload);
      }
      throw error;
    }
  },

  register: async (payload: RegisterPayload) => {
    try {
      const res = await api.post('/auth/register', payload);
      return res.data;
    } catch (error) {
      if (isDemoFallbackNeeded(error)) {
        return buildDemoAuthResponse(payload);
      }
      throw error;
    }
  },

  getMe: async () => {
    try {
      const res = await api.get('/auth/me');
      return res.data;
    } catch (error) {
      if (isDemoFallbackNeeded(error)) {
        const savedUser = localStorage.getItem('nutrimeasure_user');
        const savedToken = localStorage.getItem('nutrimeasure_token');

        if (savedUser && savedToken) {
          return {
            success: true,
            data: { user: JSON.parse(savedUser) },
            message: 'Demo mode active',
          };
        }

        return {
          success: false,
          error: { code: 'NO_SESSION', message: 'No active session.' },
        };
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      const res = await api.post('/auth/logout');
      return res.data;
    } catch (error) {
      if (isDemoFallbackNeeded(error)) {
        return { success: true, message: 'Demo logout successful' };
      }
      throw error;
    }
  }
};
