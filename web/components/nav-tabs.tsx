'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/app/nearby', label: 'Nearby' },
  { href: '/app/log', label: 'Log' },
  { href: '/app/wishlist', label: 'Wishlist' },
];

export function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="hidden border-b border-zinc-200/60 bg-white/50 dark:border-zinc-800/60 dark:bg-zinc-900/50 md:block">
      <div className="mx-auto flex max-w-7xl gap-2 px-4 md:px-6">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative px-5 py-3.5 text-sm font-semibold transition-all ${
                isActive
                  ? 'text-violet-600 dark:text-violet-400'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 to-pink-600"></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

