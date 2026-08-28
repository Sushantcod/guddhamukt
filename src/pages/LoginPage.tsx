import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  User, 
  HardHat, 
  Building2, 
  Trees, 
  Lock, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { GlowPillButton } from '../components/ui/GlowPillButton';

type DemoRole = 'citizen' | 'ward_engineer' | 'commissioner' | 'sarpanch';

interface RoleProfile {
  id: DemoRole;
  title: string;
  badge: string;
  icon: React.ElementType;
  dept: string;
  defaultIdentifier: string;
  defaultPass: string;
  permissions: string[];
  redirectPath: string;
  mode: 'urban' | 'rural' | 'all';
}

const DEMO_PROFILES: RoleProfile[] = [
  {
    id: 'citizen',
    title: 'Citizen Reporter',
    badge: 'Public User',
    icon: User,
    dept: 'Civic Grievance System',
    defaultIdentifier: '+91 98450 12345',
    defaultPass: '123456 (Demo OTP)',
    permissions: [
      'Report new potholes & road damage',
      'Track live grievance SLA resolution',
      'Download legal escalation PDF dossiers',
      'Rate contractor repair quality',
    ],
    redirectPath: '/',
    mode: 'all',
  },
  {
    id: 'ward_engineer',
    title: 'Ward Junior Engineer',
    badge: 'Municipal Official',
    icon: HardHat,
    dept: 'BBMP Ward 174 Engineering Sub-Division',
    defaultIdentifier: 'je.ward174@bbmp.gov.in',
    defaultPass: 'engineer@2025',
    permissions: [
      'Acknowledge new road reports',
      'Schedule on-site civil inspections',
      'Upload contractor repair proof photos',
      'Close tickets within 72h statutory SLA',
    ],
    redirectPath: '/admin',
    mode: 'urban',
  },
  {
    id: 'sarpanch',
    title: 'Gram Panchayat Sarpanch',
    badge: 'Rural Head',
    icon: Trees,
    dept: 'Rampur Village Panchayat Works Cell',
    defaultIdentifier: 'sarpanch.rampur@grama.gov.in',
    defaultPass: 'sarpanch@2025',
    permissions: [
      'Review PMGSY village asphalt complaints',
      'Dispatch road leveling squads',
      'Route unresolved issues to District BDO',
    ],
    redirectPath: '/admin',
    mode: 'rural',
  },
  {
    id: 'commissioner',
    title: 'Municipal Commissioner',
    badge: 'Apex Admin',
    icon: Building2,
    dept: 'Urban Local Body Headquarters',
    defaultIdentifier: 'commissioner.hq@civic.gov.in',
    defaultPass: 'admin@apex2025',
    permissions: [
      'City-wide ward performance audit',
      'Audit contractor warranty compliance',
      'Process high-level RTI & CMO escalations',
      'Reallocate civil maintenance budgets',
    ],
    redirectPath: '/dashboard',
    mode: 'urban',
  },
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<DemoRole>('citizen');
  const [identifier, setIdentifier] = useState(DEMO_PROFILES[0].defaultIdentifier);
  const [password, setPassword] = useState(DEMO_PROFILES[0].defaultPass);
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const activeProfile = DEMO_PROFILES.find((p) => p.id === selectedRole) || DEMO_PROFILES[0];

  const handleRoleSelect = (role: DemoRole) => {
    setSelectedRole(role);
    const profile = DEMO_PROFILES.find((p) => p.id === role);
    if (profile) {
      setIdentifier(profile.defaultIdentifier);
      setPassword(profile.defaultPass);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Save session in local storage
    setTimeout(() => {
      setIsLoading(false);
      setAuthSuccess(true);

      const sessionData = {
        role: activeProfile.id,
        name: activeProfile.title,
        dept: activeProfile.dept,
        identifier,
        loggedInAt: new Date().toISOString(),
      };
      localStorage.setItem('gm_user_session', JSON.stringify(sessionData));

      setTimeout(() => {
        navigate(activeProfile.redirectPath);
      }, 700);
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#0F294A] via-[#123C69] to-slate-900 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Brand Story & Authority Highlight */}
        <div className="lg:col-span-5 text-white space-y-6">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl inline-block border border-white/15">
            <Logo size="lg" theme="dark" isLink={false} />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Unified Civic Portal Demo</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug font-['Plus_Jakarta_Sans',sans-serif]">
              Transparent Roads. <br />
              <span className="text-[#F97316]">Direct Accountability.</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Login to report civic road hazards, monitor statutory SLA resolution timers, or access the municipal administration dashboard.
            </p>
          </div>

          {/* Quick Role Perks Box */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
              Active Persona: <strong className="text-orange-400">{activeProfile.title}</strong>
            </span>
            <ul className="space-y-1.5 text-xs text-slate-200">
              {activeProfile.permissions.map((perm, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{perm}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side: Interactive Login Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
          {/* Persona Switcher Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Select Demo Persona
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DEMO_PROFILES.map((profile) => {
                const Icon = profile.icon;
                const isSelected = selectedRole === profile.id;
                return (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => handleRoleSelect(profile.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#123C69] text-white border-[#123C69] shadow-md transform -translate-y-0.5'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-[#F97316]' : 'text-slate-500'}`} />
                    <span className="text-[11px] font-bold leading-tight">{profile.title}</span>
                    <span className={`text-[9px] mt-0.5 font-medium ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                      {profile.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {selectedRole === 'citizen' ? 'Mobile Number / WhatsApp ID' : 'Official Government Email ID'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  {selectedRole === 'citizen' ? <Phone className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all"
                  placeholder={selectedRole === 'citizen' ? '+91 98450 XXXXX' : 'officer@gov.in'}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  {selectedRole === 'citizen' ? 'One-Time Password (OTP)' : 'Official Access Password'}
                </label>
                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                  Demo Auto-Filled
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all"
                  placeholder="Enter demo passcode"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-[#F97316] focus:ring-[#F97316] w-4 h-4"
                />
                <span>Remember session</span>
              </label>
              <Link to="/track" className="text-[#123C69] hover:underline font-semibold">
                Track complaint without login
              </Link>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || authSuccess}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#123C69] hover:bg-[#0c2a4a] transition-all shadow-md hover:shadow-lg cursor-pointer transform active:scale-98 disabled:opacity-75"
              >
                {isLoading ? (
                  <span>Authenticating Session...</span>
                ) : authSuccess ? (
                  <span className="flex items-center gap-1.5 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" /> Login Successful! Redirecting...
                  </span>
                ) : (
                  <>
                    <span>Enter as {activeProfile.title}</span>
                    <ArrowRight className="w-4 h-4 text-[#F97316]" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Notice */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5 text-[11px] text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Secure Simulated Environment:</strong> No real passwords required. You can toggle any persona above to test the platform as a citizen, junior engineer, or commissioner.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
