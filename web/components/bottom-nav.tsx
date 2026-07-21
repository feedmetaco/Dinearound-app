'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, BookOpen, Star, Plus, User } from 'lucide-react';

const navItems = [
  { href: '/app/nearby', label: 'Nearby', icon: MapPin },
  { href: '/app/wishlist', label: 'Wishlist', icon: Star },
];

const navItemsRight = [
  { href: '/app/log', label: 'Log', icon: BookOpen },
  { href: '/app/account', label: 'Account', icon: User },
];

/** Floating white pill bottom nav, 5 items max, red active state + center FAB (see web-light.md §4). */
export function BottomNav() {
  const pathname = usePathname();

  const item = (href: string, label: string, Icon: typeof MapPin) => {
    const isActive = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-1.5 transition-colors"
        style={{ color: isActive ? 'var(--accent-coral)' : 'var(--text-secondary)' }}
      >
        <Icon size={20} strokeWidth={isActive ? 2.6 : 2.1} fill={isActive && label === 'Wishlist' ? 'currentColor' : 'none'} />
        <span className="text-[10px] font-bold">{label}</span>
      </Link>
    );
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] md:hidden">
      <div className="pill-nav relative flex w-full max-w-sm items-center gap-1 px-2 py-2">
        {navItems.map(({ href, label, icon }) => item(href, label, icon))}

        <Link
          href="/app/log?new=1"
          aria-label="Log a visit"
          className="fab-button -mt-8 flex h-14 w-14 shrink-0 items-center justify-center"
        >
          <Plus size={26} strokeWidth={2.8} />
        </Link>

        {navItemsRight.map(({ href, label, icon }) => item(href, label, icon))}
      </div>
    </nav>
  );
}
