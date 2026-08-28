import api from './axios';

export const reportApi = {
  getWeeklyReport: async () => {
    const res = await api.get('/reports/weekly');
    return res.data;
  }
};
