'use client';

import Link from 'next/link';
import { UtensilsCrossed, User } from 'lucide-react';
import { useDineAroundStore } from '@/lib/local-store';

export function Header() {
  const userEmail = useDineAroundStore((s) => s.userEmail);
  const isGuest = useDineAroundStore((s) => s.isGuest);
  const initial = (userEmail?.[0] || 'G').toUpperCase();

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{ borderColor: 'var(--border-soft)', background: 'var(--header-bg)', backdropFilter: 'blur(20px)' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/app/nearby" className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-2xl"
            style={{ background: 'var(--accent-coral)' }}
          >
            <UtensilsCrossed size={17} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-xl font-extrabold tracking-tight" style={{ color: 'var(--foreground)' }}>
            DineAround
          </h1>
        </Link>

        <Link
          href="/app/account"
          aria-label="Account"
          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-transform hover:scale-105"
          style={{ background: 'var(--chip-fill)', color: 'var(--foreground)' }}
        >
          {isGuest ? <User size={17} strokeWidth={2.2} /> : initial}
        </Link>
      </div>
    </header>
  );
}
