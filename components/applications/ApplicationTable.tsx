'use client';

import { ApplicationSummaryResponse } from '@/features/applications/dto';
import { getDurationText } from '@/lib/utils';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { SOURCE_CONFIG } from '@/lib/constants';
import { useUIStore } from '@/stores/useUIStore';

interface ApplicationTableProps {
  applications: ApplicationSummaryResponse[];
}

export function ApplicationTable({ applications }: ApplicationTableProps) {
  const setSelectedApplicationId = useUIStore((state) => state.setSelectedApplicationId);
  const setDetailPanelOpen = useUIStore((state) => state.setDetailPanelOpen);

  const handleRowClick = (id: string) => {
    setSelectedApplicationId(id);
    setDetailPanelOpen(true);
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-[#0B0F1A]/50 border-b border-white/10">
          <tr>
            <th scope="col" className="px-6 py-4 font-mono font-semibold tracking-wider">Company</th>
            <th scope="col" className="px-6 py-4 font-mono font-semibold tracking-wider">Position</th>
            <th scope="col" className="px-6 py-4 font-mono font-semibold tracking-wider">Status</th>
            <th scope="col" className="px-6 py-4 font-mono font-semibold tracking-wider">Source</th>
            <th scope="col" className="px-6 py-4 font-mono font-semibold tracking-wider">Updated</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr 
              key={app.id}
              onClick={() => handleRowClick(app.id)}
              className="border-b border-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="font-semibold text-gray-100 group-hover:text-violet-400 transition-colors">
                  {app.company}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{app.position}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={app.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="bg-white/10 text-gray-300 border border-white/10 font-mono px-2 py-1 rounded-md uppercase text-[10px]">
                  {SOURCE_CONFIG[app.source.toLowerCase() as keyof typeof SOURCE_CONFIG]?.label || app.source}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-mono text-[11px] text-gray-400">
                {getDurationText(app.updatedAt)}
              </td>
            </tr>
          ))}
          {applications.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                No applications found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
