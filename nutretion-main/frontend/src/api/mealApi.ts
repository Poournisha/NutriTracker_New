import api from './axios';

const isRecoverable = (err: any) => {
  if (!err) return true;
  const status = err?.response?.status;
  return status === 500 || status === 404 || !err.response || err.code === 'ERR_NETWORK';
};

const demoAnalysis = (fileName = '') => {
  const items = [
    {
      food_id: 1,
      food_name: 'Dosa',
      category: 'South Indian',
      confidence: 0.92,
      bbox: [120, 40, 380, 260],
      estimated_grams: 150,
      portion_category: 'Medium',
      calories: 180,
      protein: 4.5,
      carbs: 30,
      fat: 5,
      iron: 1.2,
      calcium: 10,
    },
    {
      food_id: 2,
      food_name: 'Sambar',
      category: 'Curry',
      confidence: 0.87,
      bbox: [400, 60, 520, 200],
      estimated_grams: 120,
      portion_category: 'Small',
      calories: 90,
      protein: 3.5,
      carbs: 14,
      fat: 2.5,
      iron: 1.0,
      calcium: 8,
    },
    {
      food_id: 3,
      food_name: 'Idli',
      category: 'South Indian',
      confidence: 0.81,
      bbox: [60, 220, 180, 320],
      estimated_grams: 80,
      portion_category: 'Small',
      calories: 70,
      protein: 2.1,
      carbs: 14,
      fat: 0.8,
      iron: 0.6,
      calcium: 12,
    },
  ];

  const totals = items.reduce(
    (acc, it) => {
      acc.calories += it.calories;
      acc.protein += it.protein;
      acc.carbs += it.carbs;
      acc.fat += it.fat;
      acc.iron += it.iron;
      acc.calcium += it.calcium;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, iron: 0, calcium: 0 }
  );

  return {
    success: true,
    data: {
      image_path: `/uploads/${fileName || 'demo_food.jpg'}`,
      image_quality: { width: 800, height: 450, brightness: 0.6, blur_metric: 0.02 },
      detected_items: items,
      meal_totals: totals,
      demo_mode: true,
      disclaimer: 'Demo predictions — when backend ML weights are unavailable, approximate values are shown.',
    },
  };
};

export const mealApi = {
  analyzeImage: async (formData: FormData) => {
    try {
      const res = await api.post('/food/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (err: any) {
      if (isRecoverable(err)) {
        const file = (formData as any).get('image');
        const name = file?.name || '';
        return demoAnalysis(name);
      }
      throw err;
    }
  },

  getMeals: async (filter = 'all') => {
    const res = await api.get(`/meals?filter=${filter}`);
    return res.data;
  },

  getMealById: async (id: number) => {
    const res = await api.get(`/meals/${id}`);
    return res.data;
  },

  saveMeal: async (mealData: any) => {
    const res = await api.post('/meals', mealData);
    return res.data;
  },

  deleteMeal: async (id: number) => {
    const res = await api.delete(`/meals/${id}`);
    return res.data;
  },

  getFoodsList: async (search = '') => {
    const res = await api.get(`/food/list?search=${encodeURIComponent(search)}`);
    return res.data;
  }
};
