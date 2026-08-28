import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface SourceBadgeProps {
  type?: 'demo' | 'verified' | 'audit';
  label?: string;
  className?: string;
  showTooltip?: boolean;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({
  type = 'verified',
  label,
  className = '',
  showTooltip = false,
}) => {
  if (type === 'demo') {
    return null; // Removed "Demo data" pill per user requirement
  }

  return (
    <div className="relative group inline-block">
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#123C69]/10 text-[#123C69] text-xs font-bold border border-[#123C69]/20 transition-all ${className}`}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-[#123C69]" />
        {label || 'Verified Public Record'}
      </span>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block w-56 p-2 bg-slate-900 text-white text-[11px] rounded shadow-lg z-50 pointer-events-none text-center leading-relaxed">
          Data sourced from public state gazettes and civic disclosure registers.
        </div>
      )}
    </div>
  );
};
