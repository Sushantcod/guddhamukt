import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Camera, 
  Clock, 
  ShieldCheck, 
  Bot, 
  ChevronRight,
  Code2,
  FileCode2,
  Cpu
} from 'lucide-react';

export const GlobeComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let currentAngle = rotationAngle;

    const render = () => {
      currentAngle += 0.003;
      setRotationAngle(currentAngle);

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height * 0.48; // Centered higher up like CodeGalaxy
      const radius = Math.min(width, height) * 0.42;

      ctx.clearRect(0, 0, width, height);

      // 1. Starfield Background Particles
      for (let i = 0; i < 60; i++) {
        const starX = (Math.sin(i * 99 + currentAngle * 0.1) * 0.5 + 0.5) * width;
        const starY = (Math.cos(i * 33 + currentAngle * 0.1) * 0.5 + 0.5) * height;
        const opacity = Math.abs(Math.sin(i + currentAngle * 2));
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.4})`;
        ctx.beginPath();
        ctx.arc(starX, starY, Math.random() > 0.8 ? 1.5 : 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Earth Atmosphere Outer Glow Aura
      const atmosphereGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.85, centerX, centerY, radius * 1.3);
      atmosphereGrad.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
      atmosphereGrad.addColorStop(0.4, 'rgba(147, 51, 234, 0.25)');
      atmosphereGrad.addColorStop(0.8, 'rgba(249, 115, 22, 0.15)');
      atmosphereGrad.addColorStop(1, 'rgba(7, 23, 43, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = atmosphereGrad;
      ctx.fill();

      // 3. Main Planet Sphere Fill with Night/Day Gradient
      const planetGrad = ctx.createRadialGradient(centerX - radius * 0.35, centerY - radius * 0.35, radius * 0.05, centerX, centerY, radius);
      planetGrad.addColorStop(0, '#2563EB');
      planetGrad.addColorStop(0.35, '#1E40AF');
      planetGrad.addColorStop(0.7, '#0F172A');
      planetGrad.addColorStop(1, '#020617');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = planetGrad;
      ctx.shadowColor = '#3B82F6';
      ctx.shadowBlur = 25;
      ctx.fill();
      ctx.shadowBlur = 0;

      // 4. Rotating Latitude & Longitude Grid Rings
      ctx.lineWidth = 1;
      for (let lat = -60; lat <= 60; lat += 20) {
        const latRad = (lat * Math.PI) / 180;
        const r = radius * Math.cos(latRad);
        const y = centerY + radius * Math.sin(latRad);
        ctx.beginPath();
        ctx.ellipse(centerX, y, r, r * 0.3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.stroke();
      }

      for (let lng = 0; lng < 360; lng += 30) {
        const lngRad = (lng * Math.PI) / 180 + currentAngle;
        const xOffset = Math.sin(lngRad) * radius;
        const zOffset = Math.cos(lngRad);

        if (zOffset > -0.2) {
          ctx.beginPath();
          ctx.ellipse(centerX + xOffset * 0.3, centerY, Math.abs(xOffset * 0.7), radius, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0.05, zOffset * 0.22)})`;
          ctx.stroke();
        }
      }

      // 5. Glowing City Lights & Continent Points
      const points = 160;
      for (let i = 0; i < points; i++) {
        const phi = Math.acos(-1 + (2 * i) / points);
        const theta = Math.sqrt(points * Math.PI) * phi + currentAngle;

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        if (z > 0) {
          const alpha = (z / radius) * 0.7;
          ctx.beginPath();
          ctx.arc(centerX + x, centerY + y, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = i % 3 === 0 ? `rgba(249, 115, 22, ${alpha})` : `rgba(147, 51, 234, ${alpha})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [rotationAngle]);

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center pt-2 pb-6 select-none overflow-hidden">
      
      {/* Massive Top CodeGalaxy Earth Globe Canvas */}
      <div className="relative w-full h-[360px] sm:h-[460px] flex items-center justify-center">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600} 
          className="w-full h-full object-contain pointer-events-none"
        />

        {/* Floating Top Title Pill */}
        <div className="absolute top-4 bg-[#0F172A]/80 backdrop-blur-md border border-cyan-500/40 px-4 py-1.5 rounded-full shadow-xl flex items-center gap-2 text-cyan-300 text-xs font-black tracking-widest uppercase">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>GADDHAMUKT CIVIC GALAXY</span>
        </div>
      </div>

      {/* CodeGalaxy Horizontal Planet Cards Bar (Overlapping lower globe) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 px-4 -mt-20 sm:-mt-28 z-20">
        
        {/* Planet Card 1: Blue Elementa / Report */}
        <Link
          to="/report"
          className="group relative bg-[#07172B]/90 backdrop-blur-xl border border-blue-500/40 hover:border-blue-400 p-6 rounded-3xl shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center space-y-4 overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all" />
          
          {/* 3D Ringed Blue Planet Icon */}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-blue-700 via-blue-500 to-indigo-400 shadow-[0_0_25px_rgba(59,130,246,0.6)] flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
            {/* Saturn Orbit Ring */}
            <div className="absolute w-28 h-7 border-2 border-blue-200/60 rounded-[100%] -rotate-12 pointer-events-none shadow-sm" />
            <span className="text-white font-black text-xl tracking-tighter drop-shadow-md flex items-center gap-0.5">
              &lt;/&gt;
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-white tracking-wider group-hover:text-blue-300 transition-colors uppercase">
              ELEMENTA
            </h3>
            <p className="text-xs text-blue-200/80 font-bold uppercase tracking-widest">
              REPORT POTHOLES
            </p>
            <p className="text-[11px] text-slate-300 leading-snug pt-1 font-medium">
              Photo geo-tag road hazards with instant GPS coordinates.
            </p>
          </div>

          <div className="pt-2 text-xs font-extrabold text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Launch Reporter</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </Link>

        {/* Planet Card 2: Purple Stylox / Track SLA */}
        <Link
          to="/track"
          className="group relative bg-[#07172B]/90 backdrop-blur-xl border border-purple-500/40 hover:border-purple-400 p-6 rounded-3xl shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center space-y-4 overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all" />
          
          {/* 3D Ringed Purple Planet Icon */}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-purple-700 via-fuchsia-500 to-pink-400 shadow-[0_0_25px_rgba(168,85,247,0.6)] flex items-center justify-center transform group-hover:-rotate-12 transition-transform duration-500">
            {/* Saturn Orbit Ring */}
            <div className="absolute w-28 h-7 border-2 border-purple-200/60 rounded-[100%] rotate-12 pointer-events-none shadow-sm" />
            <span className="text-white font-black text-xl tracking-tighter drop-shadow-md">
              { `{}` }
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-white tracking-wider group-hover:text-purple-300 transition-colors uppercase">
              STYLOX
            </h3>
            <p className="text-xs text-purple-200/80 font-bold uppercase tracking-widest">
              TRACK 72H SLA
            </p>
            <p className="text-[11px] text-slate-300 leading-snug pt-1 font-medium">
              Monitor live statutory engineer countdown timers.
            </p>
          </div>

          <div className="pt-2 text-xs font-extrabold text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Track Live Timer</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </Link>

        {/* Planet Card 3: Gold Logica / Accountability Audit */}
        <Link
          to="/dashboard"
          className="group relative bg-[#07172B]/90 backdrop-blur-xl border border-amber-500/40 hover:border-amber-400 p-6 rounded-3xl shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center space-y-4 overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all" />
          
          {/* 3D Ringed Gold Planet Icon */}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-amber-700 via-orange-500 to-yellow-400 shadow-[0_0_25px_rgba(245,158,11,0.6)] flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
            {/* Saturn Orbit Ring */}
            <div className="absolute w-28 h-7 border-2 border-amber-200/60 rounded-[100%] -rotate-12 pointer-events-none shadow-sm" />
            <span className="text-white font-black text-lg tracking-wider drop-shadow-md">
              GOV
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-white tracking-wider group-hover:text-amber-300 transition-colors uppercase">
              LOGICA
            </h3>
            <p className="text-xs text-amber-200/80 font-bold uppercase tracking-widest">
              OFFICER AUDIT
            </p>
            <p className="text-[11px] text-slate-300 leading-snug pt-1 font-medium">
              Inspect public tenders & contractor warranty liability.
            </p>
          </div>

          <div className="pt-2 text-xs font-extrabold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>View Public Audit</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </Link>

      </div>

      {/* CodeGalaxy Bottom Right AI Bot Orb */}
      <div className="fixed bottom-6 right-6 z-50 group cursor-pointer">
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#0F294A] via-[#123C69] to-cyan-500 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)] flex items-center justify-center transform group-hover:scale-110 transition-transform">
          <Bot className="w-7 h-7 text-cyan-300 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500"></span>
          </span>
        </div>
      </div>

    </div>
  );
};

export default GlobeComponent;
