'use client';

import { useRouter } from 'next/navigation';
import { User, LogOut, Star, BookOpen, ChevronRight } from 'lucide-react';
import { useDineAroundStore } from '@/lib/local-store';
import { apiLogout } from '@/lib/api-client';

export default function AccountPage() {
  const router = useRouter();
  const userEmail = useDineAroundStore((s) => s.userEmail);
  const isGuest = useDineAroundStore((s) => s.isGuest);
  const visits = useDineAroundStore((s) => s.visits);
  const wishlistIds = useDineAroundStore((s) => s.wishlistIds);
  const signOutLocal = useDineAroundStore((s) => s.signOut);

  const handleLogout = async () => {
    await apiLogout().catch(() => {});
    signOutLocal();
    router.push('/auth/login');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6">
      <h2 className="font-display mb-5 text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
        Account
      </h2>

      <div className="card-surface mb-5 flex items-center gap-4 p-5">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-extrabold text-white"
          style={{ background: 'var(--accent-coral)' }}
        >
          {isGuest ? <User size={26} strokeWidth={2.2} /> : (userEmail?.[0] || 'D').toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-extrabold" style={{ color: 'var(--foreground)' }}>
            {isGuest ? 'Guest mode' : userEmail || 'DineAround diner'}
          </p>
          <p className="text-sm font-semibold text-[var(--text-secondary)]">
            {isGuest ? 'Signed in locally · no cloud sync' : 'Synced with DineAround cloud'}
          </p>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="card-surface flex flex-col items-center gap-1 p-4 text-center">
          <BookOpen size={20} strokeWidth={2.2} style={{ color: 'var(--accent-coral)' }} />
          <p className="text-2xl font-extrabold" style={{ color: 'var(--foreground)' }}>
            {visits.length}
          </p>
          <p className="label-caps">Visits logged</p>
        </div>
        <div className="card-surface flex flex-col items-center gap-1 p-4 text-center">
          <Star size={20} strokeWidth={2.2} style={{ color: 'var(--accent-gold)' }} />
          <p className="text-2xl font-extrabold" style={{ color: 'var(--foreground)' }}>
            {wishlistIds.length}
          </p>
          <p className="label-caps">On wishlist</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex w-full items-center justify-between gap-3 rounded-2xl p-4 text-left font-bold transition-colors"
        style={{ background: 'color-mix(in srgb, var(--destructive) 10%, transparent)', color: 'var(--destructive)' }}
      >
        <span className="flex items-center gap-3 text-sm">
          <LogOut size={17} strokeWidth={2.2} />
          Sign out
        </span>
        <ChevronRight size={16} strokeWidth={2.4} />
      </button>
    </div>
  );
}
