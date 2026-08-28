export type IssueCategory = 
  | 'Pothole' 
  | 'Road Damage' 
  | 'Drainage' 
  | 'Streetlight' 
  | 'Waterlogging' 
  | 'Footpath Hazard';

export type IssueSeverity = 
  | 'Low' 
  | 'Medium' 
  | 'High' 
  | 'Immediate Danger';

export type IssueStatus = 
  | 'Reported' 
  | 'Routed' 
  | 'Acknowledged' 
  | 'Inspection Scheduled' 
  | 'Repair In Progress' 
  | 'Resolved' 
  | 'Citizen Verified';

export type SimulatedRouteStatus = 
  | 'Prepared' 
  | 'Simulated route' 
  | 'Acknowledged' 
  | 'Overdue' 
  | 'Escalation packet ready';

export type CivicMode = 'urban' | 'rural';

export interface TimelineEvent {
  id: string;
  stage: IssueStatus | 'Overdue Escalation';
  title: string;
  description: string;
  timestamp: string;
  actor?: string;
  isCompleted: boolean;
  isCurrent?: boolean;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  mode: CivicMode;
  wardOrVillage: string;
  address: string;
  landmark?: string;
  latitude: number;
  longitude: number;
  photoUrl: string;
  repairProofUrl?: string;
  confirmationCount: number;
  status: IssueStatus;
  simulatedRouteStatus: SimulatedRouteStatus;
  createdAt: string;
  updatedAt: string;
  slaDeadline: string;
  isOverdue: boolean;
  isEscalated: boolean;
  timeline: TimelineEvent[];
  roadContractId?: string;
  assignedDepartment: string;
  adminNotes?: string[];
  userRating?: {
    score: number;
    feedback?: string;
    ratedAt: string;
  };
  reporterName?: string;
}

export interface RoadContract {
  id: string;
  assetName: string;
  wardOrVillage: string;
  mode: CivicMode;
  ownerDept: string;
  contractor: string;
  tenderId: string;
  projectValue: string;
  budgetAllocated: string;
  workStartDate: string;
  completionDate: string;
  lastMaintenance: string;
  sourceBadge: string;
  warrantyPeriodMonths: number;
  contractUrl?: string;
}

export interface EscalationNode {
  level: number;
  title: string;
  designation: string;
  department: string;
  status: 'Completed' | 'Current' | 'Pending' | 'Overdue' | 'Escalated';
  daysOverdue?: number;
  note?: string;
}

export interface FilterOptions {
  mode?: CivicMode | 'all';
  category?: IssueCategory | 'All';
  status?: IssueStatus | 'All';
  severity?: IssueSeverity | 'All';
  wardOrVillage?: string;
  searchQuery?: string;
  isOverdue?: boolean;
}

export interface DashboardMetrics {
  totalReports: number;
  verifiedCount: number;
  resolvedCount: number;
  overdueCount: number;
  inProgressCount: number;
  escalatedCount: number;
  avgAckTimeDays: number;
  avgRepairTimeDays: number;
}
