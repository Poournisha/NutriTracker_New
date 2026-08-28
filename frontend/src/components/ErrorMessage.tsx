import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 text-rose-800 my-4">
      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="font-semibold text-sm">Error Occurred</h4>
        <p className="text-sm text-rose-700 mt-1">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 transition"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};
