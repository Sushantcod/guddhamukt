import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DemoNoticeBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside aria-label="Demo mode notice" className="bg-[#123C69] text-white text-xs px-4 py-2 flex items-center justify-between border-b border-blue-900/50 relative z-50">
      <div className="flex items-center gap-2 max-w-7xl mx-auto flex-1 justify-center text-center">
        <span className="inline-flex items-center gap-1 bg-[#F97316] text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase">
          <Sparkles className="w-3 h-3" />
          Frontend Demo Mode
        </span>
        <span className="hidden sm:inline font-medium text-slate-200">
          All road data, contracts & escalation routes are simulated for civic demonstration.
        </span>
        <Link
          to="/admin"
          className="underline text-orange-300 hover:text-white font-bold ml-1 transition-colors"
        >
          Explore Admin Operations &rarr;
        </Link>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-slate-300 hover:text-white p-1 rounded transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};
