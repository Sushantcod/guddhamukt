import React from 'react';
import { 
  Building2, 
  ExternalLink, 
  ShieldAlert, 
  Siren, 
  UserCheck, 
  Clock,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { Issue } from '../../types';
import { getEscalationChainForIssue } from '../../utils/escalationHelpers';
import { SourceBadge } from '../common/SourceBadge';

interface AuthorityChainProps {
  issue: Issue;
}

export const AuthorityChain: React.FC<AuthorityChainProps> = ({ issue }) => {
  const chainData = getEscalationChainForIssue(issue);
  const { actualResponsibleDept, escalationNodes, hasPoliceEmergencyRoute, policeAdvisory } = chainData;

  return (
    <div className="space-y-6">
      {/* 1. ACTUAL STATUTORY RESPONSIBLE DEPARTMENT CARD */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm border-t-4 border-[#2563EB]">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-blue-50 text-[#123C69] flex items-center justify-center">
              <Building2 className="w-4 h-4 text-[#123C69]" />
            </div>
            <div>
              <h3 className="font-bold text-[#123C69] text-base">
                Primary Statutory Department
              </h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Direct statutory engineering wing responsible for physical road repairs
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[11px] font-bold border border-blue-200">
            Active Work Queue
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
              Department Name & Subdivision
            </span>
            <p className="font-bold text-[#123C69] text-sm">{actualResponsibleDept.name}</p>
            <p className="text-slate-600 font-medium mt-0.5">{actualResponsibleDept.division}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 bg-white rounded-md border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Executive Mandate
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">
                {actualResponsibleDept.description}
              </p>
            </div>

            <div className="p-3 bg-white rounded-md border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Statutory Citizen SLA
              </span>
              <p className="text-slate-800 font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#F97316] shrink-0" />
                {actualResponsibleDept.slaStandard}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Mandatory resolution timeframe under Citizens Charter Act.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px]">
            <span className="text-slate-500 font-medium">
              Mode: <strong className="text-slate-800 capitalize">{issue.mode} Civic Architecture</strong>
            </span>
            <a
              href={actualResponsibleDept.officialPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#123C69] hover:text-[#F97316] font-bold transition-colors"
            >
              <span>Visit Official Works Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. EMERGENCY POLICE / IPS ROUTE (APPEARS ONLY IF IMMEDIATE DANGER) */}
      {hasPoliceEmergencyRoute && policeAdvisory && (
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-md bg-[#DC2626] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Siren className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-red-900 text-base">
                    Immediate Danger: Police Safety Alert Dispatched
                  </h3>
                  <SourceBadge type="demo" />
                </div>
                <span className="px-2 py-0.5 rounded bg-[#DC2626] text-white font-mono text-[10px] font-bold uppercase">
                  HIGH HAZARD
                </span>
              </div>

              <p className="text-xs text-red-800 font-semibold leading-relaxed">
                {policeAdvisory.instructions}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs pt-1 text-red-900">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldAlert className="w-4 h-4 text-red-700" />
                  <span>Assigned Unit: {policeAdvisory.unit}</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold bg-white px-2.5 py-1 rounded border border-red-200">
                  <PhoneCall className="w-3.5 h-3.5 text-red-600" />
                  <span>Emergency Helpline: {policeAdvisory.contactNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CITIZEN ESCALATION CHAIN CARD */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-orange-50 text-[#F97316] flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#123C69] text-base">
                Public Authority Escalation Chain
              </h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Progressive hierarchical accountability trail for overdue or unaddressed road complaints
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            7 Tier Governance Path
          </span>
        </div>

        {/* Visual Escalation Nodes List */}
        <div className="space-y-2 pt-1">
          {escalationNodes.map((node) => {
            const isCompleted = node.status === 'Completed';
            const isCurrent = node.status === 'Current';
            const isEscalated = node.status === 'Escalated';

            return (
              <div
                key={node.level}
                className={`p-3 rounded-md border flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
                  isEscalated
                    ? 'bg-red-50 border-l-4 border-l-[#DC2626] border-red-200'
                    : isCurrent
                    ? 'bg-blue-50 border-l-4 border-l-[#2563EB] border-blue-200'
                    : isCompleted
                    ? 'bg-slate-50 border-l-4 border-l-[#15803D] border-slate-200'
                    : 'bg-white border-l-4 border-l-slate-200 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isEscalated
                        ? 'bg-[#DC2626] text-white'
                        : isCurrent
                        ? 'bg-[#2563EB] text-white'
                        : isCompleted
                        ? 'bg-[#15803D] text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : node.level}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{node.title}</span>
                      <span className="text-[10px] text-slate-500 font-medium">({node.designation})</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">{node.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isEscalated
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : isCurrent
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isEscalated
                      ? 'Escalation Ready'
                      : isCurrent
                      ? 'Active Tier'
                      : isCompleted
                      ? 'Notified'
                      : 'Pending'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-2.5 bg-red-50 border border-red-200 rounded-md text-[10px] text-red-700 font-bold text-center uppercase tracking-wide">
          Automatic escalation packet triggers upon SLA expiry
        </div>
      </div>
    </div>
  );
};

