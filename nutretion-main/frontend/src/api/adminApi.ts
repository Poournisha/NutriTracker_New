import api from './axios';

export const adminApi = {
  getUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },

  addFood: async (foodData: any) => {
    const res = await api.post('/admin/foods', foodData);
    return res.data;
  },

  updateFood: async (id: number, foodData: any) => {
    const res = await api.put(`/admin/foods/${id}`, foodData);
    return res.data;
  },

  deleteFood: async (id: number) => {
    const res = await api.delete(`/admin/foods/${id}`);
    return res.data;
  },

  getModelStatus: async () => {
    const res = await api.get('/system/model-status');
    return res.data;
  }
};
