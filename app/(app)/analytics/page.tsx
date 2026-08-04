'use client';

import { useApplications } from '@/lib/api-client/applications';
import { useDashboardStats } from '@/lib/api-client/analytics';
import { Target, TrendingUp, Users, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { SOURCE_CONFIG } from '@/lib/constants';

export default function AnalyticsPage() {
  const { data: applications = [], isLoading: appsLoading } = useApplications({ take: 100 });
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  const isLoading = appsLoading || statsLoading;

  const totalApplications = stats?.totalApplications ?? 0;
  const activeCount = stats?.activeApplications ?? 0;
  const closedCount = totalApplications - activeCount;
  const interviewsScheduled = stats?.interviewsScheduled ?? 0;

  // Calculate response rate from application data
  const respondedCount = applications.filter(a => 
    !['APPLYING', 'APPLIED'].includes(a.status)
  ).length;
  const responseRate = totalApplications > 0 
    ? Math.round((respondedCount / totalApplications) * 100) 
    : 0;

  const interviewRate = totalApplications > 0 
    ? Math.round((interviewsScheduled / totalApplications) * 100) 
    : 0;

  // Mock data for charts (would be replaced with real time-series data from analytics API)
  const timeData = [
    { name: 'Week 1', count: 2 },
    { name: 'Week 2', count: 5 },
    { name: 'Week 3', count: 3 },
    { name: 'Week 4', count: 8 },
    { name: 'Week 5', count: 6 },
  ];

  // Calculate source breakdown from live data
  const sourceCounts: Record<string, number> = {};
  applications.forEach(app => {
    sourceCounts[app.source] = (sourceCounts[app.source] || 0) + 1;
  });

  const sourceData = Object.entries(sourceCounts)
    .map(([source, count]) => ({
      name: SOURCE_CONFIG[source as keyof typeof SOURCE_CONFIG]?.label || source,
      count,
      color: SOURCE_CONFIG[source as keyof typeof SOURCE_CONFIG]?.color || '#6B7280'
    }))
    .sort((a, b) => b.count - a.count);

  if (isLoading) {
    return (
      <div className="space-y-8 flex-grow">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Analytics Overview</h1>
          <p className="text-gray-400 mt-2">Insights and trends from your job search.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 h-[130px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 flex-grow">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Analytics Overview</h1>
        <p className="text-gray-400 mt-2">Insights and trends from your job search.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-violet-400" />
            </div>
            <p className="text-sm font-medium text-gray-400">Total Applications</p>
          </div>
          <h3 className="text-3xl font-bold text-gray-100">{totalApplications}</h3>
          <p className="text-xs text-gray-500 mt-2">
            <span className="text-green-400 font-medium">{activeCount}</span> active, {closedCount} closed
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-sm font-medium text-gray-400">Response Rate</p>
          </div>
          <h3 className="text-3xl font-bold text-gray-100">{responseRate}%</h3>
          <p className="text-xs text-gray-500 mt-2">Passed initial application phase</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-pink-400" />
            </div>
            <p className="text-sm font-medium text-gray-400">Interview Rate</p>
          </div>
          <h3 className="text-3xl font-bold text-gray-100">{interviewRate}%</h3>
          <p className="text-xs text-gray-500 mt-2">Reached interview stages</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-sm font-medium text-gray-400">Avg. Response Time</p>
          </div>
          <h3 className="text-3xl font-bold text-gray-100">~8d</h3>
          <p className="text-xs text-gray-500 mt-2">Estimated time to first reply</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Over Time */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-[400px] flex flex-col">
          <h3 className="text-sm font-semibold text-gray-200 mb-6">Applications Over Time</h3>
          <div className="flex-grow min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#F9FAFB' }}
                />
                <Area type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Breakdown */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-[400px] flex flex-col">
          <h3 className="text-sm font-semibold text-gray-200 mb-6">Applications by Source</h3>
          <div className="flex-grow min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <RechartsTooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
