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
          topBorder: 'border-t-4 border-[#15803D]',
          valueColor: 'text-[#15803D]',
          iconBg: 'bg-emerald-50 text-[#15803D] border-emerald-200',
        };
      case 'overdue':
        return {
          icon: AlertTriangle,
          topBorder: 'border-t-4 border-[#DC2626]',
          valueColor: 'text-[#DC2626]',
          iconBg: 'bg-red-50 text-[#DC2626] border-red-200',
        };
      case 'escalated':
        return {
          icon: ShieldAlert,
          topBorder: 'border-t-4 border-purple-600',
          valueColor: 'text-purple-700',
          iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
        };
      case 'inProgress':
        return {
          icon: Clock,
          topBorder: 'border-t-4 border-[#F97316]',
          valueColor: 'text-[#F97316]',
          iconBg: 'bg-orange-50 text-[#F97316] border-orange-200',
        };
      default:
        return {
          icon: TrendingUp,
          topBorder: 'border-t-4 border-[#2563EB]',
          valueColor: 'text-[#123C69]',
          iconBg: 'bg-blue-50 text-[#2563EB] border-blue-200',
        };
    }
  };

  const config = getCardConfig();
  const Icon = config.icon;

  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex flex-col justify-between space-y-2.5 ${config.topBorder}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">
          {title}
        </span>
        <div className={`w-8 h-8 rounded-md flex items-center justify-center border ${config.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div>
        <div className={`text-2xl sm:text-3xl font-black font-['Plus_Jakarta_Sans',sans-serif] ${config.valueColor}`}>
          {value}
          {subtitle && (
            <span className="text-xs font-normal text-slate-400 ml-1.5 inline-block">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {trend && (
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1 text-[10px] font-bold">
          <span className={trendPositive ? 'text-emerald-600' : 'text-red-600'}>
            {trendPositive ? '↑' : '↓'} {trend}
          </span>
          <span className="text-slate-400 font-normal">vs previous cycle</span>
        </div>
      )}
    </div>
  );
};

