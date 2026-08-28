import api from './axios';
import { User } from '../types/user';
import { NutritionTargets } from '../types/nutrition';

const demoTargets = (): NutritionTargets => ({
  calorie_target: 2200,
  protein_target: 90,
  carbs_target: 280,
  fat_target: 70,
  iron_target: 18,
  calcium_target: 800,
  calculated_at: new Date().toISOString(),
});

const demoUser = (): User => ({
  id: 1,
  name: 'Demo User',
  email: 'demo@nutrimeasure.local',
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

const isRecoverable = (err: any) => {
  if (!err) return true;
  const status = err?.response?.status;
  return status === 500 || status === 404 || !err.response || err.code === 'ERR_NETWORK';
};

export const profileApi = {
  getProfile: async () => {
    try {
      const res = await api.get('/profile');
      return res.data;
    } catch (err: any) {
      if (isRecoverable(err)) {
        return {
          success: true,
          data: {
            user: demoUser(),
            bmi: { bmi: null, category: 'N/A', disclaimer: '' },
            targets: demoTargets(),
          },
          message: 'Demo data (backend unavailable)'
        };
      }
      throw err;
    }
  },

  updateProfile: async (data: Partial<User>) => {
    try {
      const res = await api.put('/profile', data);
      return res.data;
    } catch (err: any) {
      if (isRecoverable(err)) {
        // Return updated demo user + recalculated demo targets based on provided data
        const user = { ...demoUser(), ...data } as User;
        const targets = demoTargets();
        return {
          success: true,
          data: { user, bmi: { bmi: null, category: 'N/A', disclaimer: '' }, targets },
          message: 'Demo update applied (backend unavailable)'
        };
      }
      throw err;
    }
  }
};
