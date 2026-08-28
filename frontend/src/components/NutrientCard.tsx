import React from 'react';
import { ProgressBar } from './ProgressBar';

interface NutrientCardProps {
  title: string;
  consumed: number;
  target: number;
  unit: string;
  icon?: React.ReactNode;
  color?: string;
}

export const NutrientCard: React.FC<NutrientCardProps> = ({
  title,
  consumed,
  target,
  unit,
  icon,
  color = 'bg-emerald-500'
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {icon && <div className="p-2 bg-gray-50 rounded-xl">{icon}</div>}
          <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
        </div>
      </div>
      <ProgressBar
        consumed={consumed}
        target={target}
        label=""
        unit={unit}
        color={color}
      />
    </div>
  );
};
