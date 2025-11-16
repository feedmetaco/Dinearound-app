'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/app/nearby', label: 'Nearby', icon: '📍', gradient: 'from-[#FF6B35] to-[#EF476F]' },
  { href: '/app/log', label: 'Log', icon: '📝', gradient: 'from-[#FFD23F] to-[#FF6B35]' },
  { href: '/app/wishlist', label: 'Wishlist', icon: '⭐', gradient: 'from-[#06D6A0] to-[#FFD23F]' },
];

export function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="hidden border-b-2 border-[#FFD23F]/30 bg-white/60 backdrop-blur-lg dark:border-[#FFD23F]/20 dark:bg-[#1A1A1A]/60 md:block">
      <div className="mx-auto flex max-w-7xl gap-1 px-4 md:px-6">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex items-center gap-2 px-5 py-3.5 text-sm font-bold transition-all rounded-t-2xl ${
                isActive
                  ? 'text-[#FF6B35] dark:text-[#FFD23F]'
                  : 'text-[#A3A3A3] hover:text-[#FF6B35] dark:text-[#737373] dark:hover:text-[#FFD23F]'
              }`}
            >
              {isActive && (
                <div className={`absolute inset-0 rounded-t-2xl bg-gradient-to-r ${tab.gradient} opacity-10`}></div>
              )}
              <span className="relative text-lg">{tab.icon}</span>
              <span className="relative">{tab.label}</span>
              {isActive && (
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${tab.gradient}`}></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

