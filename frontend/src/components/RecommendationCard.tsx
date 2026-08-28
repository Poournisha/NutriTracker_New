import React from 'react';
import { Utensils, Sparkles } from 'lucide-react';
import { Recommendation } from '../types/nutrition';

interface Props {
  recommendation: Recommendation;
}

export const RecommendationCard: React.FC<Props> = ({ recommendation }) => {
  return (
    <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5">
      <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm mb-2">
        <Sparkles className="w-4 h-4 text-emerald-600" />
        <span>Personalized Suggestion</span>
      </div>
      <p className="text-gray-700 text-xs leading-relaxed mb-4">{recommendation.message}</p>

      <div className="space-y-2">
        <h5 className="text-[11px] uppercase tracking-wider font-bold text-gray-500 flex items-center gap-1.5">
          <Utensils className="w-3.5 h-3.5" /> Recommended Foods from Hostel Menu
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {recommendation.suggested_foods.map((food) => (
            <div key={food.id || food.food_name} className="bg-white rounded-xl p-2.5 border border-emerald-100 flex items-center justify-between text-xs">
              <span className="font-medium text-gray-800">{food.food_name}</span>
              <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md">
                {food.calories_per_100g} kcal / 100g
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
