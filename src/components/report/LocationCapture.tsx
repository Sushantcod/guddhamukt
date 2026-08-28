import React from 'react';
import { MapPin, Navigation, Compass, AlertCircle, CheckCircle, Building2, Trees } from 'lucide-react';
import { CivicMode } from '../../types';
import { IssueMap } from '../map/IssueMap';
import { URBAN_LOCATION, RURAL_LOCATION } from '../../data/mockLocations';

interface LocationCaptureProps {
  mode: CivicMode;
  onModeChange: (mode: CivicMode) => void;
  latitude: number;
  longitude: number;
  accuracy?: number;
  isLocating: boolean;
  locationError?: string;
  onDetectLocation: () => void;
  onManualPinChange: (lat: number, lng: number) => void;
  address: string;
  onAddressChange: (address: string) => void;
  landmark: string;
  onLandmarkChange: (landmark: string) => void;
  wardOrVillage: string;
  onWardChange: (ward: string) => void;
}

export const LocationCapture: React.FC<LocationCaptureProps> = ({
  mode,
  onModeChange,
  latitude,
  longitude,
  accuracy,
  isLocating,
  locationError,
  onDetectLocation,
  onManualPinChange,
  address,
  onAddressChange,
  landmark,
  onLandmarkChange,
  wardOrVillage,
  onWardChange,
}) => {
  const currentSubdivisions =
    mode === 'urban' ? URBAN_LOCATION.subdivisions : RURAL_LOCATION.subdivisions;

  return (
    <div className="space-y-5">
      {/* 1. Mode Selection (Urban / Rural) */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
        <label className="text-xs font-extrabold text-[#123C69] uppercase tracking-wider block">
          Jurisdiction & Civic Area Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onModeChange('urban')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs sm:text-sm font-extrabold border transition-all ${
              mode === 'urban'
                ? 'bg-white border-blue-600 text-blue-900 shadow-xs ring-2 ring-blue-100'
                : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
            }`}
          >
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Urban Municipal City</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange('rural')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs sm:text-sm font-extrabold border transition-all ${
              mode === 'rural'
                ? 'bg-white border-emerald-600 text-emerald-900 shadow-xs ring-2 ring-emerald-100'
                : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
            }`}
          >
            <Trees className="w-4 h-4 text-emerald-600" />
            <span>Rural Gram Panchayat</span>
          </button>
        </div>
      </div>

      {/* 2. GPS Auto Detection Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-blue-50/70 border border-blue-200 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#123C69] text-white flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-[#123C69]">
              Geo-Tagging & GPS Auto-Detection
            </h4>
            <p className="text-[11px] text-slate-600">
              Coordinates: {latitude.toFixed(5)}° N, {longitude.toFixed(5)}° E
              {accuracy && ` (±${Math.round(accuracy)}m accuracy)`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onDetectLocation}
          disabled={isLocating}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
        >
          <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Detecting GPS...' : 'Auto-Detect My GPS'}</span>
        </button>
      </div>

      {locationError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{locationError} You can drag the orange pin on the map below.</span>
        </div>
      )}

      {/* 3. Interactive Map Pin Adjustment */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
            Drag or click on map to adjust exact pothole spot:
          </span>
          <span className="text-slate-400 font-mono text-[11px]">
            {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </span>
        </div>
        <IssueMap
          mode={mode}
          isDraggableMode={true}
          draggablePosition={{ lat: latitude, lng: longitude }}
          onDraggablePositionChange={onManualPinChange}
          height="260px"
        />
      </div>

      {/* 4. Text Fields for Address, Landmark & Ward */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1.5">
          <label className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px] block">
            {mode === 'urban' ? 'Ward / Sub-Division' : 'Gram Panchayat / Block'} *
          </label>
          <select
            value={wardOrVillage}
            onChange={(e) => onWardChange(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#123C69]/20"
          >
            {currentSubdivisions.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px] block">
            Nearby Landmark
          </label>
          <input
            type="text"
            placeholder="e.g. Near Metro Pillar 45 / Beside School Gate"
            value={landmark}
            onChange={(e) => onLandmarkChange(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#123C69]/20"
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px] block">
            Street Address or Road Name *
          </label>
          <input
            type="text"
            placeholder="e.g. Outer Ring Road, Bellandur / Main Panchayat Road Km 4"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#123C69]/20"
            required
          />
        </div>
      </div>
    </div>
  );
};
