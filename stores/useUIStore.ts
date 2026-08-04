// ============================================================
// CareerVault — UI Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FilterState, SortState, ViewMode } from '@/lib/types';

interface UIStore {
  // View
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Sidebar
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Filters
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;

  // Sort
  sort: SortState;
  setSort: (sort: Partial<SortState>) => void;

  // Modals & Panels
  isFormModalOpen: boolean;
  setFormModalOpen: (open: boolean) => void;
  editingApplicationId: string | null;
  setEditingApplicationId: (id: string | null) => void;

  isDetailPanelOpen: boolean;
  setDetailPanelOpen: (open: boolean) => void;
  selectedApplicationId: string | null;
  setSelectedApplicationId: (id: string | null) => void;

  isExportModalOpen: boolean;
  setExportModalOpen: (open: boolean) => void;

  // Toast
  toasts: { id: string; message: string; type: 'success' | 'error' | 'info' }[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const DEFAULT_FILTERS: FilterState = {
  search: '',
  status: [],
  source: [],
  method: [],
  dateRange: { from: null, to: null },
};

const DEFAULT_SORT: SortState = {
  field: 'appliedDate',
  direction: 'desc',
};

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      // View
      viewMode: 'kanban',
      setViewMode: (mode) => set({ viewMode: mode }),

      // Sidebar
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // Filters
      filters: DEFAULT_FILTERS,
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      resetFilters: () => set({ filters: DEFAULT_FILTERS }),

      // Sort
      sort: DEFAULT_SORT,
      setSort: (newSort) =>
        set((state) => ({
          sort: { ...state.sort, ...newSort },
        })),

      // Modals
      isFormModalOpen: false,
      setFormModalOpen: (open) => set({ isFormModalOpen: open }),
      editingApplicationId: null,
      setEditingApplicationId: (id) => set({ editingApplicationId: id }),

      isDetailPanelOpen: false,
      setDetailPanelOpen: (open) => set({ isDetailPanelOpen: open }),
      selectedApplicationId: null,
      setSelectedApplicationId: (id) => set({ selectedApplicationId: id }),

      isExportModalOpen: false,
      setExportModalOpen: (open) => set({ isExportModalOpen: open }),

      // Toast
      toasts: [],
      addToast: (message, type = 'success') => {
        const id = crypto.randomUUID();
        set((state) => ({
          toasts: [...state.toasts, { id, message, type }],
        }));
        // Auto-remove after 4 seconds
        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }));
        }, 4000);
      },
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'careervault-ui',
      partialize: (state) => ({
        viewMode: state.viewMode,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
