'use client';

import { Search, Filter, X, ArrowUpDown } from 'lucide-react';
import { useUIStore } from '@/stores/useUIStore';
import { KANBAN_COLUMNS, SOURCE_CONFIG, METHOD_CONFIG } from '@/lib/constants';
import { ApplicationStatus, ApplicationSource, ApplicationMethod, SortField, SortDirection } from '@/lib/types';

export function FilterBar() {
  const { filters, setFilters, resetFilters, sort, setSort } = useUIStore();

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    filters.status.length +
    filters.source.length +
    filters.method.length;

  const toggleStatus = (status: ApplicationStatus) => {
    const current = filters.status;
    const next = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    setFilters({ status: next });
  };

  const toggleSource = (source: ApplicationSource) => {
    const current = filters.source;
    const next = current.includes(source)
      ? current.filter((s) => s !== source)
      : [...current, source];
    setFilters({ source: next });
  };

  const toggleMethod = (method: ApplicationMethod) => {
    const current = filters.method;
    const next = current.includes(method)
      ? current.filter((m) => m !== method)
      : [...current, method];
    setFilters({ method: next });
  };

  return (
    <div className="space-y-3 w-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search company, position, location..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-8 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => setFilters({ search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-500">Sort:</span>
            <select
              value={`${sort.field}-${sort.direction}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-') as [SortField, SortDirection];
                setSort({ field, direction });
              }}
              className="bg-transparent text-gray-200 outline-none cursor-pointer font-medium"
            >
              <option value="appliedDate-desc" className="bg-[#111827]">Newest Applied</option>
              <option value="appliedDate-asc" className="bg-[#111827]">Oldest Applied</option>
              <option value="company-asc" className="bg-[#111827]">Company (A-Z)</option>
              <option value="company-desc" className="bg-[#111827]">Company (Z-A)</option>
              <option value="updatedAt-desc" className="bg-[#111827]">Recently Updated</option>
            </select>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs text-violet-400 hover:text-violet-300 px-2 py-1 rounded-lg border border-violet-500/20 hover:bg-violet-500/10 transition-colors"
            >
              Clear filters ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      {/* Quick Status Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-xs text-gray-500 font-mono mr-1">STATUS:</span>
        {KANBAN_COLUMNS.map((status) => {
          const isSelected = filters.status.includes(status);
          return (
            <button
              key={status}
              onClick={() => toggleStatus(status)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all border ${
                isSelected
                  ? 'bg-violet-600/30 border-violet-500/50 text-violet-200 shadow-sm'
                  : 'bg-white/5 border-white/5 text-gray-400 hover:text-gray-200 hover:bg-white/10'
              }`}
            >
              {status}
            </button>
          );
        })}
      </div>
    </div>
  );
}
