import React, { useState } from 'react';
import { ShieldCheck, HardHat, CheckCircle2, AlertTriangle, Clock, ChevronRight, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface RepairStage {
  id: string;
  title: string;
  stageBadge: string;
  location: string;
  slaTime: string;
  image: string;
  description: string;
  officer: string;
  contractor: string;
}

const REPAIR_STAGES: RepairStage[] = [
  {
    id: 'before',
    title: '1. Pothole Geo-Tagged & Reported',
    stageBadge: 'Grievance Registered',
    location: 'MG Road Metro Station Corridor, Bengaluru',
    slaTime: 'Repair Countdown Active',
    image: '/demo-images/pothole-1.jpg',
    description: 'Dangerous 4-inch deep asphalt depression logged by citizen with automatic GPS location pin.',
    officer: 'Er. R. K. Sharma (Junior Engineer, BBMP Ward 174)',
    contractor: 'Vanguard Infrastructure Pvt Ltd',
  },
  {
    id: 'repair',
    title: '2. Municipal Road Repair In Progress',
    stageBadge: 'Asphalt Compaction Active',
    location: 'MG Road Civil Work Site, Ward 174',
    slaTime: 'Work Order In Execution',
    image: '/demo-images/road-repair-work.jpg',
    description: 'Hot mix asphalt dispatched to site. Heavy compaction roller leveling sub-base layer.',
    officer: 'Er. R. K. Sharma (Site Inspection Logged)',
    contractor: 'Vanguard Infrastructure Crew #4',
  },
  {
    id: 'after',
    title: '3. Verified Smooth Resurfaced Road',
    stageBadge: 'Citizen Verified Fixed',
    location: 'MG Road Metro Station Corridor, Bengaluru',
    slaTime: 'Completed & Signed Off',
    image: '/demo-images/repair-proof.jpg',
    description: 'Freshly resurfaced asphalt patch completed and signed off by ward engineer & local residents.',
    officer: 'Verified & Closed by Executive Engineer',
    contractor: '3-Year Defect Liability Warranty Active',
  },
];

export const RoadRepairShowcase: React.FC = () => {
  const [activeStage, setActiveStage] = useState<RepairStage>(REPAIR_STAGES[1]);
  const [sliderPos, setSliderPos] = useState(50);
  const [viewMode, setViewMode] = useState<'stages' | 'compare'>('compare');

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 select-none">
      
      {/* Animated Tubelight Sliding Mode Switcher */}
      <div className="flex items-center justify-between bg-[#07172B]/90 border border-slate-700/80 rounded-full p-1.5 shadow-2xl relative">
        <div className="flex items-center gap-1 w-full">
          
          {/* Tab 1: Compare Slider */}
          <button
            type="button"
            onClick={() => setViewMode('compare')}
            className={`relative flex-1 py-2 rounded-full text-xs font-extrabold transition-colors cursor-pointer text-center ${
              viewMode === 'compare' ? 'text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            {viewMode === 'compare' && (
              <motion.div
                layoutId="showcase-active-tab"
                className="absolute inset-0 bg-[#123C69] rounded-full border border-white/20 shadow-md"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                {/* Tubelight Top Lamp Glow */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#F97316] rounded-full shadow-[0_-2px_10px_rgba(249,115,22,0.9)]" />
              </motion.div>
            )}
            <span className="relative z-10">Before & After Interactive Slider</span>
          </button>

          {/* Tab 2: 3-Stage Proof */}
          <button
            type="button"
            onClick={() => setViewMode('stages')}
            className={`relative flex-1 py-2 rounded-full text-xs font-extrabold transition-colors cursor-pointer text-center ${
              viewMode === 'stages' ? 'text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            {viewMode === 'stages' && (
              <motion.div
                layoutId="showcase-active-tab"
                className="absolute inset-0 bg-[#123C69] rounded-full border border-white/20 shadow-md"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                {/* Tubelight Top Lamp Glow */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#F97316] rounded-full shadow-[0_-2px_10px_rgba(249,115,22,0.9)]" />
              </motion.div>
            )}
            <span className="relative z-10">3-Stage Live Repair Proof</span>
          </button>

        </div>
      </div>

      {/* VIEW MODE 1: Interactive Before & After Slider */}
      {viewMode === 'compare' ? (
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-900 aspect-16/10 group">
          
          {/* AFTER IMAGE (Bottom Layer) */}
          <img
            src="/demo-images/repair-proof.jpg"
            alt="After Pothole Repair"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Fixed AFTER Badge (Top Right) */}
          <div className="absolute top-4 right-4 bg-emerald-600/90 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm border border-emerald-300/40 flex items-center gap-1.5 z-20 whitespace-nowrap pointer-events-none">
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>AFTER: Verified Fixed Road</span>
          </div>

          {/* Fixed BEFORE Badge (Top Left) */}
          <div 
            className="absolute top-4 left-4 bg-red-600/90 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm border border-red-300/40 flex items-center gap-1.5 z-20 whitespace-nowrap pointer-events-none transition-opacity duration-200"
            style={{ opacity: sliderPos > 10 ? 1 : 0 }}
          >
            <AlertTriangle className="w-4 h-4 text-red-200 shrink-0" />
            <span>BEFORE: Dangerous Road Pothole</span>
          </div>

          {/* BEFORE IMAGE (Top Layer Clipped by Slider) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src="/demo-images/pothole-1.jpg"
              alt="Before Pothole Repair"
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{ width: `${10000 / Math.max(sliderPos, 1)}%` }}
            />
          </div>

          {/* DRAGGABLE SLIDER HANDLE */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_15px_rgba(255,255,255,0.9)]"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-[#0F294A] shadow-2xl border-2 border-[#F97316] flex items-center justify-center font-black text-xs">
              ↔
            </div>
          </div>

          {/* Range Input for Dragging */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
          />

          {/* Bottom Overlay Info Strip */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent p-4 text-white text-left z-10 pointer-events-none">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-widest block">
                  Interactive Drag Slider Demonstration
                </span>
                <h4 className="font-extrabold text-sm sm:text-base text-white">
                  MG Road Metro Corridor Asphalt Resurfacing
                </h4>
              </div>
              <span className="px-3 py-1 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-400/30 text-xs font-black">
                Slide ↔ to Compare
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: 3-Stage Live Repair Proof Showcase */
        <div className="space-y-4">
          
          {/* Active Stage Main Image Card */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-900 aspect-16/10">
            <img
              src={activeStage.image}
              alt={activeStage.title}
              className="w-full h-full object-cover"
            />
            
            {/* Top Stage Badge */}
            <div className="absolute top-4 left-4 bg-[#0F294A]/90 text-white text-xs font-black px-3.5 py-1.5 rounded-2xl shadow-lg backdrop-blur-md border border-white/20 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] animate-pulse" />
              <span>{activeStage.stageBadge}</span>
            </div>

            <div className="absolute top-4 right-4 bg-emerald-600/90 text-white text-xs font-black px-3.5 py-1.5 rounded-2xl shadow-lg backdrop-blur-md border border-emerald-300/40 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-200" />
              <span>{activeStage.slaTime}</span>
            </div>

            {/* Bottom Card Info Overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent p-5 text-white text-left space-y-1">
              <h4 className="font-black text-base sm:text-lg text-white">{activeStage.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {activeStage.description}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] text-slate-300 border-t border-white/10 mt-2">
                <span className="flex items-center gap-1 text-orange-300">
                  <HardHat className="w-3.5 h-3.5" />
                  {activeStage.officer}
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  {activeStage.location}
                </span>
              </div>
            </div>
          </div>

          {/* 3 Stage Selector Tabs */}
          <div className="grid grid-cols-3 gap-2">
            {REPAIR_STAGES.map((stage) => (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStage(stage)}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeStage.id === stage.id
                    ? 'bg-[#F97316] text-white border-orange-400 shadow-lg scale-102'
                    : 'bg-white/10 text-slate-200 border-white/10 hover:bg-white/20'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-wider block opacity-90">
                  Stage {stage.id === 'before' ? '1' : stage.id === 'repair' ? '2' : '3'}
                </span>
                <span className="text-xs font-extrabold truncate block mt-0.5">{stage.stageBadge}</span>
              </button>
            ))}
          </div>

        </div>
      )}

      {/* Bottom CTA Card */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 rounded-2xl text-white shadow-xl flex items-center justify-between gap-3 text-left">
        <div className="space-y-0.5">
          <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-wider block">
            Automated Statutory Escalation
          </span>
          <h4 className="font-extrabold text-xs sm:text-sm text-white">
            Have a dangerous pothole on your street?
          </h4>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#ea580c] text-white text-xs font-black transition-all shadow-lg shrink-0 cursor-pointer transform hover:scale-105"
        >
          <span>Report Pothole</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};

export default RoadRepairShowcase;
