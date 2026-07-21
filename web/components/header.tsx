'use client';

import { UtensilsCrossed } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiLogout } from '@/lib/api-client';
import { useDineAroundStore } from '@/lib/local-store';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  const router = useRouter();
  const userEmail = useDineAroundStore((s) => s.userEmail);
  const signOutLocal = useDineAroundStore((s) => s.signOut);

  const handleLogout = async () => {
    await apiLogout().catch(() => {});
    signOutLocal();
    router.push('/auth/login');
  };

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{ borderColor: 'var(--border-soft)', background: 'var(--header-bg)', backdropFilter: 'blur(20px)' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: 'linear-gradient(135deg, var(--accent-coral), var(--brand-green))' }}
          >
            <UtensilsCrossed size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            DineAround
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {userEmail && (
            <span className="hidden text-sm font-semibold text-[var(--text-secondary)] md:block">{userEmail}</span>
          )}
          <ThemeToggle />
          <button onClick={handleLogout} className="btn-primary px-4 py-2 text-sm">
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
