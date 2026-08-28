import { EscalationNode } from '../types';

export interface AuthorityDepartmentInfo {
  name: string;
  division: string;
  description: string;
  slaStandard: string;
  officialPortalUrl: string;
  helpline: string;
}

export const URBAN_AUTHORITY_DEPARTMENT: AuthorityDepartmentInfo = {
  name: 'BBMP / Municipal Road Infrastructure & Maintenance Wing',
  division: 'Engineering Sub-Division',
  description:
    'Statutory executive department directly tasked with civil road restoration, pothole filling, and bitumen resurfacing.',
  slaStandard: '72 Hours for High Severity / 7 Days Standard SLA',
  officialPortalUrl: 'https://bbmp.gov.in/road-grievances',
  helpline: '080-22660000 / Sahaya 1533',
};

export const RURAL_AUTHORITY_DEPARTMENT: AuthorityDepartmentInfo = {
  name: 'Zilla Parishad & Rural Engineering Department (RED)',
  division: 'Panchayat Works Division',
  description:
    'Executive rural public works department responsible for PMGSY/Mukhya Mantri Gram Sadak road maintenance and asphalt grading.',
  slaStandard: '5 Days for High Severity / 10 Days Standard SLA',
  officialPortalUrl: 'https://pmgsy.nic.in/citizen-grievance',
  helpline: '1800-180-6127 / Grama One 1902',
};

export const MOCK_URBAN_ESCALATION_NODES: Omit<EscalationNode, 'status' | 'daysOverdue'>[] = [
  {
    level: 1,
    title: 'Ward Councillor / Corporator',
    designation: 'Elected Ward Representative',
    department: 'Civic Council Grievance Cell',
    note: 'Civic intimation generated to local corporator office.',
  },
  {
    level: 2,
    title: 'Municipal Road & Grievance Route',
    designation: 'Executive Engineer (Roads)',
    department: 'Municipal Corporation Engineering Wing',
    note: 'Active engineering queue allocation & site verification.',
  },
  {
    level: 3,
    title: 'Municipal Commissioner',
    designation: 'IAS / City Administrative Head',
    department: 'Urban Local Body HQ',
    note: 'Escalation triggered due to breach of 72h statutory resolution SLA.',
  },
  {
    level: 4,
    title: 'MLA (Member of Legislative Assembly)',
    designation: 'Constituency Representative',
    department: 'State Assembly Public Grievance Office',
    note: 'Constituency dashboard tracking for unaddressed infrastructure.',
  },
  {
    level: 5,
    title: 'MP (Member of Parliament)',
    designation: 'Lok Sabha Representative',
    department: 'Parliamentary Constituency Development Cell',
    note: 'Monitors regional infrastructure and national urban development funds.',
  },
  {
    level: 6,
    title: 'State PWD / Urban Development Route',
    designation: 'Principal Secretary (Urban Development)',
    department: 'State Urban Development Department',
    note: 'State level oversight on civic road contracts and municipal audits.',
  },
  {
    level: 7,
    title: 'Chief Minister Grievance Portal (Jansunwai / Samadhan)',
    designation: 'Apex State Public Grievance Authority',
    department: "Chief Minister's Office (CMO)",
    note: 'Final statutory citizen grievance escalation and audit tier.',
  },
];

export const MOCK_RURAL_ESCALATION_NODES: Omit<EscalationNode, 'status' | 'daysOverdue'>[] = [
  {
    level: 1,
    title: 'Pradhan / Sarpanch',
    designation: 'Gram Panchayat Head',
    department: 'Gram Panchayat Office',
    note: 'Village intimation dispatched to Sarpanch register.',
  },
  {
    level: 2,
    title: 'Panchayat Office / BDO (Block Development Officer)',
    designation: 'State Administrative Officer',
    department: 'Block Development Administration',
    note: 'Technical sanction & rural road repair team allocation.',
  },
  {
    level: 3,
    title: 'District Collector / Magistrate',
    designation: 'IAS / District Administrative Head',
    department: 'District Collectorate Rural Development Cell',
    note: 'Direct district magistrate review for delayed rural infrastructure.',
  },
  {
    level: 4,
    title: 'MLA (Member of Legislative Assembly)',
    designation: 'Rural Constituency Representative',
    department: 'State Assembly Public Works Monitoring',
    note: 'Constituency level development fund review.',
  },
  {
    level: 5,
    title: 'MP (Member of Parliament)',
    designation: 'Parliamentary Representative',
    department: 'DISHA Committee Monitoring Portal',
    note: 'Quarterly review under District Development Coordination Committee.',
  },
  {
    level: 6,
    title: 'State Rural Development / PWD Route',
    designation: 'Engineer-in-Chief (PMGSY)',
    department: 'State Rural Roads Development Agency (SRRDA)',
    note: 'Quality audit and contractor compliance penalty review.',
  },
  {
    level: 7,
    title: 'Chief Minister Grievance Portal',
    designation: 'Apex State Public Grievance Authority',
    department: "Chief Minister's Office (CMO)",
    note: 'Final citizen escalation packet submission.',
  },
];
