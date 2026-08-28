import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Sparkles,
  Camera,
  Building2,
  Users,
  FileDown,
  ArrowRight
} from 'lucide-react';
import { useIssues } from '../hooks/useIssues';
import { CivicMode, FilterOptions, Issue } from '../types';
import { IssueMap } from '../components/map/IssueMap';
import { MapFilters } from '../components/map/MapFilters';
import { IssueCard } from '../components/issue/IssueCard';
import { EmptyState } from '../components/common/EmptyState';
import { GlobeComponent } from '../components/ui/GlobeComponent';

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
    <div className="min-h-screen bg-[#F8FAFC] pb-16 space-y-10">
      
      {/* HERO SECTION WITH INTERACTIVE 3D GLOBE */}
      <section className="bg-gradient-to-b from-[#0F294A] via-[#123C69] to-[#0A1E36] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden relative shadow-xl">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Story & Value Proposition */}
          <div className="lg:col-span-6 space-y-6 text-left z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 text-xs font-extrabold shadow-sm">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>GADDHAMUKT CIVIC ROAD PLATFORM</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Report Potholes. <br />
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                Fix Roads. Hold Engineers Accountable.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium max-w-xl">
              <strong>Gaddhamukt</strong> enables citizens to photo geo-tag dangerous road potholes, trigger automatic routing to Municipal Ward Engineers or Gram Panchayats, and monitor live 72-hour statutory repair SLAs.
            </p>

            {/* Main Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/report"
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#F97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white px-6 py-3.5 rounded-xl font-extrabold text-sm sm:text-base shadow-xl shadow-orange-500/30 transition-all transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Report a Pothole Now</span>
              </Link>
              <Link
                to="/track"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm backdrop-blur-md transition-all"
              >
                <FileText className="w-4 h-4 text-orange-300" />
                <span>Track Complaint SLA</span>
              </Link>
            </div>

            {/* Quick Impact Stats */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-white">{metrics.totalReports}</span>
                <span className="block text-[11px] text-slate-300 font-semibold uppercase tracking-wider">Reports Logged</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400">{metrics.resolvedCount}</span>
                <span className="block text-[11px] text-slate-300 font-semibold uppercase tracking-wider">Fixed Roads</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-orange-400">72 Hours</span>
                <span className="block text-[11px] text-slate-300 font-semibold uppercase tracking-wider">Statutory SLA</span>
              </div>
            </div>
          </div>

          {/* Right Hero Interactive 3D Globe */}
          <div className="lg:col-span-6 flex justify-center z-10">
            <GlobeComponent />
          </div>

        </div>
      </section>

      {/* HOW GADDHAMUKT WORKS (3 SIMPLE STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-8">
          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-extrabold uppercase tracking-wider">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F294A] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            How Gaddhamukt Solves Road Potholes
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            From reporting a broken asphalt spot to municipal sign-off, every stage is fully transparent and SLA-tracked.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all space-y-4 text-left group">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F97316] font-black text-lg group-hover:scale-110 transition-transform">
              1
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-[#0F294A] flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#F97316]" />
                <span>Snap Photo & Pin Location</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Take a quick photo of the pothole or damaged road. Our system automatically captures GPS coordinates, reverse geocodes the exact street address, and detects duplicate reports.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-orange-600 flex items-center gap-1">
              <span>Instant GPS Geo-tagging</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all space-y-4 text-left group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#123C69] font-black text-lg group-hover:scale-110 transition-transform">
              2
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-[#0F294A] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#123C69]" />
                <span>Routed to Official Engineer</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Your report is assigned to the statutory Ward Junior Engineer (Urban BBMP) or Gram Panchayat Sarpanch (Rural Village) with public tender details and 72-hour countdown.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-[#123C69] flex items-center gap-1">
              <span>Public Tender & Liability Match</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all space-y-4 text-left group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-black text-lg group-hover:scale-110 transition-transform">
              3
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-[#0F294A] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Track Repair & Escalate PDF</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Watch repair progress live. If the SLA expires without work, generate an automated RTI / CMO legal grievance PDF packet or confirm contractor repair proof.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-emerald-600 flex items-center gap-1">
              <span>Citizen Quality Verification</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </section>

      {/* LIVE GEOSPATIAL MAP & ISSUES GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F294A] font-['Plus_Jakarta_Sans',sans-serif]">
              Explore Live Road Complaints Map
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Filter by Urban Bengaluru Wards or Rural Village Panchayats to track repair status.
            </p>
          </div>

          {/* View Toggle Buttons */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold shadow-2xs">
            <button
              onClick={() => setViewTab('both')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewTab === 'both' ? 'bg-[#123C69] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewTab('map')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewTab === 'map' ? 'bg-[#123C69] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Map Only
            </button>
            <button
              onClick={() => setViewTab('list')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewTab === 'list' ? 'bg-[#123C69] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cards List ({filteredIssues.length})
            </button>
          </div>
        </div>

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

        {/* Interactive Grid: Map + List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
                <div className="bg-white rounded-xl p-3 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-slate-700 shadow-2xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] inline-block"></span>
                    <span>High Hazard</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] inline-block"></span>
                    <span>SLA Overdue</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] inline-block"></span>
                    <span>Reported</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                    <span>Repair Active</span>
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
                  actionText="Report New Pothole"
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

export default HomePage;
