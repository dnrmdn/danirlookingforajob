'use client';

import { useApplications } from '@/lib/api-client/applications';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { getDurationText } from '@/lib/utils';
import { ArrowRight, Building2 } from 'lucide-react';
import Link from 'next/link';

export function RecentApplications() {
  const { data: applications = [], isLoading } = useApplications({ take: 5 });
  
  // Already sorted by updatedAt desc from the API (assuming)
  const recentApps = applications.slice(0, 5);

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-gray-200">Recent Applications</h3>
        </div>
        <div className="space-y-4 flex-grow">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-gray-200">Recent Applications</h3>
        <Link href="/applications" className="text-xs font-medium text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      
      <div className="space-y-4 flex-grow">
        {recentApps.map((app) => (
          <div 
            key={app.id} 
            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center border border-white/5">
                <Building2 className="w-5 h-5 text-gray-500 group-hover:text-violet-400 transition-colors" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-100 group-hover:text-violet-300 transition-colors">
                  {app.company}
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">{app.position}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <StatusBadge status={app.status.toLowerCase() as any} showDot={false} />
              <span className="text-[10px] font-mono text-gray-500">
                {getDurationText(app.updatedAt)}
              </span>
            </div>
          </div>
        ))}

        {recentApps.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-500 text-sm">
            No applications yet
          </div>
        )}
      </div>
    </div>
  );
}
