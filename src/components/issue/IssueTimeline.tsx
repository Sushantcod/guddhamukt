import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Send, 
  HardHat, 
  Flame, 
  ShieldAlert, 
  FileCheck2, 
  Star,
  UserCheck
} from 'lucide-react';
import { TimelineEvent, IssueStatus } from '../../types';

interface IssueTimelineProps {
  timeline: TimelineEvent[];
  currentStatus: IssueStatus;
  userRating?: {
    score: number;
    feedback?: string;
    ratedAt: string;
  };
}

export const IssueTimeline: React.FC<IssueTimelineProps> = ({
  timeline,
  currentStatus,
  userRating,
}) => {
  const getStageIcon = (stage: string, isCompleted: boolean, isCurrent?: boolean) => {
    if (stage === 'Overdue Escalation') {
      return <ShieldAlert className="w-4 h-4 text-red-600" />;
    }
    if (stage === 'Citizen Verified' || (stage === 'Resolved' && isCompleted)) {
      return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    }
    if (stage === 'Repair In Progress') {
      return <Flame className="w-4 h-4 text-orange-500 animate-pulse" />;
    }
    if (stage === 'Inspection Scheduled') {
      return <HardHat className="w-4 h-4 text-amber-600" />;
    }
    if (stage === 'Acknowledged') {
      return <FileCheck2 className="w-4 h-4 text-indigo-600" />;
    }
    if (stage === 'Routed') {
      return <Clock className="w-4 h-4 text-blue-600" />;
    }
    return <Send className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-[#123C69] text-base">Resolution Audit Timeline</h3>
          <p className="text-xs text-slate-500">Immutable civic record of authority actions and field events</p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          {timeline.filter((t) => t.isCompleted).length} of {timeline.length} Steps
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {timeline.map((event, index) => {
          const isCompleted = event.isCompleted;
          const isCurrent = event.isCurrent;
          const isEscalation = event.stage === 'Overdue Escalation';

          return (
            <div key={event.id || index} className="relative group">
              {/* Dot Icon on Timeline Line */}
              <div
                className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center -translate-x-1/2 border-2 transition-all ${
                  isEscalation
                    ? 'bg-red-50 border-red-500 text-red-600'
                    : isCompleted
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                    : isCurrent
                    ? 'bg-blue-50 border-blue-600 text-blue-600 ring-4 ring-blue-100'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                {getStageIcon(event.stage, isCompleted, isCurrent)}
              </div>

              {/* Event Content Box */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  isEscalation
                    ? 'bg-red-50/70 border-red-200'
                    : isCurrent
                    ? 'bg-blue-50/50 border-blue-200 shadow-2xs'
                    : isCompleted
                    ? 'bg-slate-50/70 border-slate-200'
                    : 'bg-white border-dashed border-slate-200 opacity-60'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <span
                    className={`text-xs font-extrabold tracking-tight ${
                      isEscalation ? 'text-red-700' : isCurrent ? 'text-blue-900' : 'text-slate-800'
                    }`}
                  >
                    {event.title}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{event.timestamp}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {event.description}
                </p>

                {event.actor && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                    <UserCheck className="w-3 h-3 text-[#123C69]" />
                    <span>Actor: {event.actor}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* User 5-star Rating Verification if Resolved */}
        {userRating && (
          <div className="relative group">
            <div className="absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center -translate-x-1/2 border-2 bg-amber-50 border-amber-500 text-amber-600">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            </div>
            <div className="p-3.5 rounded-xl border bg-amber-50/70 border-amber-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-extrabold text-amber-900">
                  Citizen Verification & Quality Rating
                </span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= userRating.score
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {userRating.feedback && (
                <p className="text-xs text-amber-900/80 italic">&ldquo;{userRating.feedback}&rdquo;</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
