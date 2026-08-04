'use client';

import { useDashboardStats } from '@/lib/api-client/analytics';
import { StatsCardGrid } from '@/components/dashboard/StatsCardGrid';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { RecentApplications } from '@/components/dashboard/RecentApplications';
import { Hand } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function DashboardPage() {
  const { data: stats } = useDashboardStats();
  const { firstName } = useCurrentUser();
  const activeCount = stats?.activeApplications ?? 0;

  return (
    <div className="space-y-8 flex-grow">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
            Welcome back, {firstName} <Hand className="w-8 h-8 text-amber-400 animate-wave" />
          </h1>
          <p className="text-gray-400 mt-2">
            You have <span className="text-violet-400 font-semibold">{activeCount}</span> active applications.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCardGrid />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StatusChart />
        </div>
        <div className="lg:col-span-2">
          <RecentApplications />
        </div>
      </div>
      
      {/* Wave Animation Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes wave {
          0% { transform: rotate(0.0deg) }
          10% { transform: rotate(14.0deg) }
          20% { transform: rotate(-8.0deg) }
          30% { transform: rotate(14.0deg) }
          40% { transform: rotate(-4.0deg) }
          50% { transform: rotate(10.0deg) }
          60% { transform: rotate(0.0deg) }
          100% { transform: rotate(0.0deg) }
        }
        .animate-wave {
          animation: wave 2.5s infinite;
          transform-origin: 70% 70%;
        }
      `}} />
    </div>
  );
}
