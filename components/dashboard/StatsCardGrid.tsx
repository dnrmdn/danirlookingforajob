'use client';

import { useDashboardStats } from '@/lib/api-client/analytics';
import { Send, Clock, Calendar, AlertTriangle } from 'lucide-react';

export function StatsCardGrid() {
  const { data: stats, isLoading } = useDashboardStats();

  const cards = [
    {
      label: 'Total Applied',
      value: stats?.totalApplications ?? 0,
      icon: Send,
      color: 'text-blue-400',
      bgClass: 'bg-blue-500/10',
      borderClass: 'border-blue-500/20'
    },
    {
      label: 'Pending Response',
      value: stats?.activeApplications ?? 0,
      icon: Clock,
      color: 'text-amber-400',
      bgClass: 'bg-amber-500/10',
      borderClass: 'border-amber-500/20'
    },
    {
      label: 'Interview Scheduled',
      value: stats?.interviewsScheduled ?? 0,
      icon: Calendar,
      color: 'text-violet-400',
      bgClass: 'bg-violet-500/10',
      borderClass: 'border-violet-500/20'
    },
    {
      label: 'Ghosted Alerts',
      value: stats?.ghosted ?? 0,
      icon: AlertTriangle,
      color: 'text-red-400',
      bgClass: 'bg-red-500/10',
      borderClass: 'border-red-500/20'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 h-[130px] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div 
            key={i}
            className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:bg-white/10 transition-colors`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 ${stat.bgClass.replace('/10', '')}`}></div>
            
            <div className="flex flex-col h-full z-10 relative">
              <div className={`w-10 h-10 rounded-xl ${stat.bgClass} ${stat.borderClass} border flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-gray-100">{stat.value}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
