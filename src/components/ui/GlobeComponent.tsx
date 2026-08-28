import React, { useState } from 'react';
import { Sparkles, Clock, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Pin {
  id: string;
  label: string;
  location: string;
  status: 'Reported' | 'Repair In Progress' | 'Resolved';
  sla: string;
  top: string;
  left: string;
  x: number;
  y: number;
}

const GLOBAL_REPORT_PINS: Pin[] = [
  { id: '1', label: 'Deep Pothole & Broken Asphalt', location: 'MG Road Metro, Bengaluru', status: 'Repair In Progress', sla: '42h remaining', top: '48%', left: '68%', x: 68, y: 48 },
  { id: '2', label: 'Unfilled Utility Trench', location: 'Koramangala 80ft Road, Bengaluru', status: 'Reported', sla: '68h remaining', top: '54%', left: '72%', x: 72, y: 54 },
  { id: '3', label: 'PMGSY Village Road Erosion', location: 'Rampur Gram Panchayat, UP', status: 'Repair In Progress', sla: '18h remaining', top: '38%', left: '64%', x: 64, y: 38 },
  { id: '4', label: 'Sunken Manhole Cover Hazard', location: 'Indiranagar 100ft Road, Bengaluru', status: 'Resolved', sla: 'Fixed in 24h', top: '44%', left: '76%', x: 76, y: 44 },
];

interface GlobeProps {
  className?: string;
  size?: number;
}

export const GlobeComponent: React.FC<GlobeProps> = ({ className = '', size = 440 }) => {
  const [activePin, setActivePin] = useState<Pin>(GLOBAL_REPORT_PINS[0]);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      <style>
        {`
          @keyframes earthRotate {
            from { background-position: 0% center; }
            to { background-position: 200% center; }
          }
          @keyframes dashGlow {
            to { stroke-dashoffset: -20; }
          }
        `}
      </style>

      {/* Realistic 3D Globe Studio Container */}
      <div className="relative flex items-center justify-center overflow-visible">
        
        {/* Main 3D Earth Texture Sphere */}
        <div
          className="relative rounded-full overflow-hidden shadow-[0_0_90px_rgba(249,115,22,0.3),inset_-12px_-12px_60px_rgba(0,0,0,0.9)] transition-all duration-1000 border border-white/20"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundImage: "url('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg')",
            backgroundSize: "200% 100%",
            backgroundRepeat: "repeat-x",
            animation: "earthRotate 220s linear infinite",
            filter: "brightness(1.18) contrast(1.15) saturate(1.25)",
            transform: "translate3d(0,0,0)",
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {/* Dynamic 3D Spherical Shadow Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,transparent_0%,rgba(0,0,0,0.35)_60%,rgba(0,0,0,0.88)_100%)] pointer-events-none" />
          
          {/* Specular Light Highlight */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.2)_0%,transparent_45%)] pointer-events-none" />

          {/* SVG Arc Lines Connecting Pothole Locations */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100">
            {/* Arc from Rampur (64,38) to Bengaluru (68,48) */}
            <path
              d="M 64 38 Q 62 42 68 48"
              fill="none"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="0.8"
              strokeDasharray="2 1"
              style={{ animation: 'dashGlow 3s linear infinite' }}
            />
            {/* Arc from Bengaluru (68,48) to Indiranagar (76,44) */}
            <path
              d="M 68 48 Q 72 38 76 44"
              fill="none"
              stroke="rgba(255, 255, 255, 0.85)"
              strokeWidth="0.8"
            />
            {/* Arc from Koramangala (72,54) to Indiranagar (76,44) */}
            <path
              d="M 72 54 Q 78 50 76 44"
              fill="none"
              stroke="rgba(249, 115, 22, 0.8)"
              strokeWidth="0.8"
            />
          </svg>

          {/* Glowing White Pin Markers over Earth Surface */}
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
                <span className="relative flex h-6 w-6 items-center justify-center">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-80 ${
                      pin.status === 'Resolved' ? 'bg-emerald-400' : 'bg-white'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-slate-900 shadow-lg ${
                      isActive ? 'bg-white scale-125 ring-4 ring-orange-400' : 'bg-white'
                    }`}
                  />
                </span>
              </button>
            );
          })}
        </div>

        {/* Atmosphere Outer Glow Rings */}
        <div 
          className="absolute inset-0 rounded-full bg-orange-500/15 blur-[50px] pointer-events-none scale-110 opacity-70"
          style={{ width: `${size}px`, height: `${size}px` }}
        />
        <div 
          className="absolute inset-0 rounded-full border border-orange-400/20 pointer-events-none scale-105"
          style={{ width: `${size}px`, height: `${size}px` }}
        />

        {/* Globe Studio Pill Badge (Top Left) */}
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-white/20 px-3 py-1 rounded-xl shadow-xl z-30">
          <span className="text-white font-extrabold text-[11px] tracking-wide">Globe Studio</span>
        </div>

        {/* Orbiting Floating Badge 1: Top Right */}
        <div className="absolute top-2 -right-4 sm:right-2 bg-[#0F294A]/95 backdrop-blur-md border border-orange-500/40 p-3 rounded-2xl shadow-2xl max-w-[210px] text-left transform hover:scale-105 transition-transform z-30">
          <div className="flex items-center gap-1.5 text-[#F97316] font-extrabold text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>GADDHAMUKT</span>
          </div>
          <p className="text-[11px] sm:text-xs text-white font-extrabold mt-0.5 leading-snug">
            Report Potholes & Fix City Roads
          </p>
        </div>

        {/* Orbiting Floating Badge 2: Bottom Left */}
        <div className="absolute bottom-2 -left-4 sm:left-2 bg-[#07172B]/95 backdrop-blur-md border border-emerald-500/40 p-3 rounded-2xl shadow-2xl max-w-[200px] text-left transform hover:scale-105 transition-transform z-30">
          <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            <span>72h Statutory SLA</span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-200 font-medium mt-0.5 leading-snug">
            Track live engineer repair timer
          </p>
        </div>
      </div>

      {/* Pin Selector Pills */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 px-4 max-w-xl">
        {GLOBAL_REPORT_PINS.map((pin) => (
          <button
            key={pin.id}
            onClick={() => setActivePin(pin)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activePin.id === pin.id
                ? 'bg-[#F97316] text-white shadow-md scale-105'
                : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'
            }`}
          >
            <MapPin className="w-3 h-3 text-orange-300" />
            <span>{pin.location.split(',')[0]}</span>
          </button>
        ))}
      </div>

      {/* Active Pothole Card Preview Box */}
      <div className="mt-4 w-full bg-white/10 backdrop-blur-lg border border-white/20 p-4 rounded-2xl text-white shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
              activePin.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
            }`}>
              {activePin.status}
            </span>
            <span className="text-[11px] text-slate-300 flex items-center gap-1">
              <Clock className="w-3 h-3 text-orange-400" />
              {activePin.sla}
            </span>
          </div>
          <h4 className="font-extrabold text-sm sm:text-base text-white">{activePin.label}</h4>
          <p className="text-xs text-slate-300 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            {activePin.location}
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#ea580c] text-white text-xs font-extrabold transition-all shadow-md shrink-0 cursor-pointer"
        >
          <span>Report Pothole</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};

export default GlobeComponent;
