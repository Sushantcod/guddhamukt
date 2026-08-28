import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  isLink?: boolean;
  className?: string;
  theme?: 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = true,
  isLink = true,
  className = '',
  theme = 'dark',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  const content = (
    <div className={`flex items-center gap-3 group ${className}`}>
      {/* Official Circular Emblem */}
      <div
        className={`${iconSizes[size]} shrink-0 rounded-full bg-white p-1 shadow-md border border-slate-100 flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden`}
      >
        <img
          src="/logo.svg"
          alt="GuddhaMutk Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <h1
            className={`${titleSizes[size]} font-extrabold leading-tight tracking-tight font-['Plus_Jakarta_Sans',sans-serif] ${
              theme === 'dark' ? 'text-white' : 'text-[#0F294A]'
            }`}
          >
            GUDDHA<span className="text-[#F97316]">MUTK</span>
          </h1>
        </div>
        {showTagline && (
          <p
            className={`text-[9px] sm:text-[10px] uppercase tracking-widest font-bold ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Civic Road Accountability
          </p>
        )}
      </div>
    </div>
  );

  if (isLink) {
    return (
      <Link to="/" className="inline-block focus:outline-hidden">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
