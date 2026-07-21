'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, BookOpen, Star, User } from 'lucide-react';

const tabs = [
  { href: '/app/nearby', label: 'Nearby', icon: MapPin },
  { href: '/app/log', label: 'Log', icon: BookOpen },
  { href: '/app/wishlist', label: 'Wishlist', icon: Star },
  { href: '/app/account', label: 'Account', icon: User },
];

/** Desktop top nav — plain text links, not a floating pill bar (see web-light.md §4). */
export function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="hidden border-b md:flex" style={{ borderColor: 'var(--border-soft)' }} aria-label="Primary">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-1 px-6">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition-colors"
              style={{
                borderColor: isActive ? 'var(--accent-coral)' : 'transparent',
                color: isActive ? 'var(--foreground)' : 'var(--text-secondary)',
              }}
            >
              <Icon size={15} strokeWidth={2.2} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
