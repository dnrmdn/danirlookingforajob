'use client';

import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';
import { getInitials } from '@/lib/utils';
import { useUIStore } from '@/stores/useUIStore';

/**
 * Reusable single source of truth hook for authenticated user identity.
 * Reads directly from Auth.js Session and provides complete sign out behavior.
 */
export function useCurrentUser() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  const user = session?.user ?? null;
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated' && !!user;

  const initials = getInitials(user?.name, user?.email);
  const firstName = user?.name ? user.name.trim().split(/\s+/)[0] : 'User';

  const signOut = async () => {
    // 1. Invalidate and clear all React Query server state caches
    queryClient.clear();

    // 2. Reset global UI state modals/panels
    const { setDetailPanelOpen, setFormModalOpen, setSelectedApplicationId, setEditingApplicationId } = useUIStore.getState();
    setDetailPanelOpen(false);
    setFormModalOpen(false);
    setSelectedApplicationId(null);
    setEditingApplicationId(null);

    // 3. Terminate Auth.js session and redirect to /login
    await nextAuthSignOut({
      callbackUrl: '/login',
      redirect: true,
    });
  };

  return {
    user,
    session,
    status,
    isLoading,
    isAuthenticated,
    initials,
    firstName,
    signOut,
  };
}
