import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
  variant?: 'fullscreen' | 'card' | 'inline';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading civic infrastructure data...',
  subMessage = 'Fetching verified reports and GPS coordinates',
  variant = 'card',
}) => {
  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2.5 text-slate-600 text-xs font-semibold py-2">
        <Loader2 className="w-4 h-4 animate-spin text-[#F97316]" />
        <span>{message}</span>
      </div>
    );
  }

  if (variant === 'fullscreen') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center mb-4 shadow-xs">
          <Loader2 className="w-8 h-8 animate-spin text-[#F97316]" />
        </div>
        <h3 className="text-base font-bold text-slate-800 tracking-tight">{message}</h3>
        {subMessage && <p className="text-xs text-slate-500 mt-1 max-w-sm">{subMessage}</p>}
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-xs">
      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#123C69]" />
      </div>
      <h4 className="text-sm font-bold text-slate-800">{message}</h4>
      {subMessage && <p className="text-xs text-slate-500 mt-1">{subMessage}</p>}
    </div>
  );
};
