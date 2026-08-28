import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  FileDown, 
  Copy, 
  Check, 
  ExternalLink, 
  Clock, 
  AlertTriangle, 
  Building2, 
  Trees, 
  ShieldAlert, 
  ArrowRight,
  HelpCircle,
  FileText
} from 'lucide-react';
import { useIssues } from '../hooks/useIssues';
import { MOCK_ROAD_CONTRACTS } from '../data/mockRoadContracts';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge, SeverityBadge, CategoryBadge, SimulatedRouteBadge } from '../components/issue/StatusBadge';
import { IssueTimeline } from '../components/issue/IssueTimeline';
import { SourceBadge } from '../components/common/SourceBadge';
import { generateComplaintPdf, copyComplaintTextToClipboard } from '../utils/generateComplaintPdf';
import { formatDateTimeString } from '../utils/issueHelpers';
import { EmptyState } from '../components/common/EmptyState';

const SAMPLE_SEARCH_IDS = ['CP-90210', 'CP-2023-8942', 'CP-RUR-501', 'CP-90214', 'CP-90217'];

export const TrackComplaintPage: React.FC = () => {
  const { id: urlId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { issues, getIssueById } = useIssues();

  const [searchInput, setSearchInput] = useState<string>(urlId || '');
  const [selectedIssueId, setSelectedIssueId] = useState<string>(urlId || 'CP-90210');
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
        subtitle="Track municipal response status, verify road contractor liability, and generate escalation dossiers."
        backHref="/"
        backLabel="Back to Map"
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Search Bar & Sample ID Picker */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Complaint Tracking ID (e.g. CP-90210, CP-2023-8942)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#123C69]/20"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#123C69] hover:bg-[#00264b] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xs"
            >
              Track Docket
            </button>
          </form>

          {/* Quick Demo Sample Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">
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
                className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg border transition-all ${
                  selectedIssueId === id
                    ? 'bg-blue-50 text-blue-900 border-blue-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
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
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      #{issue.id}
                    </span>
                    <CategoryBadge category={issue.category} />
                    <SeverityBadge severity={issue.severity} />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#123C69]">{issue.title}</h2>
                  <p className="text-xs text-slate-500">{issue.address} • {issue.wardOrVillage}</p>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Simulated Route Status
                  </span>
                  <SimulatedRouteBadge status={issue.simulatedRouteStatus} />
                </div>
              </div>

              {/* Truthful Civic Routing Notice */}
              <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-slate-700 flex items-start gap-2.5 leading-relaxed">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-950">Statutory Demonstration Notice</p>
                  <p className="mt-0.5 text-blue-900">
                    This platform simulates the official municipal dispatch route according to Indian Urban Local Body (ULB) and Rural PRD service-level agreements. You can download the generated formal complaint dossier below for submission to official civic grievance desks.
                  </p>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Assigned Department:</span>
                  <span className="font-bold text-slate-800">{issue.assignedDepartment}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyText}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Text'}</span>
                  </button>

                  <button
                    onClick={() => generateComplaintPdf(issue, contract)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-extrabold transition-colors shadow-xs"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Download Official Packet (PDF)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Grid of Timeline & Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
                  <h3 className="font-extrabold text-[#123C69] text-base">Civic SLA Status</h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                      <span className="text-slate-500 font-medium">Reported At:</span>
                      <span className="font-bold text-slate-800">{formatDateTimeString(issue.createdAt)}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                      <span className="text-slate-500 font-medium">Statutory SLA Window:</span>
                      <span className="font-bold text-slate-800">
                        {issue.severity === 'Immediate Danger' ? '24 Hours' : issue.severity === 'High' ? '48 Hours' : '72 Hours'}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                      <span className="text-slate-500 font-medium">Current Stage:</span>
                      <span className="font-extrabold text-[#123C69]">{issue.status}</span>
                    </div>
                  </div>

                  <Link
                    to={`/issues/${issue.id}`}
                    className="w-full py-2.5 bg-[#123C69] hover:bg-[#00264b] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xs"
                  >
                    <span>View Complete Issue & Tender Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div>
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
