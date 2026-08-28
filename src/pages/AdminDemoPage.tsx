import React, { useState } from 'react';
import { 
  ShieldCheck, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Wrench, 
  Building2, 
  Trees, 
  Edit3, 
  X,
  HardHat,
  GraduationCap,
  Layers,
  Search,
  Filter,
  Check,
  Flame,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useIssues } from '../hooks/useIssues';
import { Issue, IssueStatus, SimulatedRouteStatus, CivicMode } from '../types';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge } from '../components/issue/StatusBadge';

const STATUS_OPTIONS: IssueStatus[] = [
  'Reported',
  'Routed',
  'Acknowledged',
  'Inspection Scheduled',
  'Repair In Progress',
  'Resolved',
  'Citizen Verified',
];

const SAMPLE_REPAIR_PROOFS = [
  '/demo-images/repair-proof.jpg',
  '/demo-images/road-repair-work.jpg',
];

type JurisdictionFilter = 'all' | 'punjab' | 'urban' | 'rural';

export const AdminDemoPage: React.FC = () => {
  const { issues, updateIssueStatus, resetToFactoryDemoData } = useIssues();
  const [filterMode, setFilterMode] = useState<JurisdictionFilter>('all');
  const [filterStatus, setFilterStatus] = useState<IssueStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  // Form State
  const [newStatus, setNewStatus] = useState<IssueStatus>('Reported');
  const [newAdminNote, setNewAdminNote] = useState<string>('');
  const [newRepairProofUrl, setNewRepairProofUrl] = useState<string>('');

  const filteredIssues = issues.filter((issue) => {
    if (filterMode === 'punjab' && !issue.id.includes('PB') && !issue.wardOrVillage.includes('Phagwara')) return false;
    if (filterMode === 'urban' && (issue.mode !== 'urban' || issue.id.includes('PB'))) return false;
    if (filterMode === 'rural' && (issue.mode !== 'rural' || issue.id.includes('PB'))) return false;
    if (filterStatus !== 'All' && issue.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        issue.id.toLowerCase().includes(q) ||
        issue.title.toLowerCase().includes(q) ||
        issue.address.toLowerCase().includes(q) ||
        issue.assignedDepartment.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenEdit = (issue: Issue) => {
    setEditingIssue(issue);
    setNewStatus(issue.status);
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

  const inProgressCount = issues.filter((i) => i.status === 'Repair In Progress' || i.status === 'Inspection Scheduled').length;
  const overdueCount = issues.filter((i) => i.isOverdue).length;
  const resolvedCount = issues.filter((i) => i.status === 'Resolved' || i.status === 'Citizen Verified').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 space-y-8 select-none">
      <PageHeader
        title="Municipal Work Order & Dispatch Console"
        subtitle="Official municipal engineer portal to update road repair stages, upload proof of work, and dispatch asphalt crews."
        backHref="/"
        backLabel="Back to Map"
        badge={
          <span className="px-3 py-1 rounded-xl bg-orange-500/10 text-orange-400 text-xs font-black border border-orange-500/30 flex items-center gap-1.5">
            <HardHat className="w-3.5 h-3.5" />
            <span>Engineer Operations</span>
          </span>
        }
        rightAction={
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all issues and timestamps to default state?')) {
                resetToFactoryDemoData();
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-extrabold text-slate-700 shadow-xs transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo Data</span>
          </button>
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-left">
        
        {/* Sleek Linear-Style Stat Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Total Work Orders
            </span>
            <p className="text-2xl font-black text-[#0F294A]">{issues.length}</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
              In Execution / Crew Dispatched
            </span>
            <p className="text-2xl font-black text-[#F97316]">{inProgressCount}</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
              SLA Overdue Escalations
            </span>
            <p className="text-2xl font-black text-red-600">{overdueCount}</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Resolved & Verified
            </span>
            <p className="text-2xl font-black text-emerald-600">{resolvedCount}</p>
          </div>

        </div>

        {/* Clean Filter Command Bar */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search docket #, road name, or ward..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
            />
          </div>

          {/* Segmented Controls for Region */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1.5 rounded-2xl text-xs font-extrabold w-full md:w-auto">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-[#0F294A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('punjab')}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                filterMode === 'punjab'
                  ? 'bg-[#0F294A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>Punjab & LPU</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('urban')}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                filterMode === 'urban'
                  ? 'bg-[#0F294A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Urban</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('rural')}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                filterMode === 'rural'
                  ? 'bg-[#0F294A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trees className="w-3.5 h-3.5 text-emerald-400" />
              <span>Rural</span>
            </button>
          </div>

          {/* Status Select Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 cursor-pointer focus:outline-none"
            >
              <option value="All">All Workflow Stages</option>
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* High-Density Work Order Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                <tr>
                  <th className="py-4 px-5">Ticket ID</th>
                  <th className="py-4 px-5">Road & Defect</th>
                  <th className="py-4 px-5">Jurisdiction / Ward</th>
                  <th className="py-4 px-5">Workflow State</th>
                  <th className="py-4 px-5">SLA SLA State</th>
                  <th className="py-4 px-5 text-right">Dispatch Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* ID */}
                    <td className="py-4 px-5 font-mono font-bold text-slate-800">
                      <span className="bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-lg">
                        #{issue.id}
                      </span>
                    </td>

                    {/* Road Title */}
                    <td className="py-4 px-5 max-w-xs space-y-0.5">
                      <p className="font-extrabold text-slate-900 text-xs truncate">{issue.title}</p>
                      <p className="text-[11px] font-medium text-slate-500 truncate">{issue.address}</p>
                    </td>

                    {/* Ward / Dept */}
                    <td className="py-4 px-5">
                      <span className="font-bold text-slate-800 block">{issue.wardOrVillage}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{issue.assignedDepartment}</span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-5">
                      <StatusBadge status={issue.status} />
                    </td>

                    {/* SLA State */}
                    <td className="py-4 px-5">
                      {issue.isOverdue ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 font-extrabold border border-red-200 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                          <span>Breached</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-200 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          <span>Active SLA</span>
                        </span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(issue)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F294A] hover:bg-[#123C69] text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-orange-400" />
                        <span>Update Status</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status Update Modal Dialog */}
        <AnimatePresence>
          {editingIssue && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 text-left"
              >
                
                <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                      Docket #{editingIssue.id}
                    </span>
                    <h3 className="text-xl font-black text-[#0F294A] mt-1.5">
                      Dispatch Action & Status Log
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingIssue(null)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
                  
                  {/* Select Status */}
                  <div className="space-y-1.5">
                    <label className="font-extrabold text-[#0F294A] uppercase tracking-wider text-[11px] block">
                      Workflow Stage *
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as IssueStatus)}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-extrabold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 cursor-pointer"
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Engineer Note */}
                  <div className="space-y-1.5">
                    <label className="font-extrabold text-[#0F294A] uppercase tracking-wider text-[11px] block">
                      Engineer Field Note / Dispatch Log
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Hot mix asphalt compaction roller leveling completed at 10:30 AM."
                      value={newAdminNote}
                      onChange={(e) => setNewAdminNote(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
                    />
                  </div>

                  {/* Repair Proof URL (If resolving) */}
                  {(newStatus === 'Resolved' || newStatus === 'Citizen Verified') && (
                    <div className="space-y-2.5 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                      <label className="font-extrabold text-emerald-950 uppercase tracking-wider text-[11px] block">
                        Attach Repair Proof Photo URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newRepairProofUrl}
                        onChange={(e) => setNewRepairProofUrl(e.target.value)}
                        className="w-full p-3 bg-white border border-emerald-300 rounded-xl text-xs font-medium text-slate-800"
                      />

                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] font-bold text-emerald-800">Quick Samples:</span>
                        {SAMPLE_REPAIR_PROOFS.map((url, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setNewRepairProofUrl(url)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-200 text-emerald-950 text-[10px] font-bold hover:bg-emerald-300 transition-colors cursor-pointer"
                          >
                            Proof {idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingIssue(null)}
                      className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-2xl bg-[#F97316] hover:bg-[#ea580c] text-white font-black shadow-md transition-all cursor-pointer"
                    >
                      Save Dispatch Log
                    </button>
                  </div>

                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};

export default AdminDemoPage;
