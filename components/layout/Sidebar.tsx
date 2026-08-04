'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Briefcase, LayoutDashboard, Bell, BarChart3, Settings, LogOut, ChevronUp, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Applications', href: '/applications', icon: Briefcase },
  { label: 'Reminders', href: '/reminders', icon: Bell },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, initials, signOut } = useCurrentUser();

  return (
    <nav className="hidden md:flex flex-col h-screen py-8 px-6 bg-white/5 backdrop-blur-[20px] w-[280px] fixed left-0 top-0 border-r border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] z-50">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)]">
          <Briefcase className="text-white w-5 h-5" fill="currentColor" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            CareerVault
          </h1>
          <p className="font-mono text-gray-400 uppercase tracking-wider text-[10px]">
            Premium Tracking
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 flex-grow">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "text-violet-400 font-bold border-r-2 border-violet-400 bg-white/5 scale-[0.98] shadow-[inset_0_0_20px_rgba(139,92,246,0.05)]"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "fill-violet-400/20")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-2">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-4 px-4 py-3 rounded-xl transition-colors",
            pathname === '/settings'
              ? "text-violet-400 font-bold bg-white/5"
              : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
          )}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
        
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-3 mt-4 px-4 py-2 hover:bg-white/5 rounded-xl transition-colors outline-none cursor-pointer w-full text-left">
              <div className="w-10 h-10 rounded-full border border-white/20 bg-violet-600/20 flex items-center justify-center overflow-hidden shrink-0">
                {user?.image ? (
                  <Image src={user.image} alt={user.name || 'User'} width={40} height={40} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-violet-300 font-semibold text-sm">{initials}</span>
                )}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-medium text-gray-100 truncate">{user?.name || 'Authenticated User'}</span>
                <span className="text-xs text-gray-400 truncate">{user?.email || 'Active Session'}</span>
              </div>
              <ChevronUp className="w-4 h-4 text-gray-400" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content 
              className="min-w-[240px] bg-[#1a1b26] border border-white/10 rounded-xl p-2 shadow-2xl backdrop-blur-xl z-[100]"
              sideOffset={12}
              align="start"
            >
              <div className="px-2 py-2 mb-2 border-b border-white/5">
                <p className="text-sm font-medium text-gray-200 truncate">{user?.name || 'Authenticated User'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email || 'Active Session'}</p>
              </div>
              
              <DropdownMenu.Item className="outline-none" asChild>
                <Link href="/dashboard" className="flex items-center gap-2 px-2 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
              </DropdownMenu.Item>
              
              <DropdownMenu.Item className="outline-none" asChild>
                <Link href="/settings" className="flex items-center gap-2 px-2 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                  <Settings className="w-4 h-4" />
                  Account Settings
                </Link>
              </DropdownMenu.Item>
              
              <DropdownMenu.Separator className="h-px bg-white/5 my-1" />
              
              <DropdownMenu.Item className="outline-none" onSelect={(e) => {
                e.preventDefault();
                signOut();
              }}>
                <button className="flex w-full items-center gap-2 px-2 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </nav>
  );
}
