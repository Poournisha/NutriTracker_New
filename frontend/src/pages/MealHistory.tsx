import React, { useEffect, useState } from 'react';
import { mealApi } from '../api/mealApi';
import { Meal } from '../types/meal';
import { MealCard } from '../components/MealCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Calendar, Filter } from 'lucide-react';

export const MealHistory: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMeals();
  }, [filter]);

  const fetchMeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await mealApi.getMeals(filter);
      if (res.success) {
        setMeals(res.data.meals || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load meal history.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeal = async (id: number) => {
    try {
      const res = await mealApi.deleteMeal(id);
      if (res.success) {
        setMeals((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete meal.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Logged Meal History</h1>
          <p className="text-xs text-gray-500 mt-1">Review past meals and detailed nutritional breakdowns.</p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1.5 shadow-sm text-xs font-medium">
          <Filter className="w-4 h-4 text-gray-400 ml-1" />
          {['all', 'today', 'week', 'month'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg capitalize transition ${
                filter === f ? 'bg-emerald-600 text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchMeals} />}

      {loading ? (
        <LoadingSpinner label="Loading your meal log..." />
      ) : meals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} onDelete={handleDeleteMeal} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center text-xs text-gray-500 space-y-2">
          <Calendar className="w-8 h-8 text-gray-300 mx-auto" />
          <p className="font-semibold text-gray-700">No meals logged for this filter period.</p>
          <p>Scan a meal photo using the Analyze Food page to start tracking.</p>
        </div>
      )}
    </div>
  );
};
