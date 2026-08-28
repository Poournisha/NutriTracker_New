import React from 'react';

interface ProgressBarProps {
  consumed: number;
  target: number;
  label: string;
  unit: string;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  consumed,
  target,
  label,
  unit,
  color = 'bg-emerald-500'
}) => {
  const percentage = target > 0 ? Math.min(100, Math.round((consumed / target) * 100)) : 0;
  
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm font-medium">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-900 font-semibold">
          {consumed} / {target} {unit} <span className="text-gray-400 font-normal">({percentage}%)</span>
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
