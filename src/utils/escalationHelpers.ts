import { Issue, EscalationNode } from '../types';

export interface AuthorityChainConfig {
  actualResponsibleDept: {
    name: string;
    division: string;
    description: string;
    slaStandard: string;
    officialPortalUrl: string;
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

  // Actual responsible department (does not claim politicians or police repair roads)
  const actualResponsibleDept = isUrban
    ? {
        name: 'BBMP / Municipal Road Infrastructure & Maintenance Wing',
        division: `${issue.wardOrVillage} Engineering Sub-Division`,
        description:
          'Statutory executive department directly tasked with civil road restoration, pothole filling, and bitumen resurfacing.',
        slaStandard: '72 Hours for High Severity / 7 Days Standard SLA',
        officialPortalUrl: 'https://bbmp.gov.in/road-grievances',
      }
    : {
        name: 'Zilla Parishad & Rural Engineering Department (RED)',
        division: `${issue.wardOrVillage} Panchayat Works Division`,
        description:
          'Executive rural public works department responsible for PMGSY/Mukhya Mantri Gram Sadak road maintenance and asphalt grading.',
        slaStandard: '5 Days for High Severity / 10 Days Standard SLA',
        officialPortalUrl: 'https://pmgsy.nic.in/citizen-grievance',
      };

  let urbanNodes: EscalationNode[] = [
    {
      level: 1,
      title: 'Ward Councillor / Corporator',
      designation: 'Elected Ward Representative',
      department: 'Civic Council Grievance Cell',
      status: issue.status === 'Reported' ? 'Current' : 'Completed',
      note: 'Civic intimation generated to local corporator office.',
    },
    {
      level: 2,
      title: 'Municipal Road & Grievance Route',
      designation: 'Executive Engineer (Roads)',
      department: 'Municipal Corporation Engineering Wing',
      status:
        issue.status === 'Routed' || issue.status === 'Acknowledged' || issue.status === 'Inspection Scheduled'
          ? 'Current'
          : issue.status === 'Reported'
          ? 'Pending'
          : 'Completed',
      note: 'Active engineering queue allocation & site verification.',
    },
    {
      level: 3,
      title: 'Municipal Commissioner',
      designation: 'IAS / City Administrative Head',
      department: 'Urban Local Body HQ',
      status:
        isOverdue && !isEscalationReady
          ? 'Current'
          : isEscalationReady
          ? 'Escalated'
          : issue.status === 'Repair In Progress' || issue.status === 'Resolved'
          ? 'Completed'
          : 'Pending',
      daysOverdue: isOverdue ? 2 : undefined,
      note: 'Escalation triggered due to breach of 72h statutory resolution SLA.',
    },
    {
      level: 4,
      title: 'MLA (Member of Legislative Assembly)',
      designation: 'Constituency Representative',
      department: 'State Assembly Public Grievance Office',
      status: isEscalationReady ? 'Escalated' : 'Pending',
      note: 'Constituency dashboard tracking for unaddressed infrastructure.',
    },
    {
      level: 5,
      title: 'MP (Member of Parliament)',
      designation: 'Lok Sabha Representative',
      department: 'Parliamentary Constituency Development Cell',
      status: 'Pending',
      note: 'Monitors regional infrastructure and national urban development funds.',
    },
    {
      level: 6,
      title: 'State PWD / Urban Development Route',
      designation: 'Principal Secretary (Urban Development)',
      department: 'State Urban Development Department',
      status: 'Pending',
      note: 'State level oversight on civic road contracts and municipal audits.',
    },
    {
      level: 7,
      title: 'Chief Minister Grievance Portal (Jansunwai / Samadhan)',
      designation: 'Apex State Public Grievance Authority',
      department: "Chief Minister's Office (CMO)",
      status: 'Pending',
      note: 'Final statutory citizen grievance escalation and audit tier.',
    },
  ];

  let ruralNodes: EscalationNode[] = [
    {
      level: 1,
      title: 'Pradhan / Sarpanch',
      designation: 'Gram Panchayat Head',
      department: 'Gram Panchayat Office',
      status: issue.status === 'Reported' ? 'Current' : 'Completed',
      note: 'Village intimation dispatched to Sarpanch register.',
    },
    {
      level: 2,
      title: 'Panchayat Office / BDO (Block Development Officer)',
      designation: 'State Administrative Officer',
      department: 'Block Development Administration',
      status:
        issue.status === 'Routed' || issue.status === 'Acknowledged' || issue.status === 'Inspection Scheduled'
          ? 'Current'
          : issue.status === 'Reported'
          ? 'Pending'
          : 'Completed',
      note: 'Technical sanction & rural road repair team allocation.',
    },
    {
      level: 3,
      title: 'District Collector / Magistrate',
      designation: 'IAS / District Administrative Head',
      department: 'District Collectorate Rural Development Cell',
      status:
        isOverdue && !isEscalationReady
          ? 'Current'
          : isEscalationReady
          ? 'Escalated'
          : issue.status === 'Repair In Progress' || issue.status === 'Resolved'
          ? 'Completed'
          : 'Pending',
      daysOverdue: isOverdue ? 3 : undefined,
      note: 'Direct district magistrate review for delayed rural infrastructure.',
    },
    {
      level: 4,
      title: 'MLA (Member of Legislative Assembly)',
      designation: 'Rural Constituency Representative',
      department: 'State Assembly Public Works Monitoring',
      status: isEscalationReady ? 'Escalated' : 'Pending',
      note: 'Constituency level development fund review.',
    },
    {
      level: 5,
      title: 'MP (Member of Parliament)',
      designation: 'Parliamentary Representative',
      department: 'DISHA Committee Monitoring Portal',
      status: 'Pending',
      note: 'Quarterly review under District Development Coordination Committee.',
    },
    {
      level: 6,
      title: 'State Rural Development / PWD Route',
      designation: 'Engineer-in-Chief (PMGSY)',
      department: 'State Rural Roads Development Agency (SRRDA)',
      status: 'Pending',
      note: 'Quality audit and contractor compliance penalty review.',
    },
    {
      level: 7,
      title: 'Chief Minister Grievance Portal',
      designation: 'Apex State Public Grievance Authority',
      department: "Chief Minister's Office (CMO)",
      status: 'Pending',
      note: 'Final citizen escalation packet submission.',
    },
  ];

  return {
    actualResponsibleDept,
    escalationNodes: isUrban ? urbanNodes : ruralNodes,
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
