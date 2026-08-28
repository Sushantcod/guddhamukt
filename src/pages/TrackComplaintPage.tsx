import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  FileDown, 
  Copy, 
  Check, 
  Clock, 
  AlertTriangle, 
  Building2, 
  ShieldAlert, 
  ArrowRight,
  HelpCircle,
  FileText,
  ShieldCheck,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
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

  useEffect(() => {
    if (urlId) {
      setSelectedIssueId(urlId);
      setSearchInput(urlId);
    }
  }, [urlId]);

  const issue = getIssueById(selectedIssueId);
  const contract = issue?.roadContractId ? MOCK_ROAD_CONTRACTS[issue.roadContractId] : undefined;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const cleanId = searchInput.trim().toUpperCase().replace('#', '');
      setSelectedIssueId(cleanId);
      navigate(`/track/${cleanId}`);
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
    <div className="min-h-screen bg-[#F8FAFC] pb-16 space-y-6">
      <PageHeader
        title="Civic Grievance Tracking & SLA Audit"
        subtitle="Track municipal response status, verify road contractor liability, and generate legal escalation dossiers."
        backHref="/"
        backLabel="Back to Map"
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Search Bar & Sample ID Picker */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Complaint Tracking ID (e.g. CP-PB-101, CP-90210)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-extrabold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-[#F97316] hover:bg-[#ea580c] text-white font-extrabold text-xs sm:text-sm rounded-2xl transition-all shadow-md cursor-pointer shrink-0"
            >
              Track Grievance
            </button>
          </form>

          {/* Quick Demo Sample Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-extrabold text-[11px] uppercase tracking-wider">
              Sample Tracking IDs:
            </span>
            {SAMPLE_SEARCH_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setSearchInput(id);
                  setSelectedIssueId(id);
                  navigate(`/track/${id}`);
                }}
                className={`font-mono text-xs font-black px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  selectedIssueId === id
                    ? 'bg-[#0F294A] text-orange-400 border-[#F97316]/50 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                #{id}
              </button>
            ))}
          </div>
        </div>

        {/* Search Result Body */}
        {!issue ? (
          <EmptyState
            title={`No Grievance Docket Found for #${selectedIssueId}`}
            description="Please check the tracking number or select one of the sample tickets above to inspect the simulated civic routing pipeline."
            actionText="Browse Road Issues Map"
            actionHref="/"
          />
        ) : (
          <div className="space-y-6">
            
            {/* Status Highlight Banner */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                      #{issue.id}
                    </span>
                    <CategoryBadge category={issue.category} />
                    <SeverityBadge severity={issue.severity} />
                    {issue.id.includes('PB') && (
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-800 text-[10px] font-black">
                        Punjab LPU Region
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0F294A]">{issue.title}</h2>
                  <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                    <span>{issue.address} • <strong>{issue.wardOrVillage}</strong></span>
                  </p>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    Simulated Route Status
                  </span>
                  <SimulatedRouteBadge status={issue.simulatedRouteStatus} />
                </div>
              </div>

              {/* Truthful Civic Routing Notice */}
              <div className="p-4 bg-blue-50/80 border border-blue-200/80 rounded-2xl text-xs text-slate-700 flex items-start gap-3 leading-relaxed">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-blue-950">Statutory Demonstration Notice</p>
                  <p className="mt-0.5 text-blue-900 font-medium">
                    This platform simulates the official municipal dispatch route according to Indian Urban Local Body (ULB) and Rural PRD service-level agreements. You can download the generated formal complaint dossier below for submission to official civic grievance desks.
                  </p>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-extrabold uppercase text-[10px] tracking-wider block">
                    Assigned Municipal Department
                  </span>
                  <span className="font-extrabold text-sm text-[#0F294A]">{issue.assignedDepartment}</span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied to Clipboard' : 'Copy Complaint Text'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => generateComplaintPdf(issue, contract)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#ea580c] text-white text-xs font-black transition-all shadow-md cursor-pointer"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>Download Official Packet (PDF)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Grid of Timeline & Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: SLA Countdown & Details */}
              <div className="lg:col-span-5 space-y-6 text-left">
                
                {/* Civic SLA Card */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-black text-[#0F294A] text-base flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#F97316]" />
                      <span>Statutory SLA Timeline</span>
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
                      SLA Active
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs font-medium">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex justify-between items-center">
                      <span className="text-slate-500 font-semibold">Reported At:</span>
                      <span className="font-extrabold text-slate-800">{formatDateTimeString(issue.createdAt)}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex justify-between items-center">
                      <span className="text-slate-500 font-semibold">Statutory SLA Window:</span>
                      <span className="font-extrabold text-[#F97316]">
                        {issue.severity === 'Immediate Danger' ? '24 Hours' : issue.severity === 'High' ? '48 Hours' : '72 Hours'}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex justify-between items-center">
                      <span className="text-slate-500 font-semibold">Current Resolution Stage:</span>
                      <span className="font-black text-[#0F294A]">{issue.status}</span>
                    </div>
                  </div>

                  <Link
                    to={`/issues/${issue.id}`}
                    className="w-full py-3 bg-[#0F294A] hover:bg-[#123C69] text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <span>View Tender & Contractor Details</span>
                    <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                  </Link>
                </div>

                {/* Reporter & Location Card */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3">
                  <h4 className="font-black text-xs text-slate-400 uppercase tracking-wider">
                    Grievance Metadata
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-medium">Logged By:</span>
                      <span className="font-extrabold text-slate-800">{issue.reporterName || 'Citizen'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-medium">Confirmations:</span>
                      <span className="font-extrabold text-emerald-600">{issue.confirmationCount} Local Residents</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-500 font-medium">Contract ID:</span>
                      <span className="font-mono font-bold text-slate-700">{issue.roadContractId || 'RC-PB-GEN'}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Live Interactive Audit Timeline */}
              <div className="lg:col-span-7">
                <IssueTimeline
                  timeline={issue.timeline}
                  currentStatus={issue.status}
                  userRating={issue.userRating}
                />
              </div>

            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default TrackComplaintPage;
