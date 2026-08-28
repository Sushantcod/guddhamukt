import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  Heart, 
  Compass, 
  FileText, 
  BarChart3, 
  ShieldAlert, 
  PlusCircle 
} from 'lucide-react';
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
              <strong>Gaddhamukt</strong> is India’s open civic road accountability platform. Photo geo-tag dangerous potholes, track municipal engineer repair SLAs, and trigger automated RTI & CMO escalation dossiers.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[11px] font-bold">
                BBMP Urban & Gram Panchayat Grid
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

          {/* Column 3: Statutory Authority Info */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Statutory Helpdesk
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>BBMP Central Office, N.R. Square, Bengaluru - 560002</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Toll Free Helpline: 1533 / 080-22660000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <span>grievance@gaddhamukt.gov.in</span>
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
                All records published under Public Disclosure Act & Municipal Gazette Section 72.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Credit Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© 2025 Gaddhamukt Civic Portal. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with civic passion for safer roads</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline-block" />
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
