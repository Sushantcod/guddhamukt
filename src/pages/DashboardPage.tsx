import React, { useState } from 'react';
import { 
  Building2, 
  Trees, 
  FileJson,
  GraduationCap,
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';
import { useIssues } from '../hooks/useIssues';
import { CivicMode } from '../types';
import { PageHeader } from '../components/layout/PageHeader';
import { MetricCard } from '../components/dashboard/MetricCard';
import { WardChart } from '../components/dashboard/WardChart';
import { HotspotList } from '../components/dashboard/HotspotList';

type JurisdictionMode = 'all' | 'punjab' | 'urban' | 'rural';

export const DashboardPage: React.FC = () => {
  const { issues, getMetrics } = useIssues();
  const [selectedMode, setSelectedMode] = useState<JurisdictionMode>('all');

  // Filter issues based on selected region
  const filteredIssues = issues.filter((issue) => {
    if (selectedMode === 'all') return true;
    if (selectedMode === 'punjab') return issue.id.includes('PB') || issue.wardOrVillage.includes('Phagwara') || issue.wardOrVillage.includes('Punjab');
    if (selectedMode === 'urban') return issue.mode === 'urban' && !issue.id.includes('PB');
    if (selectedMode === 'rural') return issue.mode === 'rural' && !issue.id.includes('PB');
    return true;
  });

  const modeForMetrics: CivicMode | 'all' = selectedMode === 'all' ? 'all' : selectedMode === 'rural' ? 'rural' : 'urban';
  const metrics = getMetrics(modeForMetrics);

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(issues, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Gaddhamukt_Open_Data_Export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 space-y-8">
      <PageHeader
        title="Public Civic Works & SLA Dashboard"
        subtitle="Open accountability metrics, municipal response speeds, and high-risk road defect hotspots."
        backHref="/"
        backLabel="Back to Map"
        rightAction={
          <button
            type="button"
            onClick={handleExportJSON}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-black text-[#0F294A] shadow-xs transition-all cursor-pointer"
          >
            <FileJson className="w-4 h-4 text-[#F97316]" />
            <span>Export Open Data (JSON)</span>
          </button>
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
        
        {/* Jurisdiction Filter Switcher Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#F97316]" />
            <span className="text-xs font-black text-[#0F294A] uppercase tracking-wider">
              Jurisdiction Grid:
            </span>
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-extrabold">
            <button
              type="button"
              onClick={() => setSelectedMode('all')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                selectedMode === 'all'
                  ? 'bg-[#0F294A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Regions ({issues.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedMode('punjab')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                selectedMode === 'punjab'
                  ? 'bg-[#0F294A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Punjab & LPU ({issues.filter((i) => i.id.includes('PB')).length})</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedMode('urban')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                selectedMode === 'urban'
                  ? 'bg-[#0F294A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>Urban (Bengaluru)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedMode('rural')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                selectedMode === 'rural'
                  ? 'bg-[#0F294A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trees className="w-4 h-4 text-emerald-400" />
              <span>Rural (Rampur)</span>
            </button>
          </div>
        </div>

        {/* 6 High-Contrast KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard
            title="Total Hazards"
            value={filteredIssues.length}
            subtitle="Geo-tickets"
            trend="+14%"
            trendPositive={true}
            iconType="reports"
          />
          <MetricCard
            title="Verifications"
            value={metrics.verifiedCount}
            subtitle="Confirmations"
            trend="+28%"
            trendPositive={true}
            iconType="reports"
          />
          <MetricCard
            title="Active Repairs"
            value={metrics.inProgressCount}
            subtitle="Crews on-site"
            iconType="inProgress"
          />
          <MetricCard
            title="Repairs Completed"
            value={metrics.resolvedCount}
            subtitle="Sign-off done"
            trend="+18%"
            trendPositive={true}
            iconType="resolved"
          />
          <MetricCard
            title="SLA Overdue"
            value={metrics.overdueCount}
            subtitle="Breached SLA"
            trend="-6%"
            trendPositive={true}
            iconType="overdue"
          />
          <MetricCard
            title="Escalated Dossiers"
            value={metrics.escalatedCount}
            subtitle="RTI & CMO packets"
            iconType="escalated"
          />
        </div>

        {/* Speed of Service Performance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex items-center gap-4 border-l-4 border-l-blue-600">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0F294A] flex items-center justify-center font-black text-xl border border-blue-200 shrink-0">
              ⚡
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                Average Municipal Acknowledgement Speed
              </span>
              <p className="text-2xl font-black text-[#0F294A] mt-0.5">
                {metrics.averageAcknowledgementHours} Hours
              </p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Benchmark: Within 24 hours under Citizen Charter
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex items-center gap-4 border-l-4 border-l-emerald-600">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xl border border-emerald-200 shrink-0">
              🛠️
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                Average Physical Resolution Turnaround
              </span>
              <p className="text-2xl font-black text-emerald-700 mt-0.5">
                {metrics.averageResolutionDays} Days
              </p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                From photo submission to asphalt compaction
              </p>
            </div>
          </div>

        </div>

        {/* Recharts Breakdown: Ward Comparisons & Category Pie */}
        <WardChart issues={filteredIssues} />

        {/* Hotspots Leaderboard */}
        <HotspotList issues={filteredIssues} />

      </main>
    </div>
  );
};

export default DashboardPage;
