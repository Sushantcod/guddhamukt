import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Issue, CivicMode } from '../../types';
import { createCustomMarkerIcon, createDraggablePinIcon } from './IssueMarker';
import { URBAN_LOCATION, RURAL_LOCATION } from '../../data/mockLocations';

interface IssueMapProps {
  issues?: Issue[];
  selectedIssueId?: string;
  onSelectIssue?: (issue: Issue) => void;
  mode?: CivicMode;
  isDraggableMode?: boolean;
  draggablePosition?: { lat: number; lng: number };
  onDraggablePositionChange?: (lat: number, lng: number) => void;
  height?: string;
  className?: string;
}

export const IssueMap: React.FC<IssueMapProps> = ({
  issues = [],
  selectedIssueId,
  onSelectIssue,
  mode = 'urban',
  isDraggableMode = false,
  draggablePosition,
  onDraggablePositionChange,
  height = '500px',
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const draggableMarkerRef = useRef<L.Marker | null>(null);

  const defaultCenter = mode === 'urban' ? URBAN_LOCATION : RURAL_LOCATION;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Avoid duplicate initialization
    if (!mapInstanceRef.current) {
      const initialLat = draggablePosition?.lat || defaultCenter.centerLat;
      const initialLng = draggablePosition?.lng || defaultCenter.centerLng;
      const initialZoom = isDraggableMode ? 16 : defaultCenter.zoom;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: initialZoom,
        zoomControl: false,
      });

      // Add clean OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add Zoom control at top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Click on map in draggable mode moves marker
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (isDraggableMode && onDraggablePositionChange) {
          onDraggablePositionChange(e.latlng.lat, e.latlng.lng);
        }
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // mount once

  // Handle Mode Change or Center Shift
  useEffect(() => {
    if (!mapInstanceRef.current || isDraggableMode) return;

    const loc = mode === 'urban' ? URBAN_LOCATION : RURAL_LOCATION;
    mapInstanceRef.current.flyTo([loc.centerLat, loc.centerLng], loc.zoom, {
      duration: 1.2,
    });
  }, [mode, isDraggableMode]);

  // Handle Issues Rendering & Popups
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || isDraggableMode) return;

    markersLayerRef.current.clearLayers();

    issues.forEach((issue) => {
      const isSelected = issue.id === selectedIssueId;
      const icon = createCustomMarkerIcon(issue, isSelected);

      const marker = L.marker([issue.latitude, issue.longitude], { icon });

      // Create Custom Popup HTML
      const popupContent = document.createElement('div');
      popupContent.className = 'p-3.5 space-y-2.5 max-w-[260px] text-xs font-sans';
      popupContent.innerHTML = `
        <div class="relative h-24 -mx-3.5 -mt-3.5 mb-2 bg-slate-100 overflow-hidden">
          <img src="${issue.photoUrl}" alt="${issue.title}" class="w-full h-full object-cover" />
          <div class="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold">
            #${issue.id}
          </div>
          <div class="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-white/90 text-slate-800 text-[10px] font-bold">
            ${issue.status}
          </div>
        </div>
        <div class="space-y-1">
          <div class="flex items-center gap-1.5 font-bold text-slate-400 text-[10px] uppercase">
            <span>${issue.category}</span>
            <span>•</span>
            <span class="${issue.severity === 'Immediate Danger' ? 'text-red-600 font-extrabold' : 'text-slate-600'}">${issue.severity}</span>
          </div>
          <h4 class="font-extrabold text-[#123C69] text-sm leading-snug line-clamp-1">${issue.title}</h4>
          <p class="text-[11px] text-slate-500 line-clamp-1">${issue.address}</p>
        </div>
        <div class="pt-1 flex items-center justify-between border-t border-slate-100">
          <span class="text-[11px] font-bold text-slate-600">👥 ${issue.confirmationCount} Verified</span>
          <a href="/issues/${issue.id}" class="px-2.5 py-1 rounded-lg bg-[#123C69] text-white text-[11px] font-bold hover:bg-[#F97316] transition-colors">
            View Details &rarr;
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        if (onSelectIssue) {
          onSelectIssue(issue);
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [issues, selectedIssueId, isDraggableMode, onSelectIssue]);

  // Handle Draggable Marker for reporting
  useEffect(() => {
    if (!mapInstanceRef.current || !isDraggableMode || !draggablePosition) return;

    if (draggableMarkerRef.current) {
      draggableMarkerRef.current.setLatLng([draggablePosition.lat, draggablePosition.lng]);
    } else {
      const pinIcon = createDraggablePinIcon();
      const marker = L.marker([draggablePosition.lat, draggablePosition.lng], {
        icon: pinIcon,
        draggable: true,
      }).addTo(mapInstanceRef.current);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        if (onDraggablePositionChange) {
          onDraggablePositionChange(pos.lat, pos.lng);
        }
      });

      draggableMarkerRef.current = marker;
    }

    mapInstanceRef.current.panTo([draggablePosition.lat, draggablePosition.lng]);
  }, [isDraggableMode, draggablePosition, onDraggablePositionChange]);

  // Invalidate Map size on window resize
  useEffect(() => {
    if (!mapContainerRef.current || !mapInstanceRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize();
    });

    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200/90 z-10 ${className}`}
      style={{ height }}
    >
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
