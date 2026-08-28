import React, { useState } from 'react';
import { 
  Building, 
  FileText, 
  HelpCircle, 
  IndianRupee, 
  ShieldCheck, 
  Wrench, 
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { RoadContract } from '../../types';
import { SourceBadge } from '../common/SourceBadge';

interface AccountabilityCardProps {
  contract: RoadContract;
}

export const AccountabilityCard: React.FC<AccountabilityCardProps> = ({ contract }) => {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="bg-[#123C69] text-white rounded-xl p-5 shadow-xl border border-blue-900/50 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/15">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#F97316] text-white flex items-center justify-center font-bold">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Public Road Contract & Tender Accountability</h3>
            <p className="text-[11px] text-slate-300">Statutory public works disclosure record</p>
          </div>
        </div>
        <SourceBadge type="verified" label="Open Data Register" />
      </div>

      {/* Road Asset Name */}
      <div className="bg-white/10 backdrop-blur-xs p-3 rounded-lg border border-white/10">
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
          Asset / Road Corridor
        </span>
        <span className="text-sm font-bold text-white">{contract.assetName}</span>
      </div>

      {/* Grid of Accountability Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
        {/* Owner Department */}
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[10px] uppercase tracking-wider mb-1">
            <Building className="w-3.5 h-3.5 text-orange-400" />
            Owner Department
          </div>
          <p className="font-bold text-white text-xs">{contract.ownerDept}</p>
        </div>

        {/* Contractor */}
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[10px] uppercase tracking-wider mb-1">
            <Wrench className="w-3.5 h-3.5 text-orange-400" />
            Executing Contractor
          </div>
          <p className="font-bold text-white text-xs">{contract.contractor}</p>
        </div>

        {/* Tender ID */}
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[10px] uppercase tracking-wider mb-1">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            Tender / Work Order ID
          </div>
          <p className="font-mono font-bold text-slate-100 text-xs">{contract.tenderId}</p>
        </div>

        {/* Project Value in INR */}
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[10px] uppercase tracking-wider mb-1">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
            Sanctioned Value & Budget
          </div>
          <p className="font-bold text-emerald-400 text-xs">
            {contract.projectValue}{' '}
            <span className="text-slate-300 font-normal text-[11px]">(Allocated: {contract.budgetAllocated})</span>
          </p>
        </div>

        {/* Last Maintenance */}
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[10px] uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-300" />
            Last Maintenance Record
          </div>
          <p className="font-bold text-white text-xs">{contract.lastMaintenance}</p>
        </div>

        {/* Warranty / Defect Liability */}
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[10px] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
            Defect Liability Period (DLP)
          </div>
          <p className="font-bold text-teal-300 text-xs">
            {contract.warrantyPeriodMonths} Months Warranty
          </p>
        </div>
      </div>

      {/* Source Link */}
      <div className="flex items-center justify-between text-xs text-slate-300 pt-1 border-t border-white/10">
        <span className="text-[11px] font-medium">
          Source: <strong className="text-white">{contract.sourceBadge}</strong>
        </span>
        {contract.contractUrl && (
          <a
            href={contract.contractUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-orange-300 hover:text-white font-bold text-xs"
          >
            Official Tender Ledger <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Expandable Explanation of Contractor Liability */}
      <div className="pt-2">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full flex items-center justify-between text-xs font-bold text-orange-300 hover:text-white transition-colors py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10"
        >
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-orange-400" />
            Why does public contract transparency matter for road repair?
          </span>
          {showExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showExplanation && (
          <div className="mt-2 p-3 bg-white/10 rounded-lg text-xs text-slate-200 leading-relaxed space-y-1.5 border border-white/10 animate-in fade-in">
            <p>
              Under Indian Public Works Department (PWD) and Municipal guidelines, newly constructed and resurfaced roads are protected by a mandatory <strong>Defect Liability Period (DLP)</strong> ranging from 18 to 36 months.
            </p>
            <p>
              If potholes or asphalt disintegration occur within the DLP, the <strong>contractor is legally obligated to repair the road at zero additional cost to taxpayers</strong>. Knowing the Tender ID allows citizens to hold both engineers and contractors accountable.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

