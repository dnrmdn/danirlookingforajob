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
import { ApplicationStatus } from "@/lib/types";
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { toast } from "@/lib/toast";
import { KANBAN_COLUMNS, STATUS_CONFIG } from '@/lib/constants';
import { KanbanColumn } from './KanbanColumn';
import { ApplicationCard } from './ApplicationCard';
import { ApplicationSummaryResponse } from '@/features/applications/dto';
import { useUpdateApplication } from '@/lib/api-client/applications';

interface KanbanBoardProps {
  applications: ApplicationSummaryResponse[];
}

export function KanbanBoard({ applications }: KanbanBoardProps) {
  const updateApplication = useUpdateApplication();

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
      const statusLabel = STATUS_CONFIG[newStatus as keyof typeof STATUS_CONFIG]?.label || newStatus;
      updateApplication.mutate(
        {
          id: activeAppId,
          data: {
            status: newStatus as ApplicationStatus,
          },
        },
        {
          onSuccess: () => {
            toast.success("Status Updated", {
              description: `Application moved to ${statusLabel}.`,
              preset: "smooth",
              showProgress: true,
            });
          },
          onError: () => {
            toast.error("Update Failed", {
              description: "Failed to update application status.",
              preset: "smooth",
            });
          },
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
      <div className="flex gap-4 overflow-x-auto pb-8 flex-grow kanban-scroll snap-x snap-mandatory pt-2 min-h-[calc(100vh-200px)]">
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
              onClick={() => { }}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
