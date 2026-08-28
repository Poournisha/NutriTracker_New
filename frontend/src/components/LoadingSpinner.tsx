import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ label = 'Loading...', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <Loader2 className="w-9 h-9 text-emerald-600 animate-spin mb-3" />
      {label && <p className="text-sm font-medium text-gray-600">{label}</p>}
    </div>
  );
};
