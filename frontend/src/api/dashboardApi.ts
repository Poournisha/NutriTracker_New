import api from './axios';

export const dashboardApi = {
  getDashboardData: async () => {
    const res = await api.get('/dashboard');
    return res.data;
  },

  getRecommendations: async () => {
    const res = await api.get('/recommendations');
    return res.data;
  }
};
