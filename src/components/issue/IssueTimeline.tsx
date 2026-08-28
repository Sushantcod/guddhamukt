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
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-8 select-none">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 text-left">
        <div>
          <h3 className="font-black text-[#0F294A] text-lg sm:text-xl">Resolution Audit Timeline</h3>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Step-by-step civic routing & field event tracking record
          </p>
        </div>
        <span className="self-start sm:self-auto text-xs font-extrabold px-3 py-1.5 rounded-full bg-[#0F294A] text-orange-400 border border-slate-700 shadow-xs">
          {timeline.filter((t) => t.isCompleted).length} of {timeline.length} Steps Completed
        </span>
      </div>

      {/* Alternating Left / Right Timeline Tree Container */}
      <div className="relative">
        
        {/* Central Vertical Spine Line (Desktop) */}
        <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-slate-200 rounded-full" />
        
        {/* Mobile Left Vertical Spine Line */}
        <div className="md:hidden absolute left-4 top-4 bottom-4 w-1 bg-slate-200 rounded-full" />

        <div className="space-y-8">
          {timeline.map((event, index) => {
            const isCompleted = event.isCompleted;
            const isCurrent = event.isCurrent;
            const isEscalation = event.stage === 'Overdue Escalation';
            const isEven = index % 2 === 0; // Even index = Left side on desktop, Odd = Right side

            return (
              <div
                key={event.id || index}
                className="relative flex flex-col md:flex-row items-center"
              >
                
                {/* Central Node Badge Icon */}
                <div
                  className={`absolute left-4 md:left-1/2 top-0 -translate-x-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center border-2 shadow-md transition-all ${
                    isEscalation
                      ? 'bg-red-100 border-red-500 text-red-600 scale-110'
                      : isCompleted
                      ? 'bg-emerald-100 border-emerald-600 text-emerald-700'
                      : isCurrent
                      ? 'bg-blue-100 border-blue-600 text-blue-700 ring-4 ring-blue-100 scale-110'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  {getStageIcon(event.stage, isCompleted, isCurrent)}
                </div>

                {/* Alternating Left Card (Desktop) */}
                <div
                  className={`pl-12 md:pl-0 w-full md:w-[calc(50%-2.5rem)] ${
                    isEven ? 'md:mr-auto md:text-right' : 'md:ml-auto md:text-left'
                  }`}
                >
                  <div
                    className={`p-5 rounded-2xl border transition-all shadow-xs hover:shadow-md text-left ${
                      isEscalation
                        ? 'bg-red-50/90 border-red-300'
                        : isCurrent
                        ? 'bg-blue-50/90 border-blue-300 ring-2 ring-blue-400/20'
                        : isCompleted
                        ? 'bg-white border-slate-200/90'
                        : 'bg-slate-50/60 border-dashed border-slate-200 opacity-70'
                    }`}
                  >
                    {/* Step Number & Timestamp Header */}
                    <div className={`flex flex-wrap items-center justify-between gap-2 mb-2 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 font-mono">
                        Step {index + 1}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-500">{event.timestamp}</span>
                    </div>

                    {/* Step Title */}
                    <h4
                      className={`text-sm sm:text-base font-black tracking-tight mb-1 ${
                        isEscalation ? 'text-red-900' : isCurrent ? 'text-blue-950' : 'text-[#0F294A]'
                      }`}
                    >
                      {event.title}
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {event.description}
                    </p>

                    {/* Actor Badge */}
                    {event.actor && (
                      <div className={`mt-3 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-bold text-slate-600 ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                        <UserCheck className="w-3.5 h-3.5 text-[#F97316]" />
                        <span>Actor: {event.actor}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}

          {/* User 5-star Rating Verification (If Resolved) */}
          {userRating && (
            <div className="relative flex flex-col md:flex-row items-center">
              <div className="absolute left-4 md:left-1/2 top-0 -translate-x-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center border-2 bg-amber-100 border-amber-500 text-amber-600 shadow-md">
                <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
              </div>
              <div className="pl-12 md:pl-0 w-full md:w-[calc(50%-2.5rem)] md:ml-auto md:text-left">
                <div className="p-5 rounded-2xl border bg-amber-50/90 border-amber-300 text-left space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-950 uppercase tracking-wider">
                      Citizen Verification & Rating
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= userRating.score
                              ? 'fill-amber-500 text-amber-600'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {userRating.feedback && (
                    <p className="text-xs text-amber-900 font-medium italic">&ldquo;{userRating.feedback}&rdquo;</p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default IssueTimeline;
