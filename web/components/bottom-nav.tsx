'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/app/nearby', label: 'Nearby', icon: '📍' },
  { href: '/app/log', label: 'Log', icon: '📝' },
  { href: '/app/wishlist', label: 'Wishlist', icon: '⭐' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200/60 bg-white/95 backdrop-blur-lg dark:border-zinc-800/60 dark:bg-zinc-900/95 md:hidden">
      <div className="flex items-center justify-around px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-1 flex-col items-center gap-1.5 px-4 py-3 transition-all ${
                isActive
                  ? 'text-violet-600 dark:text-violet-400'
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300'
              }`}
            >
              <span className="text-2xl transition-transform active:scale-90">{item.icon}</span>
              <span className="text-xs font-semibold">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-pink-600"></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

