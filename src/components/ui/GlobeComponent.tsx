import React, { useState } from 'react';
import { Clock, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Pin {
  id: string;
  label: string;
  location: string;
  status: 'Reported' | 'Repair In Progress' | 'Resolved';
  sla: string;
  top: string;
  left: string;
}

const GLOBAL_REPORT_PINS: Pin[] = [
  { id: '1', label: 'Deep Pothole & Broken Asphalt', location: 'MG Road Metro, Bengaluru', status: 'Repair In Progress', sla: '42h remaining', top: '48%', left: '68%' },
  { id: '2', label: 'Unfilled Utility Trench', location: 'Koramangala 80ft Road, Bengaluru', status: 'Reported', sla: '68h remaining', top: '54%', left: '72%' },
  { id: '3', label: 'PMGSY Village Road Erosion', location: 'Rampur Gram Panchayat, UP', status: 'Repair In Progress', sla: '18h remaining', top: '38%', left: '64%' },
  { id: '4', label: 'Sunken Manhole Cover Hazard', location: 'Indiranagar 100ft Road, Bengaluru', status: 'Resolved', sla: 'Fixed in 24h', top: '44%', left: '76%' },
];

interface GlobeProps {
  className?: string;
  size?: number;
}

export const GlobeComponent: React.FC<GlobeProps> = ({ className = '', size = 380 }) => {
  const [activePin, setActivePin] = useState<Pin>(GLOBAL_REPORT_PINS[0]);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      <style>
        {`
          @keyframes earthRotate {
            from { background-position: 0% center; }
            to { background-position: 200% center; }
          }
        `}
      </style>

      {/* Clean 3D Earth Globe Sphere */}
      <div className="relative flex items-center justify-center">
        
        {/* Main 3D Earth Texture Sphere */}
        <div
          className="relative rounded-full overflow-hidden shadow-[0_0_60px_rgba(249,115,22,0.2),inset_-10px_-10px_45px_rgba(0,0,0,0.85)] transition-all duration-1000 border border-white/15"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundImage: "url('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg')",
            backgroundSize: "200% 100%",
            backgroundRepeat: "repeat-x",
            animation: "earthRotate 220s linear infinite",
            filter: "brightness(1.15) contrast(1.15) saturate(1.2)",
            transform: "translate3d(0,0,0)",
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {/* 3D Spherical Shadow & Specular Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,transparent_0%,rgba(0,0,0,0.3)_60%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.15)_0%,transparent_45%)] pointer-events-none" />

          {/* SVG Arc Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100">
            <path
              d="M 64 38 Q 62 42 68 48"
              fill="none"
              stroke="rgba(255, 255, 255, 0.7)"
              strokeWidth="0.8"
              strokeDasharray="2 1"
            />
            <path
              d="M 68 48 Q 74 38 76 44"
              fill="none"
              stroke="rgba(249, 115, 22, 0.7)"
              strokeWidth="0.8"
            />
          </svg>

          {/* Clean White Pin Markers */}
          {GLOBAL_REPORT_PINS.map((pin) => {
            const isActive = activePin.id === pin.id;
            return (
              <button
                key={pin.id}
                type="button"
                onClick={() => setActivePin(pin)}
                style={{ top: pin.top, left: pin.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                title={`${pin.label} (${pin.location})`}
              >
                <span className="relative flex h-5 w-5 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span
                    className={`relative inline-flex rounded-full h-3 w-3 border border-slate-900 shadow-md ${
                      isActive ? 'bg-orange-500 scale-125 ring-2 ring-white' : 'bg-white'
                    }`}
                  />
                </span>
              </button>
            );
          })}
        </div>

        {/* Subtle Atmosphere Glow */}
        <div 
          className="absolute inset-0 rounded-full bg-orange-500/10 blur-[40px] pointer-events-none scale-105 opacity-60"
          style={{ width: `${size}px`, height: `${size}px` }}
        />
      </div>

      {/* Clean Active Pothole Status Banner below Globe */}
      <div className="mt-5 w-full max-w-md bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl text-white shadow-xl flex items-center justify-between gap-3 text-left">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-orange-500/20 text-orange-300 border border-orange-500/30">
              {activePin.status}
            </span>
            <span className="text-[10px] text-slate-300 flex items-center gap-1">
              <Clock className="w-3 h-3 text-orange-400" />
              {activePin.sla}
            </span>
          </div>
          <h4 className="font-bold text-xs sm:text-sm text-white truncate">{activePin.label}</h4>
          <p className="text-[11px] text-slate-300 truncate flex items-center gap-1">
            <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
            {activePin.location}
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F97316] hover:bg-[#ea580c] text-white text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
        >
          <span>Report</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};

export default GlobeComponent;
