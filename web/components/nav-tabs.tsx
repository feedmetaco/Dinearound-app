'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, BookOpen, Star, Plus, User } from 'lucide-react';

const tabs = [
  { href: '/app/nearby', label: 'Nearby', icon: MapPin },
  { href: '/app/wishlist', label: 'Wishlist', icon: Star },
  { href: '/app/log?new=1', label: 'Log Visit', icon: Plus },
  { href: '/app/log', label: 'Log', icon: BookOpen },
  { href: '/app/account', label: 'Account', icon: User },
];

/** Desktop top pill nav — same white-shell / red-active language as the mobile floating nav. */
export function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="hidden justify-center py-4 md:flex">
      <div className="pill-nav flex items-center gap-1 p-1.5">
        {tabs.map((tab) => {
          const isAction = tab.href.includes('?');
          const isActive = !isAction && pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-200 hover:opacity-90"
              style={{
                background: isActive || isAction ? 'var(--accent-coral)' : 'transparent',
                color: isActive || isAction ? 'white' : 'var(--text-secondary)',
              }}
            >
              <Icon size={16} strokeWidth={2.4} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
