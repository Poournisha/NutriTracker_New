import React, { useEffect, useState } from 'react';
import { adminApi } from '../api/adminApi';
import { mealApi } from '../api/mealApi';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Shield, Plus, Users, Cpu, Trash2, Edit3, CheckCircle } from 'lucide-react';

export const Admin: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [foods, setFoods] = useState<any[]>([]);
  const [modelStatus, setModelStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Food Form
  const [newFood, setNewFood] = useState({
    food_name: '',
    category: 'Main',
    calories_per_100g: 150,
    protein_per_100g: 5.0,
    carbs_per_100g: 25.0,
    fat_per_100g: 3.0,
    iron_per_100g: 1.0,
    calcium_per_100g: 20.0
  });

  const [addingFood, setAddingFood] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, foodsRes, statusRes] = await Promise.all([
        adminApi.getUsers(),
        mealApi.getFoodsList(),
        adminApi.getModelStatus()
      ]);

      if (usersRes.success) setUsers(usersRes.data.users || []);
      if (foodsRes.success) setFoods(foodsRes.data.foods || []);
      if (statusRes.success) setModelStatus(statusRes.data || {});
    } catch (err: any) {
      setError(err.message || 'Failed to load admin management data.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFood.food_name.trim()) return;

    setAddingFood(true);
    setError(null);
    try {
      const res = await adminApi.addFood(newFood);
      if (res.success) {
        setFoods((prev) => [...prev, res.data.food]);
        setNewFood({
          food_name: '',
          category: 'Main',
          calories_per_100g: 150,
          protein_per_100g: 5.0,
          carbs_per_100g: 25.0,
          fat_per_100g: 3.0,
          iron_per_100g: 1.0,
          calcium_per_100g: 20.0
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to add food item.');
    } finally {
      setAddingFood(false);
    }
  };

  const handleDeleteFood = async (id: number) => {
    try {
      const res = await adminApi.deleteFood(id);
      if (res.success) {
        setFoods((prev) => prev.filter((f) => f.id !== id));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete food item.');
    }
  };

  if (loading) return <LoadingSpinner label="Loading admin management portal..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-purple-100 text-purple-800 rounded-2xl">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Admin System & Food Portal</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage reference food database, view registered accounts, and inspect ML model status.</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchAdminData} />}

      {/* System Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-purple-600" />
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase">YOLOv8 Status</span>
              <h4 className="text-base font-extrabold uppercase text-gray-900">{modelStatus?.yolov8 || 'Demo'}</h4>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-purple-600" />
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase">EfficientNetB0 Status</span>
              <h4 className="text-base font-extrabold uppercase text-gray-900">{modelStatus?.efficientnet || 'Demo'}</h4>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-emerald-600" />
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase">Registered Users</span>
              <h4 className="text-base font-extrabold text-gray-900">{users.length} accounts</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Food Form */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-bold text-sm text-gray-800 border-b pb-3 mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-600" /> Add New Food to Reference Database
        </h3>

        <form onSubmit={handleAddFood} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Food Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Paneer Butter Masala"
              value={newFood.food_name}
              onChange={(e) => setNewFood({ ...newFood, food_name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Category</label>
            <input
              type="text"
              required
              placeholder="Main / Curry / Snack"
              value={newFood.category}
              onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Calories / 100g</label>
            <input
              type="number"
              required
              value={newFood.calories_per_100g}
              onChange={(e) => setNewFood({ ...newFood, calories_per_100g: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Protein / 100g (g)</label>
            <input
              type="number"
              required
              value={newFood.protein_per_100g}
              onChange={(e) => setNewFood({ ...newFood, protein_per_100g: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="sm:col-span-4 flex justify-end">
            <button
              type="submit"
              disabled={addingFood}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl transition disabled:opacity-50"
            >
              {addingFood ? 'Adding Food...' : 'Add Food Item'}
            </button>
          </div>
        </form>
      </div>

      {/* Foods Table */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm overflow-x-auto">
        <h3 className="font-bold text-sm text-gray-800 mb-4">Reference Food Database ({foods.length} items)</h3>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
              <th className="py-2.5 px-3">Name</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Cal/100g</th>
              <th className="py-2.5 px-3">Protein</th>
              <th className="py-2.5 px-3">Carbs</th>
              <th className="py-2.5 px-3">Fat</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
            {foods.map((food) => (
              <tr key={food.id} className="hover:bg-gray-50">
                <td className="py-2.5 px-3 font-semibold text-gray-900">{food.food_name}</td>
                <td className="py-2.5 px-3">{food.category}</td>
                <td className="py-2.5 px-3">{food.calories_per_100g} kcal</td>
                <td className="py-2.5 px-3 text-emerald-700 font-semibold">{food.protein_per_100g} g</td>
                <td className="py-2.5 px-3">{food.carbs_per_100g} g</td>
                <td className="py-2.5 px-3">{food.fat_per_100g} g</td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    onClick={() => handleDeleteFood(food.id)}
                    className="text-gray-400 hover:text-rose-600 transition p-1"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
