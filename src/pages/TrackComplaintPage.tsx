import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  FileDown, 
  Copy, 
  Check, 
  Clock, 
  ArrowRight,
  HelpCircle,
  MapPin,
  Building2,
  Users,
  FileCheck,
  Radio,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useIssues } from '../hooks/useIssues';
import { MOCK_ROAD_CONTRACTS } from '../data/mockRoadContracts';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge, SeverityBadge, CategoryBadge, SimulatedRouteBadge } from '../components/issue/StatusBadge';
import { IssueTimeline } from '../components/issue/IssueTimeline';
import { generateComplaintPdf, copyComplaintTextToClipboard } from '../utils/generateComplaintPdf';
import { formatDateTimeString } from '../utils/issueHelpers';
import { EmptyState } from '../components/common/EmptyState';

const SAMPLE_SEARCH_IDS = ['CP-PB-101', 'CP-90210', 'CP-2023-8942', 'CP-RUR-501', 'CP-PB-102'];

export const TrackComplaintPage: React.FC = () => {
  const { id: urlId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getIssueById } = useIssues();

  const [searchInput, setSearchInput] = useState<string>(urlId || '');
  const [selectedIssueId, setSelectedIssueId] = useState<string>(urlId || 'CP-PB-101');
  const [copied, setCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const triggerLoading = (newId: string) => {
    setIsLoading(true);
    setSelectedIssueId(newId);
    navigate(`/track/${newId}`);
    setTimeout(() => {
      setIsLoading(false);
    }, 450);
  };

  useEffect(() => {
    if (urlId && urlId !== selectedIssueId) {
      triggerLoading(urlId);
    }
  }, [urlId]);

  const issue = getIssueById(selectedIssueId);
  const contract = issue?.roadContractId ? MOCK_ROAD_CONTRACTS[issue.roadContractId] : undefined;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const cleanId = searchInput.trim().toUpperCase().replace('#', '');
      triggerLoading(cleanId);
    }
  };

  const handleCopyText = () => {
    if (issue) {
      copyComplaintTextToClipboard(issue, contract);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 space-y-8">
      <PageHeader
        title="Civic Grievance Tracking & Resolution Audit"
        subtitle="Track real-time municipal dispatch, verify road contractor liability, and inspect the step-by-step resolution timeline."
        backHref="/"
        backLabel="Back to Map"
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Full-Width Search & Quick ID Selector */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Complaint Docket Number (e.g. CP-PB-101, CP-90210)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-extrabold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-4 bg-[#F97316] hover:bg-[#ea580c] text-white font-black text-sm rounded-2xl transition-all shadow-md cursor-pointer shrink-0 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <span>Track Docket</span>
              )}
            </button>
          </form>

          {/* Quick Demo Sample Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-extrabold text-[11px] uppercase tracking-wider">
              Sample Tracking IDs:
            </span>
            {SAMPLE_SEARCH_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setSearchInput(id);
                  triggerLoading(id);
                }}
                className={`font-mono text-xs font-black px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  selectedIssueId === id
                    ? 'bg-[#0F294A] text-orange-400 border-[#F97316]/50 shadow-xs scale-105'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                #{id}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Loading State or Search Result Body */}
        {isLoading ? (
          /* CIVIC RADAR SCANNER LOADING ANIMATION */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center shadow-sm space-y-6 flex flex-col items-center justify-center min-h-[350px]"
          >
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center animate-ping absolute" />
              <div className="w-16 h-16 rounded-full bg-[#0F294A] text-orange-400 flex items-center justify-center shadow-xl relative z-10">
                <Radio className="w-8 h-8 animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-1 max-w-sm">
              <h3 className="font-black text-[#0F294A] text-lg">
                Querying Municipal Docket #{selectedIssueId}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Fetching statutory SLA timeline, GPS coordinates, and ward engineer logs...
              </p>
            </div>

            {/* Skeleton Pulse Bar */}
            <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-400 to-[#F97316] rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        ) : !issue ? (
          <EmptyState
            title={`No Grievance Docket Found for #${selectedIssueId}`}
            description="Please check the tracking number or select one of the sample tickets above to inspect the simulated civic routing pipeline."
            actionText="Browse Road Issues Map"
            actionHref="/"
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-8"
            >
              
              {/* Full-Width Docket Header Banner */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6 text-left">
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs font-black text-slate-800 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl">
                        #{issue.id}
                      </span>
                      <CategoryBadge category={issue.category} />
                      <SeverityBadge severity={issue.severity} />
                      {issue.id.includes('PB') && (
                        <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs font-black">
                          Punjab LPU Region
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#0F294A]">{issue.title}</h2>
                    <p className="text-xs sm:text-sm font-semibold text-slate-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#F97316] shrink-0" />
                      <span>{issue.address} • <strong>{issue.wardOrVillage}</strong></span>
                    </p>
                  </div>

                  <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                      Simulated Route Status
                    </span>
                    <SimulatedRouteBadge status={issue.simulatedRouteStatus} />
                  </div>
                </div>

                {/* Stat Summary Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      Assigned Authority
                    </span>
                    <p className="font-black text-xs sm:text-sm text-[#0F294A] truncate">
                      {issue.assignedDepartment}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      Statutory SLA Target
                    </span>
                    <p className="font-black text-xs sm:text-sm text-[#F97316]">
                      {issue.severity === 'Immediate Danger' ? '24 Hours Window' : issue.severity === 'High' ? '48 Hours Window' : '72 Hours Window'}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      Citizen Confirmations
                    </span>
                    <p className="font-black text-xs sm:text-sm text-emerald-700">
                      {issue.confirmationCount} Local Residents
                    </p>
                  </div>

                </div>

                {/* Action Buttons Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  
                  <Link
                    to={`/issues/${issue.id}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#0F294A] hover:bg-[#123C69] text-white text-xs font-black transition-all shadow-md cursor-pointer"
                  >
                    <span>View Full Contract & Tender Dossier</span>
                    <ArrowRight className="w-4 h-4 text-orange-400" />
                  </Link>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleCopyText}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied' : 'Copy Text'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => generateComplaintPdf(issue, contract)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#F97316] hover:bg-[#ea580c] text-white text-xs font-black transition-all shadow-md cursor-pointer"
                    >
                      <FileDown className="w-4 h-4" />
                      <span>Download Official PDF Packet</span>
                    </button>
                  </div>

                </div>

              </div>

              {/* FULL SIZE ALTERNATING ZIG-ZAG TIMELINE TREE WITH SCROLL ANIMATIONS */}
              <div className="w-full">
                <IssueTimeline
                  timeline={issue.timeline}
                  currentStatus={issue.status}
                  userRating={issue.userRating}
                />
              </div>

            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

export default TrackComplaintPage;
