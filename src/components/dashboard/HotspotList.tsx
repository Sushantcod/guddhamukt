import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Users, ArrowUpRight, Flame, MapPin } from 'lucide-react';
import { Issue } from '../../types';
import { CategoryBadge, StatusBadge } from '../issue/StatusBadge';

interface HotspotListProps {
  issues: Issue[];
}

export const HotspotList: React.FC<HotspotListProps> = ({ issues }) => {
  // Sort by confirmation count descending, filter out resolved
  const activeHotspots = [...issues]
    .filter((i) => i.status !== 'Resolved' && i.status !== 'Citizen Verified')
    .sort((a, b) => b.confirmationCount - a.confirmationCount)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-[#123C69] text-base flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            Top Citizen-Verified Road Hotspots
          </h3>
          <p className="text-xs text-slate-500">
            Unresolved road defects ranked by resident confirmations & emergency hazard
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {activeHotspots.map((issue, rank) => (
          <div
            key={issue.id}
            className="p-3.5 rounded-xl border border-slate-200/70 hover:border-slate-300 hover:shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50"
          >
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#123C69] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {rank + 1}
              </span>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 line-clamp-1">
                    {issue.title}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">#{issue.id}</span>
                </div>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                  <span>{issue.address}</span>
                  <span className="text-slate-400">({issue.wardOrVillage})</span>
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <CategoryBadge category={issue.category} />
                  <StatusBadge status={issue.status} />
                  {issue.severity === 'Immediate Danger' && (
                    <span className="text-[10px] font-extrabold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                      Immediate Danger
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
              <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-lg text-blue-900 text-xs font-extrabold border border-blue-100">
                <Users className="w-3.5 h-3.5 text-blue-700" />
                <span>{issue.confirmationCount} Verified</span>
              </div>

              <Link
                to={`/issues/${issue.id}`}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-[#123C69] hover:bg-[#123C69] hover:text-white transition-colors"
                title="View Issue"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
