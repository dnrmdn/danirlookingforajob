'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ApplicationSummaryResponse } from '@/features/applications/dto';
import { STATUS_CONFIG } from '@/lib/constants';
import { ApplicationCard } from './ApplicationCard';
import { useUIStore } from '@/stores/useUIStore';

interface KanbanColumnProps {
  status: string;
  applications: ApplicationSummaryResponse[];
}

export function KanbanColumn({ status, applications }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const setSelectedApplicationId = useUIStore((state) => state.setSelectedApplicationId);
  const setDetailPanelOpen = useUIStore((state) => state.setDetailPanelOpen);

  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];

  const handleCardClick = (id: string) => {
    setSelectedApplicationId(id);
    setDetailPanelOpen(true);
  };

  return (
    <div className="w-[200px] flex-shrink-0 flex flex-col gap-4 snap-start h-full">
      <div className="flex items-center justify-between font-mono text-xs uppercase text-gray-400 mb-2 px-1 sticky top-0 z-20 bg-[#0B0F1A]/80 backdrop-blur-sm py-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${config?.dotColor || 'bg-gray-500'}`}></div>
          <span className="font-semibold tracking-wider text-gray-300">{config?.label || status}</span>
        </div>
        <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-gray-200">
          {applications.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`
          flex-grow flex flex-col gap-2 rounded-2xl min-h-[110px] transition-colors duration-200 p-1
          ${isOver ? 'bg-white/5 border border-dashed border-violet-500/50' : 'border border-transparent'}
        `}
      >
        <SortableContext
          items={applications.map(app => app.id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onClick={() => handleCardClick(app.id)}
            />
          ))}
        </SortableContext>

        {applications.length === 0 && (
          <div className="h-full min-h-[75px] border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center text-gray-600 text-sm font-medium">
            Drop to move
          </div>
        )}
      </div>
    </div>
  );
}
