import React from 'react';
import { AlertTriangle, ShieldAlert, Sparkles } from 'lucide-react';
import { IssueCategory, IssueSeverity } from '../../types';

interface IssueFormProps {
  title: string;
  onTitleChange: (title: string) => void;
  category: IssueCategory;
  onCategoryChange: (category: IssueCategory) => void;
  severity: IssueSeverity;
  onSeverityChange: (severity: IssueSeverity) => void;
  description: string;
  onDescriptionChange: (desc: string) => void;
  reporterName: string;
  onReporterNameChange: (name: string) => void;
}

const CATEGORIES: IssueCategory[] = [
  'Pothole',
  'Road Damage',
  'Drainage',
  'Waterlogging',
  'Streetlight',
  'Footpath Hazard',
];

const SEVERITIES: { value: IssueSeverity; label: string; desc: string; color: string }[] = [
  {
    value: 'Low',
    label: 'Low Severity',
    desc: 'Minor cosmetic fissure or early wear. Standard 5-day SLA.',
    color: 'border-emerald-300 text-emerald-900 bg-emerald-50/50',
  },
  {
    value: 'Medium',
    label: 'Medium Severity',
    desc: 'Noticeable bump or shallow cavity. Standard 72-hour SLA.',
    color: 'border-amber-300 text-amber-900 bg-amber-50/50',
  },
  {
    value: 'High',
    label: 'High Severity',
    desc: 'Deep pothole or collapsed slab slowing traffic. 48-hour SLA.',
    color: 'border-orange-400 text-orange-950 bg-orange-50/60',
  },
  {
    value: 'Immediate Danger',
    label: 'Immediate Danger (Emergency)',
    desc: 'Critical fatal risk for two-wheelers/buses. Triggers Police emergency unit.',
    color: 'border-red-500 text-red-950 bg-red-50 ring-2 ring-red-200',
  },
];

export const IssueForm: React.FC<IssueFormProps> = ({
  title,
  onTitleChange,
  category,
  onCategoryChange,
  severity,
  onSeverityChange,
  description,
  onDescriptionChange,
  reporterName,
  onReporterNameChange,
}) => {
  return (
    <div className="space-y-5 text-xs">
      {/* Category Picker */}
      <div className="space-y-2">
        <label className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px] block">
          Hazard Category *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={`p-2.5 rounded-xl font-extrabold text-xs border text-left transition-all ${
                category === cat
                  ? 'bg-[#123C69] text-white border-[#123C69] shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Severity Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px] block">
            Severity Level & Safety Risk *
          </label>
          {severity === 'Immediate Danger' && (
            <span className="text-[10px] font-bold text-red-600 animate-pulse flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Police Alert Dispatched
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SEVERITIES.map((sev) => (
            <button
              key={sev.value}
              type="button"
              onClick={() => onSeverityChange(sev.value)}
              className={`p-3 rounded-xl border text-left transition-all ${
                severity === sev.value
                  ? sev.color + ' shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-xs">{sev.label}</span>
                {severity === sev.value && <span className="text-xs">✓</span>}
              </div>
              <p className="text-[11px] opacity-80 leading-relaxed font-normal">{sev.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Issue Title */}
      <div className="space-y-1.5">
        <label className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px] block">
          Short Title / Headline *
        </label>
        <input
          type="text"
          placeholder="e.g., Deep Crater Pothole in Middle Lane"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#123C69]/20"
          required
        />
      </div>

      {/* Detailed Description */}
      <div className="space-y-1.5">
        <label className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px] block">
          Detailed Description & Impact *
        </label>
        <textarea
          rows={3}
          placeholder="Describe the width/depth of the pothole, vehicle impact, or specific hazards..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#123C69]/20 leading-relaxed"
          required
        />
      </div>

      {/* Reporter Name (Optional) */}
      <div className="space-y-1.5">
        <label className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px] block">
          Citizen Reporter Name / Resident Association (Optional)
        </label>
        <input
          type="text"
          placeholder="e.g., Ramesh K. / Indiranagar Residents Welfare Association"
          value={reporterName}
          onChange={(e) => onReporterNameChange(e.target.value)}
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#123C69]/20"
        />
      </div>
    </div>
  );
};
