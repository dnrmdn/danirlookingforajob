'use client';

import { useApplications } from '@/lib/api-client/applications';
import { STATUS_CONFIG } from '@/lib/constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';

export function StatusChart() {
  const { data: applications = [] } = useApplications({ take: 100 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[300px] bg-white/5 rounded-2xl animate-pulse" />;

  // Count statuses from server data
  const counts: Record<string, number> = {};
  applications.forEach(app => {
    counts[app.status] = (counts[app.status] || 0) + 1;
  });
  
  const data = Object.entries(counts)
    .filter(([_, value]) => value > 0)
    .map(([status, value]) => ({
      name: STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.label || status,
      value,
      color: STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.color || '#6B7280',
    }));

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-[400px] flex flex-col">
      <h3 className="text-sm font-semibold text-gray-200 mb-6">Status Distribution</h3>
      
      <div className="flex-grow relative min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#111827', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#F9FAFB'
              }}
              itemStyle={{ color: '#F9FAFB' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-gray-100">{applications.length}</span>
          <span className="text-xs text-gray-400 font-mono uppercase">Total</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.slice(0, 6).map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="flex-1 truncate">{item.name}</span>
            <span className="text-gray-400 font-mono">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
