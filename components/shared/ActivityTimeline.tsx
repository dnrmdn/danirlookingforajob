'use client';

import { ActivityLogEntry } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { CheckCircle2, Circle, FileText, Paperclip, Bell, Sparkles } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface ActivityTimelineProps {
  entries: ActivityLogEntry[];
}

export function ActivityTimeline({ entries }: ActivityTimelineProps) {
  if (!entries || entries.length === 0) {
    return <p className="text-xs text-gray-500 italic">No activity recorded yet.</p>;
  }

  const getIcon = (type: ActivityLogEntry['type']) => {
    switch (type) {
      case 'created':
        return <Sparkles className="w-3.5 h-3.5 text-indigo-400" />;
      case 'status_change':
        return <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />;
      case 'note_added':
        return <FileText className="w-3.5 h-3.5 text-blue-400" />;
      case 'attachment_added':
        return <Paperclip className="w-3.5 h-3.5 text-amber-400" />;
      case 'reminder_set':
        return <Bell className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Circle className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {entries
        .slice()
        .reverse()
        .map((entry, index) => (
          <div key={entry.id || index} className="flex gap-3 text-xs">
            <div className="flex flex-col items-center mt-0.5">
              <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                {getIcon(entry.type)}
              </div>
              {index !== entries.length - 1 && (
                <div className="w-px h-full bg-white/10 my-1"></div>
              )}
            </div>

            <div className="pb-3 flex-1">
              <p className="text-gray-200 font-medium">{entry.description}</p>
              
              {entry.fromStatus && entry.toStatus && (
                <div className="flex items-center gap-2 mt-1.5">
                  <StatusBadge status={entry.fromStatus} />
                  <span className="text-gray-500">→</span>
                  <StatusBadge status={entry.toStatus} />
                </div>
              )}

              <p className="text-[11px] text-gray-500 font-mono mt-1">
                {formatDate(entry.createdAt)}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}
