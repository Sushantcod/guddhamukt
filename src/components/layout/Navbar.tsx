import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  PlusCircle, 
  BarChart3, 
  FileText, 
  ShieldAlert, 
  Menu, 
  X,
  Compass,
  Building2,
  Trees,
  UserCircle,
  LogOut
} from 'lucide-react';
import { CivicMode } from '../../types';
import { Logo } from '../common/Logo';

interface NavbarProps {
  currentMode?: CivicMode;
  onModeChange?: (mode: CivicMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentMode, onModeChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userSession, setUserSession] = useState<{ name: string; role: string } | null>(null);
  const location = useLocation();

  useEffect(() => {
    const raw = localStorage.getItem('gm_user_session');
    if (raw) {
      try {
        setUserSession(JSON.parse(raw));
      } catch (e) {
        setUserSession(null);
      }
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('gm_user_session');
    setUserSession(null);
  };

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
    <header className="sticky top-0 z-40 bg-[#0F294A] text-white shadow-lg border-b border-[#1A3D68]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Official Logo */}
          <div className="flex items-center gap-4">
            <Logo size="md" theme="dark" />

            {/* Urban / Rural Mode Selector Pill in Navbar */}
            {onModeChange && (
              <div className="hidden lg:flex items-center bg-[#08182B] p-1 rounded-lg border border-white/10 ml-3">
                <button
                  type="button"
                  onClick={() => onModeChange('urban')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
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
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
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

          {/* Action CTA & Login Portal Link */}
          <div className="flex items-center gap-3 sm:gap-4">
            {userSession ? (
              <div className="hidden sm:flex items-center gap-2 bg-[#123C69] border border-white/15 px-2.5 py-1.5 rounded-lg text-xs">
                <UserCircle className="w-4 h-4 text-orange-400" />
                <div className="flex flex-col text-left">
                  <span className="font-bold text-white leading-tight">{userSession.name}</span>
                  <span className="text-[9px] text-slate-300 capitalize">{userSession.role}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Logout session"
                  className="ml-1 p-1 text-slate-300 hover:text-red-400 hover:bg-white/10 rounded-md transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  location.pathname === '/login'
                    ? 'bg-white/20 text-white border-white/30'
                    : 'bg-[#123C69]/60 hover:bg-[#123C69] text-slate-200 hover:text-white border-white/10'
                }`}
              >
                <UserCircle className="w-4 h-4 text-orange-400" />
                <span>Demo Login</span>
              </Link>
            )}

            <Link
              to="/report"
              id="nav-report-button"
              className="inline-flex items-center gap-1.5 bg-[#F97316] hover:bg-[#ea580c] text-white px-3.5 sm:px-4 py-2 rounded-lg font-bold text-xs sm:text-sm shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
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
        <div className="md:hidden border-t border-[#1A3D68] bg-[#0F294A] px-4 pt-3 pb-6 space-y-3">
          {onModeChange && (
            <div className="flex items-center justify-between bg-[#08182B] p-1 rounded-lg mb-3">
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

            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-bold text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 transition-all border border-orange-500/20 mt-2"
            >
              <UserCircle className="w-4 h-4 text-orange-400" />
              <span>Demo Login / Officer Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
