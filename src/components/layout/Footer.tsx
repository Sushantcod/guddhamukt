import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ExternalLink, Activity, Server, Database } from 'lucide-react';
import { SourceBadge } from '../common/SourceBadge';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-200">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-[#F97316] text-white flex items-center justify-center font-bold text-sm">
                GM
              </div>
              <span className="text-lg font-bold tracking-tight text-[#123C69] font-['Plus_Jakarta_Sans',sans-serif]">
                Guddha<span className="text-[#F97316]">Mutk</span>
              </span>
              <SourceBadge type="demo" className="ml-2" />
            </div>
            <p className="text-slate-600 text-xs leading-relaxed max-w-md">
              A civic road-issue reporting, tracking, and escalation platform bridging citizen vigilance with executive municipal and rural road accountability.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
              <span className="inline-flex items-center gap-1">
                <Database className="w-3 h-3 text-[#123C69]" /> Local Storage Persistence
              </span>
              <span className="inline-flex items-center gap-1">
                <Activity className="w-3 h-3 text-emerald-600" /> SLA Engine Active
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#123C69] text-xs font-bold uppercase tracking-wider mb-3">
              Platform Views
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link to="/" className="hover:text-[#F97316] transition-colors">
                  Interactive Issue Map
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-[#F97316] transition-colors">
                  Report Road Defect
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-[#F97316] transition-colors">
                  Track Complaint & Escalation
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#F97316] transition-colors">
                  Public Analytics Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#F97316] transition-colors">
                  Authority Demo Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Grievance Portals */}
          <div>
            <h4 className="text-[#123C69] text-xs font-bold uppercase tracking-wider mb-3">
              Official Grievance Portals
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a
                  href="https://pgportal.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-[#123C69] transition-colors"
                >
                  CPGRAMS National Portal <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://bbmp.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-[#123C69] transition-colors"
                >
                  BBMP Grievance Redressal <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://omms.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-[#123C69] transition-colors"
                >
                  PMGSY Rural Roads (OMMS) <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://jansunwai.up.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-[#123C69] transition-colors"
                >
                  Jansunwai State Portal <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Technical Status Strip */}
      <div className="bg-slate-50 border-t border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-medium">
          <div>
            © 2024 GuddhaMutk Civic Initiative • OpenStreetMap Data Integration
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Server Status: <strong className="text-emerald-700 uppercase font-bold">Online</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span>Instance: <strong className="text-slate-700">Karnataka-S1</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

