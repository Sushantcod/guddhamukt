import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Building2, 
  Trees, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  Users,
  FileJson
} from 'lucide-react';
import { useIssues } from '../hooks/useIssues';
import { CivicMode } from '../types';
import { PageHeader } from '../components/layout/PageHeader';
import { MetricCard } from '../components/dashboard/MetricCard';
import { WardChart } from '../components/dashboard/WardChart';
import { HotspotList } from '../components/dashboard/HotspotList';
import { SourceBadge } from '../components/common/SourceBadge';

export const DashboardPage: React.FC = () => {
  const { issues, getMetrics } = useIssues();
  const [selectedMode, setSelectedMode] = useState<CivicMode | 'all'>('all');

  const filteredIssues =
    selectedMode === 'all' ? issues : issues.filter((i) => i.mode === selectedMode);

  const metrics = getMetrics(selectedMode);

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(issues, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `GuddhaMutk_Open_Data_Export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 space-y-6">
      <PageHeader
        title="Public Civic Works & SLA Dashboard"
        subtitle="Open accountability metrics, municipal response speeds, and high-risk road hotspots."
        backHref="/"
        backLabel="Back to Map"
        rightAction={
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-extrabold text-[#123C69] shadow-2xs transition-all"
          >
            <FileJson className="w-4 h-4 text-orange-500" />
            <span>Export Open Data (JSON)</span>
          </button>
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        {/* Mode Selector Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Jurisdiction Filter:
            </span>
            <SourceBadge type="demo" />
          </div>

          <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 text-xs font-bold shadow-2xs">
            <button
              onClick={() => setSelectedMode('all')}
              className={`px-3 py-1 rounded transition-all ${
                selectedMode === 'all' ? 'bg-[#123C69] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Regions
            </button>
            <button
              onClick={() => setSelectedMode('urban')}
              className={`flex items-center gap-1 px-3 py-1 rounded transition-all ${
                selectedMode === 'urban' ? 'bg-[#123C69] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Urban (Bengaluru)
            </button>
            <button
              onClick={() => setSelectedMode('rural')}
              className={`flex items-center gap-1 px-3 py-1 rounded transition-all ${
                selectedMode === 'rural' ? 'bg-[#123C69] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trees className="w-3.5 h-3.5" />
              Rural (Rampur)
            </button>
          </div>
        </div>

        {/* 6 High-Contrast KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
          <MetricCard
            title="Total Hazards"
            value={metrics.totalReports}
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
            subtitle="MLA / CMO packets"
            iconType="escalated"
          />
        </div>

        {/* Speed of Service Performance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex items-center gap-4 border-l-4 border-l-[#2563EB]">
            <div className="w-10 h-10 rounded-md bg-blue-50 text-[#123C69] flex items-center justify-center font-black text-base border border-blue-200">
              ⚡
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Average Municipal Acknowledgement Speed
              </span>
              <p className="text-xl font-black text-[#123C69] mt-0.5">
                {metrics.averageAcknowledgementHours} Hours
              </p>
              <p className="text-[11px] text-slate-500">Benchmark: Within 24 hours under Citizen Charter</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex items-center gap-4 border-l-4 border-l-[#15803D]">
            <div className="w-10 h-10 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-base border border-emerald-200">
              🛠️
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Average Physical Resolution Turnaround
              </span>
              <p className="text-xl font-black text-[#15803D] mt-0.5">
                {metrics.averageResolutionDays} Days
              </p>
              <p className="text-[11px] text-slate-500">From photo submission to asphalt compaction</p>
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
