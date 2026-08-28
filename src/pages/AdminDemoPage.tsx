import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Settings, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Wrench, 
  Building2, 
  Trees, 
  Edit3, 
  X,
  FileCheck,
  Eye,
  PlusCircle
} from 'lucide-react';
import { useIssues } from '../hooks/useIssues';
import { Issue, IssueStatus, SimulatedRouteStatus, CivicMode } from '../types';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge, SeverityBadge, CategoryBadge } from '../components/issue/StatusBadge';
import { SourceBadge } from '../components/common/SourceBadge';
import { formatDateTimeString } from '../utils/issueHelpers';

const STATUS_OPTIONS: IssueStatus[] = [
  'Reported',
  'Routed',
  'Acknowledged',
  'Inspection Scheduled',
  'Repair In Progress',
  'Resolved',
  'Citizen Verified',
];

const ROUTE_STATUS_OPTIONS: SimulatedRouteStatus[] = [
  'Prepared',
  'Simulated route',
  'Acknowledged',
  'Overdue',
  'Escalation packet ready',
];

const SAMPLE_REPAIR_PROOFS = [
  'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
];

export const AdminDemoPage: React.FC = () => {
  const { issues, updateIssueStatus, resetToFactoryDemoData } = useIssues();
  const [filterMode, setFilterMode] = useState<CivicMode | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<IssueStatus | 'All'>('All');
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  // Edit Modal Form State
  const [newStatus, setNewStatus] = useState<IssueStatus>('Reported');
  const [newRouteStatus, setNewRouteStatus] = useState<SimulatedRouteStatus>('Prepared');
  const [newAdminNote, setNewAdminNote] = useState<string>('');
  const [newRepairProofUrl, setNewRepairProofUrl] = useState<string>('');

  const filteredIssues = issues.filter((issue) => {
    if (filterMode !== 'all' && issue.mode !== filterMode) return false;
    if (filterStatus !== 'All' && issue.status !== filterStatus) return false;
    return true;
  });

  const handleOpenEdit = (issue: Issue) => {
    setEditingIssue(issue);
    setNewStatus(issue.status);
    setNewRouteStatus(issue.simulatedRouteStatus);
    setNewAdminNote('');
    setNewRepairProofUrl(issue.repairProofUrl || '');
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIssue) return;

    updateIssueStatus(
      editingIssue.id,
      newStatus,
      newAdminNote.trim() || undefined,
      newRepairProofUrl.trim() || undefined
    );

    setEditingIssue(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 space-y-6">
      <PageHeader
        title="Municipal Work Order & Dispatch Console"
        subtitle="Official municipal engineer panel to update road repair stages, upload proof of work, and manage escalation routes."
        backHref="/"
        backLabel="Back to Map"
        badge={<span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">Municipal Operations</span>}
        rightAction={
          <button
            onClick={() => {
              if (window.confirm('Reset all issues and timestamps to default demo state?')) {
                resetToFactoryDemoData();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-red-600 shadow-2xs transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Info Strip */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-amber-950 text-xs">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <strong className="block font-bold text-amber-900">
                Interactive Engineering Simulation Sandbox
              </strong>
              <span>
                Simulate status transitions (e.g. Schedule Inspection &rarr; Repair In Progress &rarr; Resolved). All updates persist in browser localStorage.
              </span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Mode Filter */}
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className="text-slate-400 uppercase text-[11px]">Region:</span>
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    filterMode === 'all' ? 'bg-white text-[#123C69] shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterMode('urban')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    filterMode === 'urban' ? 'bg-white text-[#123C69] shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  Urban
                </button>
                <button
                  onClick={() => setFilterMode('rural')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    filterMode === 'rural' ? 'bg-white text-[#123C69] shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  Rural
                </button>
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className="text-slate-400 uppercase text-[11px]">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1 text-xs font-bold text-slate-700"
              >
                <option value="All">All Statuses ({issues.length})</option>
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <span className="text-xs font-bold text-slate-500">
            {filteredIssues.length} Tickets in Queue
          </span>
        </div>

        {/* Issues Management Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Docket ID</th>
                  <th className="py-3.5 px-4">Hazard & Road</th>
                  <th className="py-3.5 px-4">Subdivision</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-4">SLA Time</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      #{issue.id}
                      {issue.severity === 'Immediate Danger' && (
                        <span className="block text-[10px] text-red-600 font-extrabold">EMERGENCY</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-extrabold text-slate-900 truncate">{issue.title}</p>
                      <p className="text-[11px] text-slate-500 truncate">{issue.address}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-700">{issue.wardOrVillage}</span>
                      <span className="text-[10px] text-slate-400 block capitalize">{issue.mode}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={issue.status} />
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`font-bold ${
                          issue.isOverdue ? 'text-red-600' : 'text-slate-600'
                        }`}
                      >
                        {issue.isOverdue ? '⚠️ Overdue' : 'Within SLA'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(issue)}
                          className="px-3 py-1.5 rounded-lg bg-[#123C69] hover:bg-[#00264b] text-white font-extrabold text-xs transition-colors"
                        >
                          Update Status
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Updating Issue Status */}
        {editingIssue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-400">
                    Docket #{editingIssue.id}
                  </span>
                  <h3 className="text-lg font-extrabold text-[#123C69]">
                    Simulate Authority Action
                  </h3>
                </div>
                <button
                  onClick={() => setEditingIssue(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
                {/* Select New Status */}
                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px] block">
                    Update Workflow Status *
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as IssueStatus)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#123C69]/20"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dispatch Note */}
                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px] block">
                    Engineer Work Note / Docket Log
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Field inspection completed. Asphalt paving crew scheduled for 09:00 AM."
                    value={newAdminNote}
                    onChange={(e) => setNewAdminNote(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>

                {/* Repair Proof URL (If resolving) */}
                {(newStatus === 'Resolved' || newStatus === 'Citizen Verified') && (
                  <div className="space-y-2 p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <label className="font-extrabold text-emerald-950 uppercase tracking-wider text-[11px] block">
                      Attach Repair Proof Photo URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newRepairProofUrl}
                      onChange={(e) => setNewRepairProofUrl(e.target.value)}
                      className="w-full p-2 bg-white border border-emerald-300 rounded-lg text-xs"
                    />

                    {/* Quick Preset Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] font-bold text-emerald-800">Quick Samples:</span>
                      {SAMPLE_REPAIR_PROOFS.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewRepairProofUrl(url)}
                          className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-950 text-[10px] font-bold"
                        >
                          Sample Proof {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingIssue(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#123C69] hover:bg-[#00264b] text-white font-extrabold shadow-sm"
                  >
                    Apply Status & Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
