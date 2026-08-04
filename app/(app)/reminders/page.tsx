'use client';

import { useAllReminders } from '@/lib/api-client/reminders';
import { useApplications } from '@/lib/api-client/applications';
import { Bell, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { getDurationText, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/shared/StatusBadge';

export default function RemindersPage() {
  const { data: reminders = [], isLoading: remindersLoading } = useAllReminders();
  const { data: applications = [], isLoading: appsLoading } = useApplications({ take: 100 });

  const isLoading = remindersLoading || appsLoading;

  // Active (not completed) reminders, sorted by date ascending
  const activeReminders = reminders
    .filter(r => !r.completed)
    .sort((a, b) => new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime());

  // Ghosted = no update in > 30 days and still in active status
  const ghostedApps = applications.filter(app => {
    const diffTime = Math.abs(new Date().getTime() - new Date(app.updatedAt).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 30 && !['ACCEPTED', 'REJECTED', 'OFFER'].includes(app.status);
  });

  if (isLoading) {
    return (
      <div className="space-y-8 flex-grow">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
            Reminders <Bell className="w-6 h-6 text-violet-400" />
          </h1>
          <p className="text-gray-400 mt-2">Keep track of follow-ups and upcoming interviews.</p>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 h-32 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 flex-grow">
      <div>
        <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
          Reminders <Bell className="w-6 h-6 text-violet-400" />
        </h1>
        <p className="text-gray-400 mt-2">Keep track of follow-ups and upcoming interviews.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-semibold text-gray-200 border-b border-white/5 pb-2">Upcoming Tasks</h2>
          
          {activeReminders.length > 0 ? (
            <div className="space-y-4">
              {activeReminders.map((reminder) => {
                const isOverdue = new Date(reminder.reminderDate) < new Date();
                // Find the associated application for company/position display
                const app = applications.find(a => a.id === reminder.applicationId);
                
                return (
                  <div key={reminder.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4 hover:bg-white/10 transition-colors">
                    <div className="mt-1">
                      {isOverdue ? (
                        <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-100">{app?.company ?? 'Unknown'}</h4>
                          <p className="text-sm text-gray-400">{app?.position ?? '-'}</p>
                        </div>
                        {app && <StatusBadge status={app.status.toLowerCase() as any} />}
                      </div>
                      <p className="text-sm text-gray-300 bg-white/5 p-3 rounded-xl border border-white/5 my-3">
                        {reminder.title}
                      </p>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          {isOverdue ? 'Overdue' : 'Due'} {formatDate(reminder.reminderDate)}
                        </div>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4" /> Mark Done
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
             <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                <p className="text-gray-500">No active reminders.</p>
             </div>
          )}
        </div>

        {/* Sidebar / Ghosted Alerts */}
        <div className="space-y-6">
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
            <h3 className="text-red-400 font-semibold flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4" /> Needs Attention
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              The following applications haven&apos;t had any updates in over 30 days. Consider following up or archiving them.
            </p>
            <div className="space-y-3">
              {ghostedApps.slice(0, 5).map(app => (
                <div key={app.id} className="p-3 bg-[#0B0F1A]/50 rounded-xl border border-white/5">
                  <h4 className="text-sm font-medium text-gray-200">{app.company}</h4>
                  <p className="text-xs text-gray-500 mt-1">Last active {getDurationText(app.updatedAt)}</p>
                </div>
              ))}
              {ghostedApps.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">All good!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
