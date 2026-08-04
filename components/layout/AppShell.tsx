'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { ApplicationDetail } from '@/components/applications/ApplicationDetail';
import { ApplicationForm } from '@/components/applications/ApplicationForm';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch on initial render
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <MobileNav />
        {/* Main content wrapper */}
        <main className="md:pl-[280px] pt-4 md:pt-24 min-h-screen flex flex-col pb-20 md:pb-0">
          <div className="px-4 md:px-12 flex-grow flex flex-col">
            {children}
          </div>
        </main>
      </div>
      
      {/* Global Modals */}
      <ApplicationDetail />
      <ApplicationForm />
    </div>
  );
}
