import React, { useEffect, useRef, useCallback, useState } from 'react';
import createGlobe from 'cobe';
import { MapPin, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface PolaroidMarker {
  id: string;
  location: [number, number];
  image: string;
  caption: string;
  rotate: number;
  status: string;
  sla: string;
}

const CIVIC_MARKERS: PolaroidMarker[] = [
  { 
    id: 'pothole-mgroad', 
    location: [12.9716, 77.5946], 
    image: '/demo-images/pothole-1.jpg', 
    caption: 'Bengaluru MG Road', 
    rotate: -4,
    status: 'Repair In Progress',
    sla: '42h remaining'
  },
  { 
    id: 'pothole-[#F97316]', 
    location: [26.8467, 80.9462], 
    image: '/demo-images/pothole-2.jpg', 
    caption: 'Rampur Village', 
    rotate: 5,
    status: 'Reported',
    sla: '68h remaining'
  },
  { 
    id: 'pothole-indiranagar', 
    location: [12.9784, 77.6408], 
    image: '/demo-images/repair-proof.jpg', 
    caption: 'Indiranagar 100ft', 
    rotate: -3,
    status: 'Resolved',
    sla: 'Fixed in 24h'
  },
  { 
    id: 'pothole-mumbai', 
    location: [19.0760, 72.8777], 
    image: '/demo-images/pothole-1.jpg', 
    caption: 'Mumbai BKC', 
    rotate: 4,
    status: 'Reported',
    sla: '54h remaining'
  },
];

interface GlobeComponentProps {
  markers?: PolaroidMarker[];
  className?: string;
  speed?: number;
}

export const GlobeComponent: React.FC<GlobeComponentProps> = ({
  markers = CIVIC_MARKERS,
  className = '',
  speed = 0.003,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const [activeMarker, setActiveMarker] = useState<PolaroidMarker>(CIVIC_MARKERS[0]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        };
      }
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerUp]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let globe: ReturnType<typeof createGlobe> | null = null;
    let animationId: number;
    let phi = 0;

    function init() {
      const width = canvas.offsetWidth;
      if (width === 0 || globe) return;

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width: width * 2,
        height: width * 2,
        phi: 0,
        theta: 0.2,
        dark: 1,
        diffuse: 1.6,
        mapSamples: 16000,
        mapBrightness: 8,
        baseColor: [0.08, 0.18, 0.32],
        markerColor: [0.97, 0.45, 0.08],
        glowColor: [0.97, 0.45, 0.08],
        markerElevation: 0.05,
        markers: markers.map((m) => ({ location: m.location, size: 0.06, id: m.id })),
        arcs: [],
        arcColor: [0.97, 0.45, 0.08],
        arcWidth: 0.5,
        arcHeight: 0.25,
        opacity: 0.9,
      });

      function animate() {
        if (!isPausedRef.current) phi += speed;
        if (globe) {
          globe.update({
            phi: phi + phiOffsetRef.current + dragOffset.current.phi,
            theta: 0.2 + thetaOffsetRef.current + dragOffset.current.theta,
          });
        }
        animationId = requestAnimationFrame(animate);
      }
      animate();
      if (canvas) canvas.style.opacity = '1';
    }

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect();
          init();
        }
      });
      ro.observe(canvas);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (globe) globe.destroy();
    };
  }, [markers, speed]);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      
      {/* 3D Cobe Globe Canvas Container */}
      <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          style={{
            width: '100%',
            height: '100%',
            cursor: 'grab',
            opacity: 0,
            transition: 'opacity 1.2s ease',
            borderRadius: '50%',
            touchAction: 'none',
          }}
        />

        {/* Polaroid Card Overlays */}
        {markers.map((m) => {
          const isActive = activeMarker.id === m.id;
          return (
            <div
              key={m.id}
              onClick={() => setActiveMarker(m)}
              className="cursor-pointer transition-transform hover:scale-110"
              style={{
                position: 'absolute',
                top: m.id.includes('mgroad') ? '22%' : m.id.includes('indira') ? '28%' : m.id.includes('mumbai') ? '60%' : '15%',
                left: m.id.includes('mgroad') ? '68%' : m.id.includes('indira') ? '15%' : m.id.includes('mumbai') ? '72%' : '25%',
                background: '#ffffff',
                padding: '5px 5px 20px',
                boxShadow: isActive ? '0 0 20px rgba(249,115,22,0.6)' : '0 4px 14px rgba(0,0,0,0.3)',
                transform: `rotate(${m.rotate}deg)`,
                borderRadius: '8px',
                zIndex: isActive ? 30 : 20,
              }}
            >
              <img
                src={m.image}
                alt={m.caption}
                style={{ display: 'block', width: 56, height: 56, objectFit: 'cover', borderRadius: '4px' }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: 3,
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  color: '#0F294A',
                  letterSpacing: '0.01em',
                }}
              >
                {m.caption}
              </span>
            </div>
          );
        })}
      </div>

      {/* Active Pothole Status Card */}
      <div className="mt-4 w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl text-white shadow-xl flex items-center justify-between gap-3 text-left">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
              activeMarker.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
            }`}>
              {activeMarker.status}
            </span>
            <span className="text-[10px] text-slate-300 flex items-center gap-1">
              <Clock className="w-3 h-3 text-orange-400" />
              {activeMarker.sla}
            </span>
          </div>
          <h4 className="font-bold text-xs sm:text-sm text-white truncate">{activeMarker.caption} Road Defect</h4>
          <p className="text-[11px] text-slate-300 truncate flex items-center gap-1">
            <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
            {activeMarker.caption}
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
