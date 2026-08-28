import React from 'react';
import { Search, Filter, RotateCcw, AlertTriangle, Building2, Trees } from 'lucide-react';
import { CivicMode, IssueCategory, IssueSeverity, IssueStatus, FilterOptions } from '../../types';

interface MapFiltersProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
  onResetFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

const CATEGORIES: (IssueCategory | 'All')[] = [
  'All',
  'Pothole',
  'Road Damage',
  'Drainage',
  'Waterlogging',
  'Streetlight',
  'Footpath Hazard',
];

const SEVERITIES: (IssueSeverity | 'All')[] = ['All', 'Immediate Danger', 'High', 'Medium', 'Low'];

const STATUSES: (IssueStatus | 'All')[] = [
  'All',
  'Reported',
  'Routed',
  'Acknowledged',
  'Inspection Scheduled',
  'Repair In Progress',
  'Resolved',
];

export const MapFilters: React.FC<MapFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalCount,
  filteredCount,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-4">
      {/* Top Bar: Search + Mode Switcher + Results Count */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by road name, ward, landmark, ID (e.g., CP-90210)..."
            value={filters.searchQuery || ''}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#123C69]/20 focus:border-[#123C69] transition-all"
          />
        </div>

        {/* Mode Toggle (Urban vs Rural vs All) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, mode: 'all' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filters.mode === 'all' || !filters.mode
                ? 'bg-white text-[#123C69] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Regions
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, mode: 'urban' })}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filters.mode === 'urban'
                ? 'bg-white text-[#123C69] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            Urban
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, mode: 'rural' })}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filters.mode === 'rural'
                ? 'bg-white text-[#123C69] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Trees className="w-3.5 h-3.5 text-emerald-600" />
            Rural
          </button>
        </div>
      </div>

      {/* Category Chips Carousel / Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Category:
        </span>
        {CATEGORIES.map((cat) => {
          const isSelected = (filters.category || 'All') === cat;
          return (
            <button
              key={cat}
              onClick={() => onFilterChange({ ...filters, category: cat })}
              className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all ${
                isSelected
                  ? 'bg-[#123C69] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Secondary Row: Severity, Status & Overdue toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {/* Severity selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-bold text-[11px] uppercase">Severity:</span>
            <select
              value={filters.severity || 'All'}
              onChange={(e) =>
                onFilterChange({ ...filters, severity: e.target.value as IssueSeverity | 'All' })
              }
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#123C69]"
            >
              {SEVERITIES.map((sev) => (
                <option key={sev} value={sev}>
                  {sev}
                </option>
              ))}
            </select>
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-bold text-[11px] uppercase">Status:</span>
            <select
              value={filters.status || 'All'}
              onChange={(e) =>
                onFilterChange({ ...filters, status: e.target.value as IssueStatus | 'All' })
              }
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#123C69]"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Overdue Checkbox */}
          <label className="flex items-center gap-1.5 font-bold text-red-700 cursor-pointer bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 hover:bg-red-100 transition-colors">
            <input
              type="checkbox"
              checked={filters.isOverdue || false}
              onChange={(e) => onFilterChange({ ...filters, isOverdue: e.target.checked })}
              className="rounded text-red-600 focus:ring-red-500"
            />
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <span>Show Only Overdue SLA</span>
          </label>
        </div>

        {/* Count & Reset */}
        <div className="flex items-center gap-3">
          <span className="text-slate-500 font-semibold text-xs">
            Showing <strong className="text-slate-900">{filteredCount}</strong> of {totalCount} issues
          </span>
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors"
            title="Reset filters"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
