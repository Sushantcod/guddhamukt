import L from 'leaflet';
import { Issue, IssueSeverity, IssueStatus } from '../../types';

export function createCustomMarkerIcon(issue: Issue, isSelected: boolean = false): L.DivIcon {
  const isEmergency = issue.severity === 'Immediate Danger';
  const isOverdue = issue.isOverdue;
  const isResolved = issue.status === 'Resolved' || issue.status === 'Citizen Verified';
  const isInProgress = issue.status === 'Repair In Progress' || issue.status === 'Inspection Scheduled';

  let pinColor = '#2563EB'; // Blue default
  if (isEmergency) pinColor = '#DC2626'; // Red
  else if (isOverdue) pinColor = '#EA580C'; // Orange-Red
  else if (isResolved) pinColor = '#15803D'; // Green
  else if (isInProgress) pinColor = '#D97706'; // Amber

  const pulseHtml = isEmergency
    ? `<span class="absolute -inset-1 rounded-full bg-red-500 animate-ping opacity-75"></span>`
    : '';

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 ${
      isSelected ? 'scale-125 z-50' : 'hover:scale-110'
    }">
      ${pulseHtml}
      <div style="background-color: ${pinColor};" class="relative w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md border-2 border-white ring-1 ring-black/10">
        ${
          isResolved
            ? '✓'
            : isEmergency
            ? '!'
            : issue.category === 'Pothole'
            ? 'P'
            : issue.category === 'Streetlight'
            ? 'L'
            : issue.category === 'Drainage' || issue.category === 'Waterlogging'
            ? 'D'
            : 'R'
        }
      </div>
      <div style="border-top-color: ${pinColor};" class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-6"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [32, 38],
    iconAnchor: [16, 38],
    popupAnchor: [0, -36],
  });
}

export function createDraggablePinIcon(): L.DivIcon {
  const html = `
    <div class="relative flex items-center justify-center cursor-grab active:cursor-grabbing animate-bounce">
      <div class="w-10 h-10 rounded-full bg-[#F97316] flex items-center justify-center text-white font-bold text-sm shadow-xl border-3 border-white ring-2 ring-orange-400">
        📍
      </div>
      <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-8 border-t-[#F97316]"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'draggable-leaflet-marker',
    iconSize: [40, 48],
    iconAnchor: [20, 48],
  });
}
