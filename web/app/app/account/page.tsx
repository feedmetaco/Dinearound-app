'use client';

import { useRouter } from 'next/navigation';
import { User, LogOut, Moon, Sun, Star, BookOpen, ChevronRight } from 'lucide-react';
import { useDineAroundStore } from '@/lib/local-store';
import { apiLogout } from '@/lib/api-client';
import { useTheme } from '@/lib/use-theme';

export default function AccountPage() {
  const router = useRouter();
  const userEmail = useDineAroundStore((s) => s.userEmail);
  const isGuest = useDineAroundStore((s) => s.isGuest);
  const visits = useDineAroundStore((s) => s.visits);
  const wishlistIds = useDineAroundStore((s) => s.wishlistIds);
  const signOutLocal = useDineAroundStore((s) => s.signOut);
  const { isLight, toggle } = useTheme();

  const handleLogout = async () => {
    await apiLogout().catch(() => {});
    signOutLocal();
    router.push('/auth/login');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6">
      <h2 className="font-display mb-5 text-3xl font-extrabold" style={{ color: 'var(--foreground)' }}>
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

      <div className="card-surface mb-5 divide-y" style={{ borderColor: 'var(--border-soft)' }}>
        <button
          onClick={toggle}
          className="flex w-full items-center justify-between gap-3 p-4 text-left"
          style={{ borderColor: 'var(--border-soft)' }}
        >
          <span className="flex items-center gap-3 text-sm font-bold" style={{ color: 'var(--foreground)' }}>
            {isLight ? <Moon size={17} strokeWidth={2.2} /> : <Sun size={17} strokeWidth={2.2} />}
            Dark mode
          </span>
          <span
            className="relative h-6 w-11 rounded-full transition-colors"
            style={{ background: isLight ? 'var(--input-border)' : 'var(--accent-coral)' }}
          >
            <span
              className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
              style={{ transform: isLight ? 'translateX(2px)' : 'translateX(22px)' }}
            />
          </span>
        </button>
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
