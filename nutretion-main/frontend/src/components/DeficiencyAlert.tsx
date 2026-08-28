import React from 'react';
import { AlertCircle, AlertOctagon, Info } from 'lucide-react';
import { DeficiencyAlert as IDeficiencyAlert } from '../types/nutrition';

interface Props {
  deficiency: IDeficiencyAlert;
}

export const DeficiencyAlert: React.FC<Props> = ({ deficiency }) => {
  const getBadge = () => {
    switch (deficiency.severity) {
      case 'HIGH':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-800',
          icon: <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />,
          pill: 'bg-rose-100 text-rose-700'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          icon: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />,
          pill: 'bg-amber-100 text-amber-700'
        };
      default:
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
          pill: 'bg-blue-100 text-blue-700'
        };
    }
  };

  const style = getBadge();

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 ${style.bg}`}>
      {style.icon}
      <div className="flex-1 text-xs">
        <div className="flex items-center justify-between font-semibold mb-1">
          <span className="text-sm">{deficiency.label} Intake Low</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${style.pill}`}>
            {deficiency.severity} PRIORITY
          </span>
        </div>
        <p className="mt-1 leading-relaxed">{deficiency.message}</p>
      </div>
    </div>
  );
};
