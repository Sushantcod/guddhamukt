import { IssueCategory, IssueSeverity, IssueStatus, SimulatedRouteStatus } from '../types';

export function formatIndianCurrency(amountStr: string): string {
  return amountStr;
}

export function formatDateString(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export function formatDateTimeString(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function getCategoryBadgeClasses(category: IssueCategory): string {
  switch (category) {
    case 'Pothole':
      return 'bg-amber-100 text-amber-900 border-amber-200';
    case 'Road Damage':
      return 'bg-blue-100 text-blue-900 border-blue-200';
    case 'Drainage':
    case 'Waterlogging':
      return 'bg-cyan-100 text-cyan-900 border-cyan-200';
    case 'Streetlight':
      return 'bg-purple-100 text-purple-900 border-purple-200';
    case 'Footpath Hazard':
      return 'bg-orange-100 text-orange-900 border-orange-200';
    default:
      return 'bg-slate-100 text-slate-900 border-slate-200';
  }
}

export function getSeverityBadgeClasses(severity: IssueSeverity): string {
  switch (severity) {
    case 'Immediate Danger':
      return 'bg-red-600 text-white animate-pulse border-red-700';
    case 'High':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Medium':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Low':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
}

export function getStatusBadgeClasses(status: IssueStatus): string {
  switch (status) {
    case 'Reported':
      return 'bg-slate-100 text-slate-700 border-slate-300';
    case 'Routed':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Acknowledged':
      return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    case 'Inspection Scheduled':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Repair In Progress':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'Resolved':
    case 'Citizen Verified':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300';
  }
}

export function getSimulatedRouteBadge(routeStatus: SimulatedRouteStatus): {
  label: string;
  classes: string;
} {
  switch (routeStatus) {
    case 'Prepared':
      return {
        label: 'Prepared',
        classes: 'bg-slate-100 text-slate-700 border-slate-300',
      };
    case 'Simulated route':
      return {
        label: 'Simulated route',
        classes: 'bg-blue-100 text-blue-700 border-blue-300',
      };
    case 'Acknowledged':
      return {
        label: 'Acknowledged',
        classes: 'bg-teal-100 text-teal-800 border-teal-300',
      };
    case 'Overdue':
      return {
        label: 'Overdue (Action Delayed)',
        classes: 'bg-red-100 text-red-800 border-red-300',
      };
    case 'Escalation packet ready':
      return {
        label: 'Escalation packet ready',
        classes: 'bg-purple-100 text-purple-800 border-purple-300',
      };
    default:
      return {
        label: routeStatus,
        classes: 'bg-slate-100 text-slate-700 border-slate-300',
      };
  }
}

export function generateComplaintId(): string {
  const prefix = 'GM';
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${randomNum}`;
}
