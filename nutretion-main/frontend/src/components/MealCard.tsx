import React from 'react';
import { Meal } from '../types/meal';
import { Clock, Calendar, Utensils, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/formatters';

interface Props {
  meal: Meal;
  onDelete?: (id: number) => void;
}

export const MealCard: React.FC<Props> = ({ meal, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">{meal.meal_type}</h4>
            <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-0.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {formatDate(meal.meal_date)}
              </span>
              {meal.meal_time && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {meal.meal_time}
                </span>
              )}
            </div>
          </div>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(meal.id)}
            className="text-gray-400 hover:text-rose-600 transition p-1.5 rounded-lg hover:bg-rose-50"
            title="Delete meal record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="my-3 flex flex-wrap gap-1.5">
        {meal.items.map((item, idx) => (
          <span key={idx} className="bg-gray-100 text-gray-700 text-[11px] font-medium px-2.5 py-1 rounded-lg">
            {item.food_name} ({item.estimated_grams}g)
          </span>
        ))}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-3 border-t border-gray-50 text-[11px] text-center">
        <div>
          <span className="block text-gray-400">Calories</span>
          <span className="font-bold text-gray-800">{meal.total_calories} kcal</span>
        </div>
        <div>
          <span className="block text-gray-400">Protein</span>
          <span className="font-bold text-emerald-700">{meal.total_protein}g</span>
        </div>
        <div>
          <span className="block text-gray-400">Carbs</span>
          <span className="font-bold text-gray-800">{meal.total_carbs}g</span>
        </div>
        <div>
          <span className="block text-gray-400">Fat</span>
          <span className="font-bold text-gray-800">{meal.total_fat}g</span>
        </div>
        <div>
          <span className="block text-gray-400">Iron</span>
          <span className="font-bold text-gray-800">{meal.total_iron}mg</span>
        </div>
        <div>
          <span className="block text-gray-400">Calcium</span>
          <span className="font-bold text-gray-800">{meal.total_calcium}mg</span>
        </div>
      </div>
    </div>
  );
};
