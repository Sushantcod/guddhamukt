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
  LogOut,
  Sparkles
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
    { label: 'Admin Portal', path: '/admin', icon: ShieldAlert },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0F294A]/95 backdrop-blur-md text-white shadow-xl border-b border-[#1E3E66]">
      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* LEFT CORNER: Official Brand Logo */}
          <div className="flex items-center gap-6 shrink-0">
            <Logo size="md" theme="dark" />

            {/* Urban / Rural Mode Selector Pill */}
            {onModeChange && (
              <div className="hidden xl:flex items-center bg-[#07172B] p-1 rounded-full border border-white/10 shadow-inner">
                <button
                  type="button"
                  onClick={() => onModeChange('urban')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    currentMode === 'urban'
                      ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Urban City
                </button>
                <button
                  type="button"
                  onClick={() => onModeChange('rural')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    currentMode === 'rural'
                      ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Trees className="w-3.5 h-3.5" />
                  Rural Village
                </button>
              </div>
            )}
          </div>

          {/* CENTER: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#08192D]/80 p-1.5 rounded-2xl border border-white/10 shadow-inner">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all text-xs font-bold ${
                    active
                      ? 'bg-[#123C69] text-[#F97316] shadow-sm border border-white/15'
                      : 'text-slate-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#F97316]' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* RIGHT CORNER: Login Portal & Report Issue CTA */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Demo Login / Active Session Pill */}
            {userSession ? (
              <div className="flex items-center gap-2 bg-[#123C69] border border-white/20 px-3 py-1.5 rounded-xl text-xs shadow-sm">
                <UserCircle className="w-4 h-4 text-[#F97316]" />
                <div className="flex flex-col text-left">
                  <span className="font-extrabold text-white leading-tight">{userSession.name}</span>
                  <span className="text-[9px] text-slate-300 capitalize">{userSession.role}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Logout session"
                  className="ml-1 p-1 text-slate-300 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm cursor-pointer ${
                  location.pathname === '/login'
                    ? 'bg-white text-[#0F294A] border-white shadow-md'
                    : 'bg-[#123C69]/80 hover:bg-[#123C69] text-slate-100 hover:text-white border-white/15 hover:border-white/30'
                }`}
              >
                <UserCircle className="w-4 h-4 text-[#F97316]" />
                <span>Login</span>
              </Link>
            )}

            {/* High Impact Report Issue CTA */}
            <Link
              to="/report"
              id="nav-report-button"
              className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#F97316] via-[#ea580c] to-[#c2410c] hover:from-[#ea580c] hover:to-[#9a3412] text-white px-4 sm:px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 border border-orange-400/30"
            >
              <PlusCircle className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-300" />
              <span>Report Issue</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1E3E66] bg-[#0F294A] px-4 pt-4 pb-6 space-y-4 shadow-2xl">
          {onModeChange && (
            <div className="flex items-center justify-between bg-[#07172B] p-1 rounded-xl border border-white/10">
              <button
                onClick={() => {
                  onModeChange('urban');
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold cursor-pointer ${
                  currentMode === 'urban' ? 'bg-[#F97316] text-white shadow-sm' : 'text-slate-300'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Urban (Bengaluru)
              </button>
              <button
                onClick={() => {
                  onModeChange('rural');
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold cursor-pointer ${
                  currentMode === 'rural' ? 'bg-[#F97316] text-white shadow-sm' : 'text-slate-300'
                }`}
              >
                <Trees className="w-4 h-4" />
                Rural (Rampur)
              </button>
            </div>
          )}

          <div className="space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    active ? 'bg-[#123C69] text-[#F97316] border border-white/15' : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#F97316]' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-orange-300 bg-orange-500/15 hover:bg-orange-500/25 transition-all border border-orange-500/30 mt-3"
            >
              <UserCircle className="w-4 h-4 text-orange-400" />
              <span>Officer & Citizen Login</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
