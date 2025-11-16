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
    <nav className="hidden border-b border-[#6a994e]/20 bg-[#f2e8cf]/60 backdrop-blur-lg dark:border-[#6a994e]/30 dark:bg-[#1a2e1a]/60 md:block">
      <div className="mx-auto flex max-w-7xl gap-2 px-4 md:px-6">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative px-5 py-3.5 text-sm font-semibold transition-all ${
                isActive
                  ? 'text-[#386641] dark:text-[#a7c957]'
                  : 'text-[#6a994e] hover:text-[#386641] dark:text-[#a7c957]/70 dark:hover:text-[#a7c957]'
              }`}
            >
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#386641] to-[#6a994e]"></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

