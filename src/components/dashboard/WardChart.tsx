import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Issue } from '../../types';

interface WardChartProps {
  issues: Issue[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Pothole: '#F97316', // Orange
  'Road Damage': '#2563EB', // Blue
  Drainage: '#06B6D4', // Cyan
  Waterlogging: '#0284C7', // Sky Blue
  Streetlight: '#8B5CF6', // Purple
  'Footpath Hazard': '#D97706', // Amber
};

export const WardChart: React.FC<WardChartProps> = ({ issues }) => {
  // Group by Ward / Village
  const wardMap: Record<string, { name: string; open: number; inProgress: number; resolved: number; overdue: number }> = {};

  issues.forEach((issue) => {
    const rawName = issue.wardOrVillage.split('(')[0].trim();
    if (!wardMap[rawName]) {
      wardMap[rawName] = { name: rawName, open: 0, inProgress: 0, resolved: 0, overdue: 0 };
    }

    if (issue.status === 'Resolved' || issue.status === 'Citizen Verified') {
      wardMap[rawName].resolved += 1;
    } else if (issue.isOverdue) {
      wardMap[rawName].overdue += 1;
    } else if (issue.status === 'Inspection Scheduled' || issue.status === 'Repair In Progress') {
      wardMap[rawName].inProgress += 1;
    } else {
      wardMap[rawName].open += 1;
    }
  });

  const barData = Object.values(wardMap);

  // Group by Category for Pie Chart
  const categoryMap: Record<string, number> = {};
  issues.forEach((issue) => {
    categoryMap[issue.category] = (categoryMap[issue.category] || 0) + 1;
  });

  const pieData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name] || '#64748B',
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Bar Chart: Resolution Status by Ward / Village */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div>
          <h3 className="font-extrabold text-[#123C69] text-base">
            Ward & Village Civic Resolution Breakdown
          </h3>
          <p className="text-xs text-slate-500">
            Comparing open backlog, active field repairs, and closed issues across divisions
          </p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderRadius: '12px',
                  color: '#FFF',
                  fontSize: '12px',
                  border: 'none',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="open" name="Reported / Open" fill="#94A3B8" radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="inProgress" name="Field Repair In Progress" fill="#F97316" radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="overdue" name="SLA Overdue" fill="#DC2626" radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="resolved" name="Resolved & Verified" fill="#15803D" radius={[4, 4, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Donut / Pie Chart: Category Distribution */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
        <div>
          <h3 className="font-extrabold text-[#123C69] text-base">Hazard Distribution</h3>
          <p className="text-xs text-slate-500">Breakdown of reported road defects</p>
        </div>

        <div className="h-56 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontSize: '12px',
                  border: 'none',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-extrabold text-[#123C69]">{issues.length}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Defects</span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 text-xs">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="truncate">{item.name} ({item.value})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
