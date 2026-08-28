import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendPositive?: boolean;
  iconType: 'reports' | 'resolved' | 'overdue' | 'inProgress' | 'escalated';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendPositive,
  iconType,
}) => {
  const getCardConfig = () => {
    switch (iconType) {
      case 'resolved':
        return {
          icon: CheckCircle2,
          topBorder: 'border-t-4 border-emerald-500',
          valueColor: 'text-[#0F294A]',
          iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        };
      case 'overdue':
        return {
          icon: AlertTriangle,
          topBorder: 'border-t-4 border-red-500',
          valueColor: 'text-[#0F294A]',
          iconBg: 'bg-red-50 text-red-600 border-red-200',
        };
      case 'escalated':
        return {
          icon: ShieldAlert,
          topBorder: 'border-t-4 border-purple-500',
          valueColor: 'text-[#0F294A]',
          iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
        };
      case 'inProgress':
        return {
          icon: Clock,
          topBorder: 'border-t-4 border-[#F97316]',
          valueColor: 'text-[#0F294A]',
          iconBg: 'bg-orange-50 text-[#F97316] border-orange-200',
        };
      default:
        return {
          icon: TrendingUp,
          topBorder: 'border-t-4 border-[#0F294A]',
          valueColor: 'text-[#0F294A]',
          iconBg: 'bg-slate-100 text-[#0F294A] border-slate-200',
        };
    }
  };

  const config = getCardConfig();
  const Icon = config.icon;

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-3 transition-all hover:shadow-md hover:-translate-y-0.5 select-none ${config.topBorder}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center border shadow-2xs ${config.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div>
        <div className={`text-2xl sm:text-3xl font-black font-['Plus_Jakarta_Sans',sans-serif] ${config.valueColor}`}>
          {value}
          {subtitle && (
            <span className="text-[11px] font-semibold text-slate-400 ml-1.5 inline-block">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {trend && (
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] font-bold">
          <span className={`px-1.5 py-0.5 rounded ${trendPositive ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'bg-red-50 text-red-700 font-extrabold'}`}>
            {trendPositive ? '↑' : '↓'} {trend}
          </span>
          <span className="text-slate-400 font-semibold">vs previous cycle</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
