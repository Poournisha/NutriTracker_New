import React from 'react';
import { MealItem } from '../types/meal';
import { Trash2 } from 'lucide-react';

interface Props {
  item: MealItem;
  index: number;
  onUpdatePortion: (index: number, grams: number, portionCategory: 'Small' | 'Medium' | 'Large' | 'Very Large') => void;
  onRemoveItem: (index: number) => void;
}

export const FoodDetectionCard: React.FC<Props> = ({
  item,
  index,
  onUpdatePortion,
  onRemoveItem
}) => {
  const confPct = Math.round(item.confidence * 100);

  const handleGramsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const g = parseFloat(e.target.value) || 0;
    let cat: 'Small' | 'Medium' | 'Large' | 'Very Large' = 'Medium';
    if (g < 100) cat = 'Small';
    else if (g < 220) cat = 'Medium';
    else if (g < 350) cat = 'Large';
    else cat = 'Very Large';
    onUpdatePortion(index, g, cat);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900 text-sm">{item.food_name}</h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${confPct > 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
              {confPct}% Confidence
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{item.category || 'General'}</p>
        </div>
        <button
          type="button"
          onClick={() => onRemoveItem(index)}
          className="text-gray-400 hover:text-rose-600 transition p-1.5 rounded-lg hover:bg-rose-50"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl text-xs">
        <div>
          <label className="block text-gray-500 font-medium mb-1">Portion Category</label>
          <span className="font-semibold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-md inline-block">
            {item.portion_category}
          </span>
        </div>
        <div>
          <label className="block text-gray-500 font-medium mb-1">Estimated Grams</label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={item.estimated_grams}
              onChange={handleGramsChange}
              className="w-20 bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:border-emerald-500"
              min="10"
              max="1000"
            />
            <span className="text-gray-500 font-medium">g</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-[11px] text-center bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100/50">
        <div>
          <span className="block text-gray-400">Calories</span>
          <span className="font-bold text-gray-800">{item.calories} kcal</span>
        </div>
        <div>
          <span className="block text-gray-400">Protein</span>
          <span className="font-bold text-emerald-700">{item.protein}g</span>
        </div>
        <div>
          <span className="block text-gray-400">Carbs</span>
          <span className="font-bold text-gray-800">{item.carbs}g</span>
        </div>
        <div>
          <span className="block text-gray-400">Fat</span>
          <span className="font-bold text-gray-800">{item.fat}g</span>
        </div>
        <div>
          <span className="block text-gray-400">Iron</span>
          <span className="font-bold text-gray-800">{item.iron}mg</span>
        </div>
        <div>
          <span className="block text-gray-400">Calcium</span>
          <span className="font-bold text-gray-800">{item.calcium}mg</span>
        </div>
      </div>
    </div>
  );
};
