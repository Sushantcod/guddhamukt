import React, { useRef, useEffect, useState } from 'react';
import { ShieldCheck, Clock, MapPin, AlertCircle, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Pin {
  id: string;
  lat: number;
  lng: number;
  label: string;
  location: string;
  status: 'Reported' | 'Repair In Progress' | 'Resolved';
  sla: string;
}

const GLOBAL_REPORT_PINS: Pin[] = [
  { id: '1', lat: 12.9716, lng: 77.5946, label: 'Deep Pothole & Broken Asphalt', location: 'MG Road Metro Station, Bengaluru', status: 'Repair In Progress', sla: '42h remaining' },
  { id: '2', lat: 12.9279, lng: 77.6271, label: 'Unfilled Utility Trench', location: 'Koramangala 80ft Road, Bengaluru', status: 'Reported', sla: '68h remaining' },
  { id: '3', lat: 12.9784, lng: 77.6408, label: 'Sunken Manhole Cover Hazard', location: 'Indiranagar 100ft Road, Bengaluru', status: 'Resolved', sla: 'Fixed in 24h' },
  { id: '4', lat: 26.8467, lng: 80.9462, label: 'PMGSY Village Road Erosion', location: 'Rampur Gram Panchayat, UP', status: 'Repair In Progress', sla: '18h remaining' },
  { id: '5', lat: 19.0760, lng: 72.8777, label: 'Cracked Road Surface', location: 'Bandra-Kurla Complex, Mumbai', status: 'Reported', sla: '54h remaining' },
];

export const GlobeComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activePin, setActivePin] = useState<Pin>(GLOBAL_REPORT_PINS[0]);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, angle: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let currentAngle = rotationAngle;

    const render = () => {
      if (!isDragging) {
        currentAngle += 0.005;
        setRotationAngle(currentAngle);
      }

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.38;

      ctx.clearRect(0, 0, width, height);

      // 1. Globe Atmosphere Outer Glow Ring
      const glowGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.9, centerX, centerY, radius * 1.25);
      glowGrad.addColorStop(0, 'rgba(249, 115, 22, 0.25)');
      glowGrad.addColorStop(0.5, 'rgba(18, 60, 105, 0.4)');
      glowGrad.addColorStop(1, 'rgba(15, 41, 74, 0)');
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.25, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // 2. Base Sphere Fill
      const sphereGrad = ctx.createRadialGradient(centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.1, centerX, centerY, radius);
      sphereGrad.addColorStop(0, '#1E4976');
      sphereGrad.addColorStop(0.7, '#0F294A');
      sphereGrad.addColorStop(1, '#07172B');
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.shadowColor = '#F97316';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      // 3. Globe Latitude & Longitude Grid Rings
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;

      // Latitudes
      for (let lat = -60; lat <= 60; lat += 20) {
        const latRad = (lat * Math.PI) / 180;
        const r = radius * Math.cos(latRad);
        const y = centerY + radius * Math.sin(latRad);
        ctx.beginPath();
        ctx.ellipse(centerX, y, r, r * 0.25, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Longitudes
      for (let lng = 0; lng < 360; lng += 30) {
        const lngRad = (lng * Math.PI) / 180 + currentAngle;
        const xOffset = Math.sin(lngRad) * radius;
        const zOffset = Math.cos(lngRad);

        if (zOffset > -0.2) {
          ctx.beginPath();
          ctx.ellipse(centerX + xOffset * 0.3, centerY, Math.abs(xOffset * 0.7), radius, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0.04, zOffset * 0.18)})`;
          ctx.stroke();
        }
      }

      // 4. Draw Simplified Continent Landmass Outlines & Dots
      const dotsCount = 180;
      for (let i = 0; i < dotsCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / dotsCount);
        const theta = Math.sqrt(dotsCount * Math.PI) * phi + currentAngle;

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        if (z > 0) {
          const alpha = (z / radius) * 0.6;
          ctx.beginPath();
          ctx.arc(centerX + x, centerY + y, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(249, 115, 22, ${alpha})`;
          ctx.fill();
        }
      }

      // 5. Draw Interactive Pothole Pins
      GLOBAL_REPORT_PINS.forEach((pin, index) => {
        const radLng = ((pin.lng - 80) * Math.PI) / 180 + currentAngle * 1.5;
        const radLat = (pin.lat * Math.PI) / 180;

        const x = radius * Math.cos(radLat) * Math.sin(radLng);
        const y = -radius * Math.sin(radLat);
        const z = radius * Math.cos(radLat) * Math.cos(radLng);

        if (z > 0) {
          const pinX = centerX + x;
          const pinY = centerY + y;
          const isActive = activePin.id === pin.id;

          // Pulse ring
          ctx.beginPath();
          ctx.arc(pinX, pinY, isActive ? 12 : 8, 0, Math.PI * 2);
          ctx.fillStyle = isActive ? 'rgba(249, 115, 22, 0.4)' : 'rgba(239, 68, 68, 0.3)';
          ctx.fill();

          // Core Dot
          ctx.beginPath();
          ctx.arc(pinX, pinY, isActive ? 5 : 3.5, 0, Math.PI * 2);
          ctx.fillStyle = pin.status === 'Resolved' ? '#10B981' : '#F97316';
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [rotationAngle, isDragging, activePin]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, angle: rotationAngle };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    setRotationAngle(dragStartRef.current.angle + deltaX * 0.008);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center select-none">
      
      {/* 3D Canvas Globe Container */}
      <div 
        className="relative w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] cursor-grab active:cursor-grabbing flex items-center justify-center"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas 
          ref={canvasRef} 
          width={480} 
          height={480} 
          className="w-full h-full object-contain"
        />

        {/* Orbiting Floating Badge 1: Top Right */}
        <div className="absolute top-2 -right-4 sm:right-0 bg-[#0F294A]/90 backdrop-blur-md border border-orange-500/40 p-2.5 sm:p-3 rounded-2xl shadow-xl max-w-[210px] text-left transform hover:scale-105 transition-transform">
          <div className="flex items-center gap-1.5 text-[#F97316] font-extrabold text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GADDHAMUKT</span>
          </div>
          <p className="text-[10px] sm:text-xs text-white font-bold mt-0.5 leading-snug">
            Report Potholes & Fix City Roads
          </p>
        </div>

        {/* Orbiting Floating Badge 2: Bottom Left */}
        <div className="absolute bottom-4 -left-4 sm:left-0 bg-[#07172B]/90 backdrop-blur-md border border-emerald-500/40 p-2.5 sm:p-3 rounded-2xl shadow-xl max-w-[200px] text-left transform hover:scale-105 transition-transform">
          <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            <span>72h Statutory SLA</span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-200 font-medium mt-0.5 leading-snug">
            Track live engineer repair timer
          </p>
        </div>
      </div>

      {/* Pin Selector Selector Pills */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 px-4 max-w-xl">
        {GLOBAL_REPORT_PINS.map((pin) => (
          <button
            key={pin.id}
            onClick={() => setActivePin(pin)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activePin.id === pin.id
                ? 'bg-[#F97316] text-white shadow-md'
                : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span>{pin.location.split(',')[0]}</span>
          </button>
        ))}
      </div>

      {/* Active Pothole Card Preview */}
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
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#ea580c] text-white text-xs font-extrabold transition-all shadow-md shrink-0"
        >
          <span>Report Pothole</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};

export default GlobeComponent;
