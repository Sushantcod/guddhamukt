import { Issue, EscalationNode } from '../types';
import {
  URBAN_AUTHORITY_DEPARTMENT,
  RURAL_AUTHORITY_DEPARTMENT,
  MOCK_URBAN_ESCALATION_NODES,
  MOCK_RURAL_ESCALATION_NODES,
} from '../data/mockAuthorities';

export interface AuthorityChainConfig {
  actualResponsibleDept: {
    name: string;
    division: string;
    description: string;
    slaStandard: string;
    officialPortalUrl: string;
    helpline?: string;
  };
  escalationNodes: EscalationNode[];
  hasPoliceEmergencyRoute: boolean;
  policeAdvisory?: {
    unit: string;
    alertLevel: string;
    instructions: string;
    contactNumber: string;
  };
}

export function getEscalationChainForIssue(issue: Issue): AuthorityChainConfig {
  const isUrban = issue.mode === 'urban';
  const isEmergency = issue.severity === 'Immediate Danger';
  const isOverdue = issue.isOverdue || issue.simulatedRouteStatus === 'Overdue';
  const isEscalationReady = issue.simulatedRouteStatus === 'Escalation packet ready' || issue.isEscalated;

  const baseDept = isUrban ? URBAN_AUTHORITY_DEPARTMENT : RURAL_AUTHORITY_DEPARTMENT;
  const actualResponsibleDept = {
    ...baseDept,
    division: `${issue.wardOrVillage} ${baseDept.division}`,
  };

  const baseNodes = isUrban ? MOCK_URBAN_ESCALATION_NODES : MOCK_RURAL_ESCALATION_NODES;

  const escalationNodes: EscalationNode[] = baseNodes.map((node) => {
    let status: EscalationNode['status'] = 'Pending';
    let daysOverdue: number | undefined = undefined;

    if (node.level === 1) {
      status = issue.status === 'Reported' ? 'Current' : 'Completed';
    } else if (node.level === 2) {
      status =
        issue.status === 'Routed' || issue.status === 'Acknowledged' || issue.status === 'Inspection Scheduled'
          ? 'Current'
          : issue.status === 'Reported'
          ? 'Pending'
          : 'Completed';
    } else if (node.level === 3) {
      status =
        isOverdue && !isEscalationReady
          ? 'Current'
          : isEscalationReady
          ? 'Escalated'
          : issue.status === 'Repair In Progress' || issue.status === 'Resolved'
          ? 'Completed'
          : 'Pending';
      if (isOverdue) daysOverdue = isUrban ? 2 : 3;
    } else if (node.level === 4) {
      status = isEscalationReady ? 'Escalated' : 'Pending';
    } else {
      status = 'Pending';
    }

    return {
      ...node,
      status,
      daysOverdue,
    };
  });

  return {
    actualResponsibleDept,
    escalationNodes,
    hasPoliceEmergencyRoute: isEmergency,
    policeAdvisory: isEmergency
      ? {
          unit: isUrban ? 'City Traffic Police (Barricading Unit)' : 'District Rural Highway Patrol',
          alertLevel: 'CRITICAL HAZARD - IMMEDIATE BARRICADING REQUIRED',
          instructions:
            'This issue exhibits structural hazard to motorists and two-wheelers. Emergency alert dispatched for physical caution reflectors and traffic redirection.',
          contactNumber: '112 / Traffic Helpline 1095',
        }
      : undefined,
  };
}
