import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Users, 
  FileDown, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertTriangle, 
  Share2, 
  Building2, 
  Trees, 
  CheckCircle2, 
  Star,
  HardHat
} from 'lucide-react';
import { useIssues } from '../hooks/useIssues';
import { MOCK_ROAD_CONTRACTS } from '../data/mockRoadContracts';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge, SeverityBadge, CategoryBadge, SimulatedRouteBadge } from '../components/issue/StatusBadge';
import { IssueTimeline } from '../components/issue/IssueTimeline';
import { AccountabilityCard } from '../components/issue/AccountabilityCard';
import { AuthorityChain } from '../components/issue/AuthorityChain';
import { EscalationCountdown } from '../components/issue/EscalationCountdown';
import { generateComplaintPdf, copyComplaintTextToClipboard } from '../utils/generateComplaintPdf';
import { formatDateString, formatDateTimeString } from '../utils/issueHelpers';
import { EmptyState } from '../components/common/EmptyState';

export const IssueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getIssueById, confirmIssue, rateIssueResolution, userConfirmedIds } = useIssues();

  const issue = id ? getIssueById(id) : undefined;
  const [activePhotoTab, setActivePhotoTab] = useState<'initial' | 'proof'>('initial');
  const [copied, setCopied] = useState(false);
  const [userRatingScore, setUserRatingScore] = useState<number>(5);
  const [userRatingFeedback, setUserRatingFeedback] = useState<string>('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  if (!issue) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-12">
        <EmptyState
          title="Issue Not Found"
          description={`No civic complaint was found matching tracking ID "${id}".`}
          actionText="Back to Issue Map"
          actionHref="/"
        />
      </div>
    );
  }

  const contract = issue.roadContractId ? MOCK_ROAD_CONTRACTS[issue.roadContractId] : undefined;
  const isConfirmedByUser = userConfirmedIds.includes(issue.id);
  const isResolved = issue.status === 'Resolved' || issue.status === 'Citizen Verified';

  const handleCopyText = () => {
    copyComplaintTextToClipboard(issue, contract);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rateIssueResolution(issue.id, userRatingScore, userRatingFeedback);
    setRatingSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Page Header */}
      <PageHeader
        title={issue.title}
        subtitle={`Tracking Reference ID: #${issue.id} • ${issue.wardOrVillage}`}
        backHref="/"
        backLabel="Back to Map"
        badge={
          <div className="flex items-center gap-1.5">
            <StatusBadge status={issue.status} />
            <SeverityBadge severity={issue.severity} />
          </div>
        }
        rightAction={
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs transition-all"
              title="Copy formatted grievance dossier to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Dossier'}</span>
            </button>

            <button
              onClick={() => generateComplaintPdf(issue, contract)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#123C69] hover:bg-[#00264b] text-white text-xs font-bold shadow-2xs transition-all"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* SLA Countdown & Escalation Banner */}
        <EscalationCountdown issue={issue} contract={contract} />

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Visuals & Core Dossier (7 Cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Visual Evidence Section with Before/After Support */}
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
              <div className="relative h-72 sm:h-96 w-full bg-slate-900">
                <img
                  src={activePhotoTab === 'proof' && issue.repairProofUrl ? issue.repairProofUrl : issue.photoUrl}
                  alt={issue.title}
                  className="w-full h-full object-cover"
                />

                {/* Overlay Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-white font-mono text-xs font-bold">
                    #{issue.id}
                  </span>
                  <CategoryBadge category={issue.category} />
                  <SimulatedRouteBadge status={issue.simulatedRouteStatus} />
                </div>

                {/* Before / After Photo Toggle if Resolved */}
                {issue.repairProofUrl && (
                  <div className="absolute bottom-4 right-4 flex items-center bg-black/70 backdrop-blur-md p-1 rounded-xl border border-white/20">
                    <button
                      onClick={() => setActivePhotoTab('initial')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        activePhotoTab === 'initial'
                          ? 'bg-white text-slate-900'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Reported Hazard
                    </button>
                    <button
                      onClick={() => setActivePhotoTab('proof')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        activePhotoTab === 'proof'
                          ? 'bg-emerald-500 text-white'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      ✓ Repair Proof Evidence
                    </button>
                  </div>
                )}
              </div>

              {/* Citizen Confirmation Action Bar */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-[#123C69] block">
                      {issue.confirmationCount} Citizens Have Verified This Road Hazard
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Multi-citizen confirmations escalate municipal queue priority
                    </span>
                  </div>
                </div>

                {!isResolved && (
                  <button
                    onClick={() => confirmIssue(issue.id)}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-xs ${
                      isConfirmedByUser
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-[#F97316] hover:bg-[#EA580C] text-white'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>{isConfirmedByUser ? '✓ You Confirmed This (+1)' : 'Still Unresolved? (+1 Confirm)'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Issue Description & Metadata Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <h3 className="font-extrabold text-[#123C69] text-base">Civic Incident Report Details</h3>

              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                {issue.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Exact Location & Address
                  </span>
                  <p className="font-bold text-slate-800 mt-0.5">{issue.address}</p>
                  {issue.landmark && (
                    <p className="text-slate-500 mt-0.5">Landmark: {issue.landmark}</p>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    GPS Coordinates
                  </span>
                  <p className="font-mono font-bold text-slate-800 mt-0.5">
                    {issue.latitude.toFixed(5)}° N, {issue.longitude.toFixed(5)}° E
                  </p>
                  <p className="text-slate-500 mt-0.5">Reported on: {formatDateTimeString(issue.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Road Contract & Tender Accountability Card */}
            {contract && <AccountabilityCard contract={contract} />}

            {/* Statutory Department & Escalation Chain */}
            <AuthorityChain issue={issue} />
          </div>

          {/* Right Column: Timeline & Action Modules (5 Cols) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Timeline */}
            <IssueTimeline
              timeline={issue.timeline}
              currentStatus={issue.status}
              userRating={issue.userRating}
            />

            {/* Rate Resolution Widget (If Resolved & not rated yet) */}
            {isResolved && !issue.userRating && !ratingSubmitted && (
              <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <h4 className="font-extrabold text-[#123C69] text-sm">
                    Citizen Quality Sign-Off
                  </h4>
                </div>
                <p className="text-xs text-slate-600">
                  Did the municipal team restore this road properly? Rate the repair quality:
                </p>

                <form onSubmit={handleRatingSubmit} className="space-y-3 pt-1">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        type="button"
                        key={score}
                        onClick={() => setUserRatingScore(score)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border transition-all ${
                          userRatingScore >= score
                            ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-2xs'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        ★ {score}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Optional feedback on bitumen quality or smoothness..."
                    value={userRatingFeedback}
                    onChange={(e) => setUserRatingFeedback(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />

                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all"
                  >
                    Submit Citizen Sign-Off & Verification
                  </button>
                </form>
              </div>
            )}

            {/* Quick Actions Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 shadow-sm">
              <h4 className="font-extrabold text-sm text-white">Actionable Citizen Tools</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empower your local resident welfare association or village council with formal complaint packets.
              </p>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => generateComplaintPdf(issue, contract)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download Formal Complaint PDF</span>
                </button>

                <button
                  onClick={handleCopyText}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Pre-Formatted Text'}</span>
                </button>

                <Link
                  to={`/track/${issue.id}`}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Open Tracking Console &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
