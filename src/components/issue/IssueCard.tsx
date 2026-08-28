import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, ArrowUpRight, AlertTriangle, Building2, Trees, CheckCircle2 } from 'lucide-react';
import { Issue } from '../../types';
import { StatusBadge, SeverityBadge, CategoryBadge } from './StatusBadge';
import { formatDateString } from '../../utils/issueHelpers';

interface IssueCardProps {
  issue: Issue;
  onConfirm?: (issueId: string) => void;
  isConfirmedByUser?: boolean;
  compact?: boolean;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  onConfirm,
  isConfirmedByUser = false,
  compact = false,
}) => {
  const isResolved = issue.status === 'Resolved' || issue.status === 'Citizen Verified';

  const getLeftBorderClass = () => {
    if (issue.isOverdue || issue.severity === 'Immediate Danger') {
      return 'border-l-4 border-[#DC2626]';
    }
    if (issue.status === 'Repair In Progress') {
      return 'border-l-4 border-[#F97316]';
    }
    if (isResolved) {
      return 'border-l-4 border-[#15803D]';
    }
    if (issue.status === 'Acknowledged' || issue.status === 'Routed') {
      return 'border-l-4 border-[#2563EB]';
    }
    return 'border-l-4 border-slate-300';
  };

  return (
    <div
      id={`issue-card-${issue.id}`}
      className={`group bg-white rounded-lg border border-slate-200 transition-all duration-150 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md ${getLeftBorderClass()}`}
    >
      <div>
        {/* Card Image Header */}
        <div className="relative h-36 sm:h-40 w-full bg-slate-100 overflow-hidden">
          <img
            src={issue.photoUrl}
            alt={issue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5 z-10">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                issue.mode === 'urban'
                  ? 'bg-[#123C69] text-white border border-blue-400/30'
                  : 'bg-emerald-900 text-white border border-emerald-400/30'
              }`}
            >
              {issue.mode === 'urban' ? <Building2 className="w-2.5 h-2.5" /> : <Trees className="w-2.5 h-2.5" />}
              {issue.mode}
            </span>
            <SeverityBadge severity={issue.severity} />
          </div>

          {/* Top Right Ref ID */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10">
            <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono font-bold border border-white/20">
              #{issue.id}
            </span>
          </div>

          {/* Bottom Overlay Info on Photo */}
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-1 font-semibold text-slate-100 drop-shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
              <span className="truncate max-w-[200px] text-[11px]">{issue.wardOrVillage}</span>
            </div>
            <span className="text-[10px] text-slate-300 drop-shadow-xs font-mono font-medium">
              {formatDateString(issue.createdAt)}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3.5 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-[#123C69] transition-colors">
              {issue.title}
            </h3>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {issue.description}
          </p>

          {/* Badges & Meta */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <CategoryBadge category={issue.category} />
            <StatusBadge status={issue.status} />

            {issue.isOverdue && !isResolved && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-[#DC2626] text-[10px] font-bold border border-red-200 uppercase">
                <AlertTriangle className="w-3 h-3 text-[#DC2626]" />
                Overdue
              </span>
            )}
          </div>

          {/* Location details */}
          <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate pt-0.5">
            <span className="text-slate-400 font-medium">Loc:</span>
            <span className="truncate text-slate-700 font-medium">{issue.address}</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-3.5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
        {/* Confirmations count */}
        <div className="flex items-center gap-2">
          {onConfirm ? (
            <button
              onClick={() => onConfirm(issue.id)}
              disabled={isResolved}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-all ${
                isConfirmedByUser
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs'
              } ${isResolved ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Click to confirm this road issue"
            >
              <Users className="w-3.5 h-3.5 text-[#123C69]" />
              <span>{issue.confirmationCount}</span>
              <span className="hidden sm:inline font-normal text-slate-500">Verified</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>{issue.confirmationCount} Verified</span>
            </div>
          )}
        </div>

        {/* Action Link */}
        <Link
          to={`/issues/${issue.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#123C69] hover:text-[#F97316] transition-colors py-1 px-2 rounded hover:bg-white"
        >
          <span>View Issue</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

