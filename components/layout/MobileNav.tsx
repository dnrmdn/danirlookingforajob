'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Briefcase, LayoutDashboard, Bell, MoreHorizontal, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/useUIStore';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const MOBILE_NAV_ITEMS = [
  { label: 'Dash', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Apps', href: '/applications', icon: Briefcase },
  { label: 'Add', href: '#add', icon: Plus, isAction: true },
  { label: 'Reminders', href: '/reminders', icon: Bell },
  { label: 'More', href: '/settings', icon: MoreHorizontal },
];

export function MobileNav() {
  const pathname = usePathname();
  const setFormModalOpen = useUIStore((state) => state.setFormModalOpen);
  const { user, initials } = useCurrentUser();

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between w-full px-4 py-4 sticky top-0 bg-[#0B0F1A]/80 backdrop-blur-md z-40 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center">
            <Briefcase className="text-white w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            CareerVault
          </h2>
        </div>
        <div className="w-8 h-8 rounded-full border border-white/20 bg-violet-600/20 flex items-center justify-center overflow-hidden">
          {user?.image ? (
            <Image src={user.image} alt={user.name || 'User'} width={32} height={32} className="w-full h-full object-cover" />
          ) : (
            <span className="text-violet-300 font-medium text-xs">{initials}</span>
          )}
        </div>
      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-[#0B0F1A]/90 backdrop-blur-xl border-t border-white/10 z-50 flex items-center justify-around px-2 pb-safe">
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href);
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <button
                key="add-action"
                onClick={() => setFormModalOpen(true)}
                className="w-12 h-12 -mt-6 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 flex items-center justify-center shadow-[0_4px_20px_rgba(139,92,246,0.4)] text-white hover:scale-105 transition-transform"
              >
                <Icon className="w-6 h-6" />
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-16 gap-1 transition-colors",
                isActive ? "text-violet-400" : "text-gray-400 hover:text-gray-200"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "fill-violet-400/20")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
