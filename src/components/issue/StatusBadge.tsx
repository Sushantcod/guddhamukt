import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileCheck2, 
  Flame, 
  HardHat, 
  ShieldAlert, 
  Send
} from 'lucide-react';
import { IssueCategory, IssueSeverity, IssueStatus, SimulatedRouteStatus } from '../../types';
import { getCategoryBadgeClasses, getSeverityBadgeClasses, getStatusBadgeClasses, getSimulatedRouteBadge } from '../../utils/issueHelpers';

export const StatusBadge: React.FC<{ status: IssueStatus; className?: string }> = ({ status, className = '' }) => {
  const getIcon = () => {
    switch (status) {
      case 'Reported':
        return <Send className="w-3 h-3" />;
      case 'Routed':
        return <Clock className="w-3 h-3" />;
      case 'Acknowledged':
        return <FileCheck2 className="w-3 h-3" />;
      case 'Inspection Scheduled':
        return <HardHat className="w-3 h-3" />;
      case 'Repair In Progress':
        return <Flame className="w-3 h-3 text-orange-600 animate-bounce" />;
      case 'Resolved':
      case 'Citizen Verified':
        return <CheckCircle2 className="w-3 h-3 text-emerald-600" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border tracking-tight ${getStatusBadgeClasses(
        status
      )} ${className}`}
    >
      {getIcon()}
      <span>{status}</span>
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: IssueSeverity; className?: string }> = ({ severity, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border uppercase tracking-wider ${getSeverityBadgeClasses(
        severity
      )} ${className}`}
    >
      {severity === 'Immediate Danger' ? (
        <AlertTriangle className="w-3 h-3 text-white" />
      ) : (
        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      )}
      <span>{severity}</span>
    </span>
  );
};

export const CategoryBadge: React.FC<{ category: IssueCategory; className?: string }> = ({ category, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getCategoryBadgeClasses(
        category
      )} ${className}`}
    >
      {category}
    </span>
  );
};

export const SimulatedRouteBadge: React.FC<{ status: SimulatedRouteStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  const badgeInfo = getSimulatedRouteBadge(status);
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${badgeInfo.classes} ${className}`}
    >
      <ShieldAlert className="w-3 h-3" />
      <span>{badgeInfo.label}</span>
    </span>
  );
};
