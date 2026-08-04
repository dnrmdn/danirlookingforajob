'use client';

import Image from 'next/image';
import { useUIStore } from '@/stores/useUIStore';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Download, FileDown, Table, User, Palette, Database, LogOut } from 'lucide-react';
import { Modal } from '@/components/shared/Modal';

export default function SettingsPage() {
  const { isExportModalOpen, setExportModalOpen, addToast } = useUIStore();
  const { user, initials, signOut } = useCurrentUser();

  const handleExport = (type: 'pdf' | 'excel') => {
    addToast(`Exporting to ${type.toUpperCase()}...`);
    setTimeout(() => {
      addToast(`Export complete`, 'success');
      setExportModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-4xl flex-grow">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Settings</h1>
        <p className="text-gray-400 mt-2">Manage your account and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-gray-100 font-medium cursor-pointer">
            <User className="w-5 h-5 text-violet-400" /> Account
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer">
            <Palette className="w-5 h-5" /> Appearance
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer">
            <Database className="w-5 h-5" /> Data & Export
          </button>
        </div>

        <div className="md:col-span-2 space-y-6">
          
          {/* User Account Profile Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-100">Account Profile</h3>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-violet-500/30 bg-violet-600/20 flex items-center justify-center overflow-hidden shrink-0">
                {user?.image ? (
                  <Image src={user.image} alt={user.name || 'User'} width={64} height={64} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-violet-300 font-bold text-xl">{initials}</span>
                )}
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-100">{user?.name || 'Authenticated User'}</h4>
                <p className="text-sm text-gray-400">{user?.email || 'No email provided'}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-mono">
                  Auth.js Session Active
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-mono">ID: {user?.id || '-'}</span>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>

          {/* Data Export Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Export Data</h3>
            <p className="text-sm text-gray-400 mb-6">
              Download your application history for external analysis or safekeeping.
            </p>
            <button 
              onClick={() => setExportModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-100 font-medium transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export Applications
            </button>
          </div>

          {/* Developer Tools */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Developer Tools</h3>
            <p className="text-sm text-gray-400 mb-6">
              Database is now managed by the backend. Use Prisma Studio or API endpoints for data management.
            </p>
            <button 
              disabled
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-gray-500 font-medium cursor-not-allowed opacity-50"
            >
              Mock Data Removed
            </button>
          </div>

        </div>
      </div>

      {/* Export Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Export Applications"
        icon={<Download className="w-5 h-5 text-violet-400" />}
        maxWidth="md"
      >
        <div className="space-y-6">
          <p className="text-gray-400 text-sm">Choose your preferred export format. The file will be downloaded automatically.</p>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleExport('pdf')}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-white/5 hover:border-violet-500/50 bg-white/5 hover:bg-violet-500/5 transition-all group cursor-pointer"
            >
              <FileDown className="w-8 h-8 text-gray-400 group-hover:text-violet-400 transition-colors" />
              <div className="text-center">
                <div className="font-semibold text-gray-100 group-hover:text-violet-300">PDF Document</div>
                <div className="text-xs text-gray-500 mt-1">Best for printing & sharing</div>
              </div>
            </button>
            
            <button 
              onClick={() => handleExport('excel')}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-white/5 hover:border-emerald-500/50 bg-white/5 hover:bg-emerald-500/5 transition-all group cursor-pointer"
            >
              <Table className="w-8 h-8 text-gray-400 group-hover:text-emerald-400 transition-colors" />
              <div className="text-center">
                <div className="font-semibold text-gray-100 group-hover:text-emerald-300">Excel Sheet</div>
                <div className="text-xs text-gray-500 mt-1">Best for analysis</div>
              </div>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
