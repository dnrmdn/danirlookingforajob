'use client';

import { Briefcase } from 'lucide-react';
import { useUIStore } from '@/stores/useUIStore';

export function ApplicationEmptyState() {
  const setFormModalOpen = useUIStore(state => state.setFormModalOpen);

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8 border border-white/5 border-dashed rounded-2xl bg-white/5 backdrop-blur-sm">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/20 to-blue-500/20 flex items-center justify-center mb-6 border border-white/10">
        <Briefcase className="w-8 h-8 text-violet-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-100 mb-2">No applications yet</h3>
      <p className="text-gray-400 max-w-sm mb-8">
        Start tracking your job search journey. Add your first application to get started.
      </p>
      <button 
        onClick={() => setFormModalOpen(true)}
        className="bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium rounded-xl px-6 py-3 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:scale-105 transition-all"
      >
        Add First Application
      </button>
    </div>
  );
}
