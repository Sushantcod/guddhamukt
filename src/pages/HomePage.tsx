import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  MapPin, 
  Layers, 
  SlidersHorizontal, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Building2, 
  Trees,
  Search
} from 'lucide-react';
import { useIssues } from '../hooks/useIssues';
import { CivicMode, FilterOptions, Issue } from '../types';
import { IssueMap } from '../components/map/IssueMap';
import { MapFilters } from '../components/map/MapFilters';
import { IssueCard } from '../components/issue/IssueCard';
import { SourceBadge } from '../components/common/SourceBadge';
import { EmptyState } from '../components/common/EmptyState';

export const HomePage: React.FC = () => {
  const { issues, confirmIssue, userConfirmedIds, getMetrics } = useIssues();
  const [currentMode, setCurrentMode] = useState<CivicMode>('urban');
  const [filters, setFilters] = useState<FilterOptions>({
    mode: 'urban',
    category: 'All',
    status: 'All',
    severity: 'All',
    isOverdue: false,
    searchQuery: '',
  });

  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [viewTab, setViewTab] = useState<'map' | 'list' | 'both'>('both');

  const handleModeToggle = (mode: CivicMode) => {
    setCurrentMode(mode);
    setFilters((prev) => ({ ...prev, mode }));
  };

  // Filter issues based on active filters
  const filteredIssues = issues.filter((issue) => {
    if (filters.mode && filters.mode !== 'all' && issue.mode !== filters.mode) {
      return false;
    }
    if (filters.category && filters.category !== 'All' && issue.category !== filters.category) {
      return false;
    }
    if (filters.status && filters.status !== 'All' && issue.status !== filters.status) {
      return false;
    }
    if (filters.severity && filters.severity !== 'All' && issue.severity !== filters.severity) {
      return false;
    }
    if (filters.isOverdue && !issue.isOverdue) {
      return false;
    }
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = issue.title.toLowerCase().includes(q);
      const matchAddress = issue.address.toLowerCase().includes(q);
      const matchId = issue.id.toLowerCase().includes(q);
      const matchWard = issue.wardOrVillage.toLowerCase().includes(q);
      const matchCat = issue.category.toLowerCase().includes(q);
      if (!matchTitle && !matchAddress && !matchId && !matchWard && !matchCat) {
        return false;
      }
    }
    return true;
  });

  const metrics = getMetrics(filters.mode);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 space-y-6">
      {/* Top Banner / Hero Strip */}
      <section className="bg-[#123C69] text-white pt-8 pb-8 px-4 sm:px-6 lg:px-8 border-b border-slate-700 shadow-sm technical-blueprint-bg">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-[#F97316] text-white text-[10px] font-bold uppercase tracking-wider">
                  Live Geospatial Grid
                </span>
                <SourceBadge type="demo" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                Citizen Road Defect & Accountability Matrix
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-normal">
                Geo-tag road defects, monitor municipal SLA timers, inspect public contract liability, and trigger escalation packets.
              </p>
            </div>

            {/* Quick Report CTA */}
            <div className="flex items-center gap-3">
              <Link
                to="/report"
                className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white px-4 py-2.5 rounded-lg text-xs font-bold shadow-sm transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report Road Defect</span>
              </Link>
            </div>
          </div>

          {/* Metric Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="bg-white/10 backdrop-blur-xs rounded-lg p-3 border border-white/15">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                Total Logged Defect
              </span>
              <span className="text-2xl font-black text-white font-['Plus_Jakarta_Sans',sans-serif]">
                {metrics.totalReports}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-lg p-3 border border-white/15">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                Resident Verified
              </span>
              <span className="text-2xl font-black text-orange-300 font-['Plus_Jakarta_Sans',sans-serif]">
                {metrics.verifiedCount}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-lg p-3 border border-white/15">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                Repairs Completed
              </span>
              <span className="text-2xl font-black text-emerald-300 font-['Plus_Jakarta_Sans',sans-serif]">
                {metrics.resolvedCount}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-lg p-3 border border-white/15">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                SLA Overdue
              </span>
              <span className="text-2xl font-black text-red-300 font-['Plus_Jakarta_Sans',sans-serif]">
                {metrics.overdueCount}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        {/* Filter Controls Bar */}
        <MapFilters
          filters={filters}
          onFilterChange={(newFilters) => {
            setFilters(newFilters);
            if (newFilters.mode && newFilters.mode !== 'all') {
              setCurrentMode(newFilters.mode as CivicMode);
            }
          }}
          onResetFilters={() =>
            setFilters({
              mode: currentMode,
              category: 'All',
              status: 'All',
              severity: 'All',
              isOverdue: false,
              searchQuery: '',
            })
          }
          totalCount={issues.length}
          filteredCount={filteredIssues.length}
        />

        {/* View Toggle (Mobile/Responsive) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#123C69] uppercase tracking-wider">
              {currentMode === 'urban' ? '🏙️ Bengaluru Urban Corridor Grid' : '🌾 Rampur Rural Gram Panchayat Grid'}
            </span>
          </div>

          <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 text-xs font-bold shadow-2xs">
            <button
              onClick={() => setViewTab('both')}
              className={`px-3 py-1 rounded transition-all ${
                viewTab === 'both' ? 'bg-[#123C69] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewTab('map')}
              className={`px-3 py-1 rounded transition-all ${
                viewTab === 'map' ? 'bg-[#123C69] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Map Only
            </button>
            <button
              onClick={() => setViewTab('list')}
              className={`px-3 py-1 rounded transition-all ${
                viewTab === 'list' ? 'bg-[#123C69] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Data Cards ({filteredIssues.length})
            </button>
          </div>
        </div>

        {/* Interactive Grid: Map + List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Map Column */}
          {(viewTab === 'both' || viewTab === 'map') && (
            <div className={viewTab === 'both' ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12'}>
              <div className="sticky top-24 space-y-3">
                <IssueMap
                  issues={filteredIssues}
                  selectedIssueId={selectedIssue?.id}
                  onSelectIssue={(issue) => setSelectedIssue(issue)}
                  mode={currentMode}
                  height={viewTab === 'map' ? '650px' : '580px'}
                />

                {/* Map Legend */}
                <div className="bg-white rounded-lg p-3 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-slate-700 shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] inline-block"></span>
                    <span>Immediate Danger</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] inline-block"></span>
                    <span>SLA Overdue</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] inline-block"></span>
                    <span>Reported / Routed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                    <span>Repair Scheduled</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#15803D] inline-block"></span>
                    <span>Verified Fixed</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Issues Card List Column */}
          {(viewTab === 'both' || viewTab === 'list') && (
            <div className={viewTab === 'both' ? 'lg:col-span-5 xl:col-span-4' : 'lg:col-span-12'}>
              {filteredIssues.length === 0 ? (
                <EmptyState
                  title="No road hazards found"
                  description="No issues match the selected filter criteria. Try adjusting your filters or report a new road defect."
                  actionText="Report New Issue"
                  actionHref="/report"
                />
              ) : (
                <div
                  className={`space-y-3.5 ${
                    viewTab === 'list' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 space-y-0' : 'max-h-[640px] overflow-y-auto custom-scrollbar pr-1'
                  }`}
                >
                  {filteredIssues.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      onConfirm={(id) => confirmIssue(id)}
                      isConfirmedByUser={userConfirmedIds.includes(issue.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
