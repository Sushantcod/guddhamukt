import React, { useEffect, useRef, useCallback, useState } from "react";
import createGlobe from "cobe";
import { Link } from "react-router-dom";
import { Clock, MapPin, ChevronRight, PlusCircle } from "lucide-react";

export interface PolaroidMarker {
  id: string;
  location: [number, number];
  image: string;
  caption: string;
  rotate: number;
  status: "Reported" | "Repair In Progress" | "Resolved";
  sla: string;
}

const defaultMarkers: PolaroidMarker[] = [
  {
    id: "pothole-bengaluru",
    location: [12.9716, 77.5946],
    image: "/demo-images/pothole-1.jpg",
    caption: "MG Road Pothole",
    rotate: -5,
    status: "Repair In Progress",
    sla: "42h remaining",
  },
  {
    id: "pothole-koramangala",
    location: [12.9279, 77.6271],
    image: "/demo-images/pothole-2.jpg",
    caption: "Koramangala Trench",
    rotate: 4,
    status: "Reported",
    sla: "68h remaining",
  },
  {
    id: "pothole-[#10B981]",
    location: [12.9784, 77.6408],
    image: "/demo-images/repair-proof.jpg",
    caption: "Indiranagar Fixed",
    rotate: -3,
    status: "Resolved",
    sla: "Fixed in 24h",
  },
  {
    id: "pothole-rampur",
    location: [26.8467, 80.9462],
    image: "/demo-images/pothole-1.jpg",
    caption: "Rampur PMGSY Road",
    rotate: 5,
    status: "Repair In Progress",
    sla: "18h remaining",
  },
];

interface GlobePolaroidsProps {
  markers?: PolaroidMarker[];
  className?: string;
  speed?: number;
}

export const GlobeComponent: React.FC<GlobePolaroidsProps> = ({
  markers = defaultMarkers,
  className = "",
  speed = 0.003,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const [activeMarker, setActiveMarker] = useState<PolaroidMarker>(markers[0]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
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
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
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
        width,
        height: width,
        phi: 0,
        theta: 0.2,
        dark: 0,
        diffuse: 1.5,
        mapSamples: 16000,
        mapBrightness: 9,
        baseColor: [0.1, 0.2, 0.35],
        markerColor: [0.97, 0.45, 0.08],
        glowColor: [0.07, 0.16, 0.29],
        markerElevation: 0.05,
        markers: markers.map((m) => ({ location: m.location, size: 0.045, id: m.id })),
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
      setTimeout(() => canvas && (canvas.style.opacity = "1"), 100);
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
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      
      {/* 3D Cobe Globe Canvas */}
      <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] aspect-square rounded-full flex items-center justify-center shadow-2xl border border-white/20 bg-[#0A1E36]">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          className="w-full h-full cursor-grab active:cursor-grabbing rounded-full touch-none opacity-0 transition-opacity duration-1000"
        />

        {/* Polaroid Marker Cards Floating Overlay */}
        {markers.map((m) => (
          <div
            key={m.id}
            onClick={() => setActiveMarker(m)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 transform hover:scale-110 group z-20"
            style={{
              transform: `rotate(${m.rotate}deg)`,
            }}
          >
            {/* Minimal Polaroid Frame */}
            <div className="bg-white p-1.5 pb-5 rounded-lg shadow-xl border border-slate-200 text-center w-16 sm:w-20 hover:border-orange-500">
              <img
                src={m.image}
                alt={m.caption}
                className="w-full h-12 sm:h-14 object-cover rounded"
              />
              <span className="block text-[8px] font-extrabold text-slate-800 mt-1 truncate">
                {m.caption}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Marker Active Card Banner */}
      <div className="mt-4 w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl text-white shadow-2xl flex items-center justify-between gap-3 text-left">
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
          <h4 className="font-bold text-xs sm:text-sm text-white truncate">{activeMarker.caption}</h4>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F97316] hover:bg-[#ea580c] text-white text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Report Pothole</span>
        </Link>
      </div>

    </div>
  );
};

export default GlobeComponent;
