import React from 'react';
import { Clock, AlertTriangle, FileDown, ShieldAlert, ArrowRight } from 'lucide-react';
import { Issue, RoadContract } from '../../types';
import { generateComplaintPdf } from '../../utils/generateComplaintPdf';

interface EscalationCountdownProps {
  issue: Issue;
  contract?: RoadContract;
}

export const EscalationCountdown: React.FC<EscalationCountdownProps> = ({ issue, contract }) => {
  const isResolved = issue.status === 'Resolved' || issue.status === 'Citizen Verified';
  const isOverdue = issue.isOverdue || issue.simulatedRouteStatus === 'Overdue';
  const isEscalationReady = issue.simulatedRouteStatus === 'Escalation packet ready' || issue.isEscalated;

  if (isResolved) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-emerald-900 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
            ✓
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-emerald-950">Issue Successfully Resolved</h4>
            <p className="text-xs text-emerald-800">
              Closed within statutory SLA standard. Verified by citizens.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl p-5 border transition-all ${
        isEscalationReady
          ? 'bg-purple-50/80 border-purple-300'
          : isOverdue
          ? 'bg-red-50/80 border-red-300'
          : 'bg-blue-50/80 border-blue-200'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isEscalationReady
                ? 'bg-purple-600 text-white'
                : isOverdue
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            {isOverdue || isEscalationReady ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <Clock className="w-5 h-5" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4
                className={`font-extrabold text-sm ${
                  isEscalationReady
                    ? 'text-purple-950'
                    : isOverdue
                    ? 'text-red-950'
                    : 'text-blue-950'
                }`}
              >
                {isEscalationReady
                  ? 'Escalation Packet Ready for Public Representatives'
                  : isOverdue
                  ? 'SLA Breached: Escalation In Progress'
                  : 'Resolution SLA Timer Active'}
              </h4>
            </div>

            <p
              className={`text-xs ${
                isEscalationReady
                  ? 'text-purple-800'
                  : isOverdue
                  ? 'text-red-800'
                  : 'text-blue-800'
              }`}
            >
              {isEscalationReady
                ? 'Statutory SLA elapsed. A dossier has been prepared for MLA, MP & CMO grievance audit.'
                : isOverdue
                ? 'The assigned municipal division missed the statutory resolution window.'
                : `Target SLA Deadline: ${new Date(issue.slaDeadline).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`}
            </p>
          </div>
        </div>

        {/* CTA to Download Escalation PDF */}
        <button
          onClick={() => generateComplaintPdf(issue, contract)}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 ${
            isEscalationReady
              ? 'bg-purple-700 hover:bg-purple-800 text-white'
              : isOverdue
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-[#123C69] hover:bg-[#00264b] text-white'
          }`}
        >
          <FileDown className="w-4 h-4" />
          <span>Download Escalation Packet (PDF)</span>
        </button>
      </div>
    </div>
  );
};
