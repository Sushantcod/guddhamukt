import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { SourceBadge } from '../common/SourceBadge';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  badge?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  backHref,
  backLabel = 'Back',
  badge,
  rightAction,
}) => {
  return (
    <div className="bg-white border-b border-slate-200/80 py-5 px-4 sm:px-6 lg:px-8 mb-6 shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {backHref && (
            <Link
              to={backHref}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#123C69] mb-2 transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              {backLabel}
            </Link>
          )}
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#123C69] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              {title}
            </h1>
            {badge}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl font-medium">
              {subtitle}
            </p>
          )}
        </div>
        {rightAction && <div className="flex items-center gap-2 shrink-0">{rightAction}</div>}
      </div>
    </div>
  );
};
