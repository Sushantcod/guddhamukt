import React from 'react';
import { AlertCircle, MapPin, Users, Check, PlusCircle, X } from 'lucide-react';
import { Issue } from '../../types';

interface DuplicateMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchedIssue: Issue;
  distanceMeters: number;
  onConfirmExisting: (issueId: string) => void;
  onContinueNew: () => void;
}

export const DuplicateMatchModal: React.FC<DuplicateMatchModalProps> = ({
  isOpen,
  onClose,
  matchedIssue,
  distanceMeters,
  onConfirmExisting,
  onContinueNew,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#123C69]">
                Possible Duplicate Hazard Detected
              </h3>
              <p className="text-xs text-slate-500">
                Found an unresolved {matchedIssue.category} reported ~{distanceMeters}m from your pin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Issue Card Snippet */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={matchedIssue.photoUrl}
              alt={matchedIssue.title}
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border">
                  #{matchedIssue.id}
                </span>
                <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  {matchedIssue.status}
                </span>
              </div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate mt-1">
                {matchedIssue.title}
              </h4>
              <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                {matchedIssue.address}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-200/60">
            <span className="flex items-center gap-1 font-bold text-[#123C69]">
              <Users className="w-3.5 h-3.5" /> {matchedIssue.confirmationCount} citizens confirmed this
            </span>
            <span className="text-[11px] text-amber-700 font-semibold">
              Distance: {distanceMeters} meters away
            </span>
          </div>
        </div>

        {/* Explanation */}
        <p className="text-xs text-slate-600 leading-relaxed">
          Adding your confirmation to the existing ticket gives it higher civic priority in the municipal queue instead of creating redundant tickets.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => onConfirmExisting(matchedIssue.id)}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Confirm Existing (+1 Priority)</span>
          </button>
          <button
            type="button"
            onClick={onContinueNew}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all"
          >
            Create Separate Ticket
          </button>
        </div>
      </div>
    </div>
  );
};
