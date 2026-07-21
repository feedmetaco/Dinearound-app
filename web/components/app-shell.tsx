'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { useDineAroundStore } from '@/lib/local-store';
import { getAuthToken, isApiEnabled } from '@/lib/api-client';
import { syncFromServer } from '@/lib/sync-service';
import { Header } from '@/components/header';
import { NavTabs } from '@/components/nav-tabs';
import { BottomNav } from '@/components/bottom-nav';

// Zustand's persisted store only has real data after client mount; this flag
// flips true post-hydration without triggering a setState-in-effect render.
const noopSubscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useDineAroundStore((s) => s.isAuthenticated);
  const isGuest = useDineAroundStore((s) => s.isGuest);
  const hydrated = useHydrated();

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [hydrated, isAuthenticated, router]);

  useEffect(() => {
    if (hydrated && isAuthenticated && !isGuest && isApiEnabled() && getAuthToken()) {
      syncFromServer().catch(() => {});
    }
  }, [hydrated, isAuthenticated, isGuest]);

  if (!hydrated || !isAuthenticated) {
    return <div className="min-h-screen" style={{ background: 'var(--background)' }} />;
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ background: 'var(--background)' }}>
      <Header />
      <NavTabs />
      <main className="flex-1 pb-36 md:pb-8">{children}</main>
      <BottomNav />
    </div>
  );
}
