'use client';

import { Search, Plus } from 'lucide-react';
import { useUIStore } from '@/stores/useUIStore';

export function TopBar() {
  const setFormModalOpen = useUIStore((state) => state.setFormModalOpen);

  return (
    <header className="hidden md:flex items-center justify-between w-full pl-[312px] pr-12 h-20 fixed top-0 left-0 bg-transparent z-40 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-4">
        {/* Page header title handled by view components */}
      </div>

      <div className="flex items-center gap-6 ml-auto">
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search applications..." 
            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-100 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none backdrop-blur-[20px] w-72 transition-all hover:bg-white/10 placeholder:text-gray-500"
          />
        </div>

        <button 
          onClick={() => setFormModalOpen(true)}
          className="bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium rounded-xl px-5 py-2 flex items-center gap-2 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:scale-[1.02] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Quick Add
        </button>

      </div>
    </header>
  );
}
