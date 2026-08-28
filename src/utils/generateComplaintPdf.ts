import { jsPDF } from 'jspdf';
import { Issue, RoadContract } from '../types';
import { getEscalationChainForIssue } from './escalationHelpers';

export function generateComplaintPdf(issue: Issue, contract?: RoadContract): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const chain = getEscalationChainForIssue(issue);

  // Background header band - Deep Navy (#123C69)
  doc.setFillColor(18, 60, 105);
  doc.rect(0, 0, 210, 36, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('GuddhaMutk', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Civic Road Issue Accountability & Escalation Packet', 14, 25);
  doc.text('Tagline: "Every road issue deserves a visible path to action."', 14, 30);

  // Demo Data Notice on Top Right
  doc.setFillColor(249, 115, 22); // Orange
  doc.roundedRect(145, 10, 50, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('DEMO CITIZEN PACKET', 150, 15);

  let currentY = 46;

  // Complaint Metadata Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, 182, 38, 3, 3, 'FD');

  doc.setTextColor(18, 60, 105);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Complaint Ref ID: #${issue.id}`, 20, currentY + 9);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}`, 20, currentY + 16);
  doc.text(`Location: ${issue.address} (${issue.wardOrVillage})`, 20, currentY + 22);
  doc.text(`GPS Coordinates: ${issue.latitude.toFixed(5)}° N, ${issue.longitude.toFixed(5)}° E`, 20, currentY + 28);
  doc.text(`Category: ${issue.category} | Severity: ${issue.severity} | Current Status: ${issue.status}`, 20, currentY + 34);

  currentY += 46;

  // Section 1: Issue Description & Public Safety Impact
  doc.setTextColor(18, 60, 105);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('1. ISSUE SUMMARY & PUBLIC SAFETY IMPACT', 14, currentY);

  currentY += 6;
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  const descLines = doc.splitTextToSize(
    `Description: ${issue.description}\n` +
    `Landmark: ${issue.landmark || 'Not specified'}\n` +
    `Citizen Confirmations: ${issue.confirmationCount} residents have verified this active road hazard.\n` +
    `Resolution SLA Deadline: ${issue.slaDeadline} (Status: ${issue.isOverdue ? 'OVERDUE / SLA BREACHED' : 'Within Standard Window'})`,
    180
  );
  doc.text(descLines, 14, currentY);
  currentY += descLines.length * 5 + 4;

  // Section 2: Statutory Accountability & Responsible Department
  doc.setTextColor(18, 60, 105);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('2. STATUTORY EXECUTIVE RESPONSIBILITY', 14, currentY);

  currentY += 6;
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  const deptInfo = doc.splitTextToSize(
    `Primary Department: ${chain.actualResponsibleDept.name}\n` +
    `Division / Sub-Division: ${chain.actualResponsibleDept.division}\n` +
    `Mandate: ${chain.actualResponsibleDept.description}\n` +
    `Standard SLA: ${chain.actualResponsibleDept.slaStandard}`,
    180
  );
  doc.text(deptInfo, 14, currentY);
  currentY += deptInfo.length * 5 + 4;

  // Section 3: Road Contract & Public Works Tender Info (if available)
  if (contract) {
    doc.setTextColor(18, 60, 105);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('3. ROAD CONTRACT & TENDER DISCLOSURE (DEMO DATA)', 14, currentY);

    currentY += 6;
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    const contractInfo = doc.splitTextToSize(
      `Asset Name: ${contract.assetName}\n` +
      `Owner Department: ${contract.ownerDept} | Contractor: ${contract.contractor}\n` +
      `Tender / Work Order ID: ${contract.tenderId} | Project Sanction Value: ${contract.projectValue}\n` +
      `Last Maintenance Logged: ${contract.lastMaintenance} | Source: ${contract.sourceBadge}`,
      180
    );
    doc.text(contractInfo, 14, currentY);
    currentY += contractInfo.length * 5 + 4;
  }

  // Section 4: Public Authority Escalation Trail
  doc.setTextColor(18, 60, 105);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('4. CITIZEN ESCALATION AUDIT TRAIL', 14, currentY);

  currentY += 6;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');

  chain.escalationNodes.slice(0, 5).forEach((node) => {
    const statusText = node.status === 'Completed' ? '[ACKNOWLEDGED]' : node.status === 'Current' ? '[ACTIVE QUEUE]' : node.status === 'Escalated' ? '[ESCALATED TO THIS TIER]' : '[NEXT STAGE]';
    doc.setTextColor(node.status === 'Current' || node.status === 'Escalated' ? 220 : 71, node.status === 'Current' || node.status === 'Escalated' ? 38 : 85, node.status === 'Current' || node.status === 'Escalated' ? 38 : 105);
    doc.text(`• Level ${node.level}: ${node.title} (${node.designation}) - ${statusText}`, 14, currentY);
    currentY += 4.5;
  });

  currentY += 4;

  // Footer Disclaimer
  doc.setDrawColor(203, 213, 225);
  doc.line(14, 270, 196, 270);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7.5);
  doc.text(
    'DISCLAIMER: This complaint packet is a citizen-generated civic record powered by GuddhaMutk (Frontend Demonstration). ' +
    'All contract, tender, and civic references are mock Demo Data designed for civic hackathon/advocacy presentation. ' +
    'Submit this packet directly to your official local grievance portal (e.g., CPGRAMS / BBMP / Jansunwai).',
    14,
    275,
    { maxWidth: 182 }
  );

  // Save the PDF directly to user download
  doc.save(`GuddhaMutk_Complaint_${issue.id}.pdf`);
}

export function copyComplaintTextToClipboard(issue: Issue, contract?: RoadContract): string {
  const text = `
=== GUDDHAMUTK CIVIC GRIEVANCE PACKET ===
Complaint ID: #${issue.id}
Date: ${new Date().toLocaleDateString('en-IN')}
Category: ${issue.category}
Severity: ${issue.severity}
Status: ${issue.status} (Simulated: ${issue.simulatedRouteStatus})

LOCATION DETAILS:
- Address: ${issue.address}
- Ward / Village: ${issue.wardOrVillage}
- Landmark: ${issue.landmark || 'N/A'}
- Coordinates: ${issue.latitude.toFixed(5)} N, ${issue.longitude.toFixed(5)} E

ISSUE SUMMARY:
${issue.description}
Confirmed by ${issue.confirmationCount} local residents.
SLA Deadline: ${issue.slaDeadline} ${issue.isOverdue ? '(OVERDUE)' : ''}

RESPONSIBLE DEPARTMENT:
${issue.assignedDepartment}
${contract ? `\nROAD TENDER INFO (Demo Data):\n- Asset: ${contract.assetName}\n- Tender ID: ${contract.tenderId}\n- Contractor: ${contract.contractor}\n- Project Value: ${contract.projectValue}` : ''}

Generated via GuddhaMutk - Civic Road Issue & Accountability Platform.
`.trim();

  navigator.clipboard.writeText(text);
  return text;
}
