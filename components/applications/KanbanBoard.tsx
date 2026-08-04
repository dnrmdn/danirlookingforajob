'use client';

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useUIStore } from '@/stores/useUIStore';
import { KANBAN_COLUMNS } from '@/lib/constants';
import { KanbanColumn } from './KanbanColumn';
import { ApplicationCard } from './ApplicationCard';
import { ApplicationSummaryResponse } from '@/features/applications/dto';
import { useUpdateApplication } from '@/lib/api-client/applications';

interface KanbanBoardProps {
  applications: ApplicationSummaryResponse[];
}

export function KanbanBoard({ applications }: KanbanBoardProps) {
  const addToast = useUIStore((state) => state.addToast);
  const updateApplication = useUpdateApplication(''); // Will override id on mutate
  
  const [activeId, setActiveId] = useState<string | null>(null);

  // Group applications by status
  const getApplicationsByStatus = (status: string) => {
    return applications.filter((app) => app.status === status);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Optional: implement if you want live sorting inside a column, 
    // for this tracker, moving between columns is the primary goal.
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeAppId = active.id as string;
    
    // Find the source app
    const activeApp = applications.find(app => app.id === activeAppId);
    if (!activeApp) {
      setActiveId(null);
      return;
    }

    // Determine the target status
    let newStatus: string;
    
    // If over a column (id is the status string)
    if (KANBAN_COLUMNS.includes(over.id as any)) {
      newStatus = over.id as string;
    } else {
      // If over another card, find its status
      const overApp = applications.find(app => app.id === over.id);
      if (overApp) {
        newStatus = overApp.status;
      } else {
        setActiveId(null);
        return;
      }
    }

    if (activeApp.status !== newStatus) {
      // Optimistic UI handled by React Query conceptually, or just wait for success.
      // Since it's a drag and drop, we could implement full optimistic update in the hook,
      // but for now we just trigger the mutation.
      updateApplication.mutate(
        // @ts-ignore - dynamic id override
        { id: activeAppId, data: { status: newStatus as any } },
        {
          onSuccess: () => {
            addToast(`Status updated to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`);
          },
          onError: () => {
            addToast(`Failed to update status`, 'error');
          }
        }
      );
    }

    setActiveId(null);
  };

  const activeApplication = activeId ? applications.find((app) => app.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-8 flex-grow kanban-scroll snap-x snap-mandatory pt-2 min-h-[calc(100vh-200px)]">
        {KANBAN_COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            applications={getApplicationsByStatus(status)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeApplication ? (
          <div className="rotate-3 opacity-90 shadow-2xl scale-105 cursor-grabbing">
            <ApplicationCard 
              application={activeApplication} 
              onClick={() => {}} 
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
