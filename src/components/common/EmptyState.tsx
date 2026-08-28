import React from 'react';
import { AlertCircle, FileSearch, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  actionHref,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-slate-200/80 shadow-sm max-w-lg mx-auto my-6">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-4">
        <FileSearch className="w-7 h-7 text-[#123C69]" />
      </div>
      <h3 className="text-lg font-bold text-[#123C69] mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && (
        actionHref ? (
          <Link
            to={actionHref}
            className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
          >
            {actionText}
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 bg-[#123C69] hover:bg-[#00264b] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
          >
            {actionText}
          </button>
        )
      )}
    </div>
  );
};

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading civic records...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-[#2563EB] rounded-full animate-spin mb-4"></div>
      <p className="text-sm font-semibold text-slate-600 animate-pulse">{message}</p>
    </div>
  );
};

export const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 flex items-start gap-3 my-4">
      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-bold">Action Notification</p>
        <p className="text-xs mt-0.5 text-red-700">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-bold text-red-700 hover:text-red-900 underline shrink-0"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
