'use client';

import { useMemo } from 'react';
import { KanbanBoard } from '@/components/applications/KanbanBoard';
import { ApplicationTable } from '@/components/applications/ApplicationTable';
import { FilterBar } from '@/components/applications/FilterBar';
import { ViewToggle } from '@/components/applications/ViewToggle';
import { useUIStore } from '@/stores/useUIStore';
import { ApplicationEmptyState } from '@/components/shared/EmptyState';
import { useApplications } from '@/lib/api-client/applications';

export default function ApplicationsPage() {
  const { data: applications = [], isLoading, error } = useApplications({ take: 100 }); // Fetching up to 100 for client side filter/sort demonstration
  const viewMode = useUIStore((state) => state.viewMode);
  const filters = useUIStore((state) => state.filters);
  const sort = useUIStore((state) => state.sort);

  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        // Search filter
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matchCompany = app.company.toLowerCase().includes(q);
          const matchPosition = app.position.toLowerCase().includes(q);
          if (!matchCompany && !matchPosition) return false;
        }

        // Status filter (normalize casing for comparison between DB enum and UI types)
        if (filters.status.length > 0 && !filters.status.includes(app.status.toLowerCase() as any)) {
          return false;
        }

        // Source filter (normalize casing for comparison between DB enum and UI types)
        if (filters.source.length > 0 && !filters.source.includes(app.source.toLowerCase() as any)) {
          return false;
        }

        // Method filter removed: 'method' is not in ApplicationSummaryResponse
        // If method filtering is needed, it should be done server-side or added to DTO

        return true;
      })
      .sort((a, b) => {
        const fieldA = sort.field === 'appliedDate' ? 'appliedAt' : sort.field;
        let valA: any = (a as any)[fieldA] || '';
        let valB: any = (b as any)[fieldA] || '';

        if (fieldA === 'appliedAt' || fieldA === 'updatedAt') {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        } else if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [applications, filters, sort]);

  return (
    <div className="h-full flex flex-col flex-grow space-y-6">
      {/* Header bar with FilterBar & ViewToggle */}
      <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-100">Job Applications</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Showing {filteredApplications.length} of {applications.length} total applications
            </p>
          </div>
          <ViewToggle />
        </div>

        <FilterBar />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            Failed to load applications. Please try again.
          </div>
        ) : filteredApplications.length > 0 ? (
          viewMode === 'kanban' ? (
            <KanbanBoard applications={filteredApplications} />
          ) : (
            <ApplicationTable applications={filteredApplications} />
          )
        ) : (
          <ApplicationEmptyState />
        )}
      </div>
    </div>
  );
}
