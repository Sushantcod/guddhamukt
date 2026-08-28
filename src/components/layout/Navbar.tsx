import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MapPin, 
  PlusCircle, 
  Search, 
  BarChart3, 
  FileText, 
  ShieldAlert, 
  Menu, 
  X,
  Compass,
  Building2,
  Trees
} from 'lucide-react';
import { CivicMode } from '../../types';

interface NavbarProps {
  currentMode?: CivicMode;
  onModeChange?: (mode: CivicMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentMode, onModeChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Issue Map', path: '/', icon: Compass },
    { label: 'Track Complaint', path: '/track', icon: FileText },
    { label: 'Public Dashboard', path: '/dashboard', icon: BarChart3 },
    { label: 'Admin Demo', path: '/admin', icon: ShieldAlert },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#123C69] text-white shadow-lg border-b border-[#0f2d4e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#F97316] rounded-lg flex items-center justify-center font-bold text-xl text-white shadow-sm transition-transform group-hover:scale-105">
                GM
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
                    Guddha<span className="text-[#F97316]">Mutk</span>
                  </h1>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-slate-300 font-medium">
                  Civic Accountability Platform
                </p>
              </div>
            </Link>

            {/* Urban / Rural Mode Selector Pill in Navbar */}
            {onModeChange && (
              <div className="hidden lg:flex items-center bg-[#0d2a4a] p-1 rounded-lg border border-white/10 ml-3">
                <button
                  type="button"
                  onClick={() => onModeChange('urban')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    currentMode === 'urban'
                      ? 'bg-[#F97316] text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Urban City
                </button>
                <button
                  type="button"
                  onClick={() => onModeChange('rural')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    currentMode === 'rural'
                      ? 'bg-[#F97316] text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Trees className="w-3.5 h-3.5" />
                  Rural Village
                </button>
              </div>
            )}
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 transition-all text-xs font-bold ${
                    active
                      ? 'text-[#F97316] border-b-2 border-[#F97316] pb-1'
                      : 'text-slate-200 hover:text-white pb-1'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#F97316]' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTA & Technical Node Indicator */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-xs font-bold text-slate-100">Live Grid</span>
              <span className="text-[10px] text-slate-300 tracking-tight">Ward 174, BLR</span>
            </div>

            <Link
              to="/report"
              id="nav-report-button"
              className="inline-flex items-center gap-1.5 bg-[#F97316] hover:bg-[#ea580c] text-white px-4 py-2 rounded-md font-bold text-xs sm:text-sm shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>Report Issue</span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#0f2d4e] bg-[#123C69] px-4 pt-3 pb-6 space-y-3">
          {onModeChange && (
            <div className="flex items-center justify-between bg-[#0d2a4a] p-1 rounded-lg mb-3">
              <button
                onClick={() => {
                  onModeChange('urban');
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-bold ${
                  currentMode === 'urban' ? 'bg-[#F97316] text-white' : 'text-slate-300'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Urban (Bengaluru)
              </button>
              <button
                onClick={() => {
                  onModeChange('rural');
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-bold ${
                  currentMode === 'rural' ? 'bg-[#F97316] text-white' : 'text-slate-300'
                }`}
              >
                <Trees className="w-3.5 h-3.5" />
                Rural (Rampur)
              </button>
            </div>
          )}

          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-bold transition-all ${
                    active ? 'bg-white/15 text-[#F97316]' : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#F97316]' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
