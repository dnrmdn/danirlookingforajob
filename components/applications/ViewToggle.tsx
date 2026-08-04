'use client';

import { LayoutGrid, List } from 'lucide-react';
import { useUIStore } from '@/stores/useUIStore';

export function ViewToggle() {
  const { viewMode, setViewMode } = useUIStore();

  return (
    <div className="bg-white/5 rounded-xl p-1 border border-white/10 flex items-center gap-1">
      <button
        onClick={() => setViewMode('kanban')}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
          viewMode === 'kanban'
            ? 'bg-violet-600/30 border border-violet-500/30 text-violet-300 shadow-sm'
            : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
        }`}
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        Kanban
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
          viewMode === 'list'
            ? 'bg-violet-600/30 border border-violet-500/30 text-violet-300 shadow-sm'
            : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
        }`}
      >
        <List className="w-3.5 h-3.5" />
        List
      </button>
    </div>
  );
}
