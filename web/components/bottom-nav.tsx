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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#6a994e]/20 bg-[#f2e8cf]/90 backdrop-blur-xl dark:border-[#6a994e]/30 dark:bg-[#1a2e1a]/90 md:hidden">
      <div className="flex items-center justify-around px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-1 flex-col items-center gap-1.5 px-4 py-3 transition-all ${
                isActive
                  ? 'text-[#386641] dark:text-[#a7c957]'
                  : 'text-[#6a994e] hover:text-[#386641] dark:text-[#a7c957]/60 dark:hover:text-[#a7c957]'
              }`}
            >
              <span className="text-2xl transition-transform active:scale-90">{item.icon}</span>
              <span className="text-xs font-semibold">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#386641] to-[#6a994e]"></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

