'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ApplicationSummaryResponse } from '@/features/applications/dto';
import { getDurationText, getDurationColorClass } from '@/lib/utils';
import { SOURCE_CONFIG } from '@/lib/constants';
import { Building2, Calendar, AlertTriangle } from 'lucide-react';

interface ApplicationCardProps {
  application: ApplicationSummaryResponse;
  onClick: () => void;
}

export function ApplicationCard({ application, onClick }: ApplicationCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id, data: application });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Ghosted detection: > 30 days since last update and not in terminal state
  const diffDays = Math.ceil(
    Math.abs(new Date().getTime() - new Date(application.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  const ghosted = diffDays > 30 && !['ACCEPTED', 'REJECTED', 'OFFER'].includes(application.status);
  const sourceConfig = SOURCE_CONFIG[application.source as keyof typeof SOURCE_CONFIG];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`
        bg-white/5 backdrop-blur-md border rounded-2xl p-4 flex flex-col gap-4 
        hover:bg-white/10 transition-colors group cursor-grab active:cursor-grabbing relative overflow-hidden shadow-lg shadow-black/20
        ${isDragging ? 'opacity-50 ring-2 ring-violet-500 scale-105 z-50 bg-[#111827]' : 'border-white/10'}
        ${ghosted ? 'border-red-500/30 bg-red-500/5' : ''}
      `}
    >
      <div className="absolute inset-0 bg-violet-500 opacity-0 group-hover:opacity-[0.02] transition-opacity"></div>
      
      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center border border-white/5 overflow-hidden">
             <span className="text-gray-400 font-bold text-sm">
               {application.company.substring(0, 2).toUpperCase()}
             </span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-100 group-hover:text-violet-400 transition-colors line-clamp-1">
              {application.company}
            </h4>
            <p className="text-sm text-gray-400 mt-0.5 line-clamp-1">{application.position}</p>
          </div>
        </div>
        
        {ghosted && (
          <div className="text-red-400 bg-red-500/10 p-1.5 rounded-lg" title="Ghosted (>30 days no update)">
            <AlertTriangle className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex gap-2 z-10 flex-wrap">
        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono px-2 py-1 rounded-full uppercase text-[10px]">
          {sourceConfig?.label || application.source}
        </span>
      </div>

      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent z-10"></div>
      
      <div className="flex justify-between items-center text-gray-400 z-10">
        <div className={`flex items-center gap-1.5 font-mono text-[11px] ${getDurationColorClass(application.updatedAt)}`}>
          <Calendar className="w-3.5 h-3.5" /> 
          {getDurationText(application.updatedAt)}
        </div>
      </div>
    </div>
  );
}
