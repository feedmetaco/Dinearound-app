'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, BookOpen, Star, User } from 'lucide-react';

const navItems = [
  { href: '/app/nearby', label: 'Nearby', icon: MapPin },
  { href: '/app/log', label: 'Log', icon: BookOpen },
  { href: '/app/wishlist', label: 'Wishlist', icon: Star },
  { href: '/app/account', label: 'Account', icon: User },
];

/** Standard flat bottom tab bar — 4 items, no floating pill, no center FAB (see web-light.md §4). */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="bottom-tab-bar fixed inset-x-0 bottom-0 z-50 flex pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Primary"
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5"
            style={{ color: isActive ? 'var(--accent-coral)' : 'var(--text-secondary)' }}
          >
            <Icon size={21} strokeWidth={isActive ? 2.4 : 2} fill={isActive && label === 'Wishlist' ? 'currentColor' : 'none'} />
            <span className="text-[11px] font-semibold">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
