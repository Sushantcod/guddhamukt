import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Heart, 
  Compass, 
  FileText, 
  BarChart3, 
  ShieldAlert, 
  PlusCircle,
  Building2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from '../common/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07172B] text-slate-300 border-t border-slate-800 pt-12 pb-8 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 text-left">
          
          {/* Column 1: Brand Info & Mission */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="md" theme="dark" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-medium">
              <strong>Gaddhamukt</strong> is India’s open civic road accountability platform. Photo geo-tag dangerous road potholes, track municipal engineer repair SLAs, and trigger automated RTI & CMO escalation dossiers.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[11px] font-bold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>LPU Punjab & BBMP Urban Grid</span>
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link to="/" className="hover:text-orange-400 transition-colors flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-orange-400" />
                  <span>Geospatial Issue Map</span>
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-orange-400 transition-colors flex items-center gap-2">
                  <PlusCircle className="w-3.5 h-3.5 text-orange-400" />
                  <span>Report Road Pothole</span>
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-orange-400 transition-colors flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-orange-400" />
                  <span>Track Complaint SLA</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-orange-400 transition-colors flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-orange-400" />
                  <span>Public Governance Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-orange-400 transition-colors flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />
                  <span>Municipal Officer Operations</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Statutory Authority Info (LPU Punjab & National Helpdesk) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Statutory Helpdesk
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>NH-44 GT Road Corridor, LPU Phagwara & Jalandhar Zone, Punjab - 144411</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Toll Free Helpline: 1800-180-2468 / 1533</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <span>lpu.grievance@gaddhamukt.gov.in</span>
              </li>
            </ul>
          </div>

          {/* Column 4: SLA Directive */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Legal Directive
            </h4>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>RTI Compliant</span>
              </div>
              <p className="leading-snug text-slate-400">
                All records published under Public Disclosure Act & Municipal Gazette.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Credit Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© 2025 Gaddhamukt Civic Portal. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span>Crafted with</span>
            <motion.span
              animate={{ scale: [1, 1.3, 1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              className="inline-block"
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            </motion.span>
            <span>by <strong className="text-white font-extrabold text-xs tracking-wide">Sushant Chand</strong> for safer roads</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
