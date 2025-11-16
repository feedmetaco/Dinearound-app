'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/app/nearby', label: 'Nearby', icon: '📍', gradient: 'from-[#D4A59A] to-[#C08F84]' },
  { href: '/app/log', label: 'Log', icon: '📝', gradient: 'from-[#A8C4A5] to-[#D4A59A]' },
  { href: '/app/wishlist', label: 'Wishlist', icon: '⭐', gradient: 'from-[#C5B8D8] to-[#E0D9EB]' },
];

export function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="hidden border-b-2 border-[#E8D5BC]/40 bg-[#FAF8F5]/60 backdrop-blur-lg dark:border-[#524D47]/40 dark:bg-[#2A2621]/60 md:block">
      <div className="mx-auto flex max-w-7xl gap-1 px-4 md:px-6">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex items-center gap-2 px-5 py-3.5 text-sm font-bold transition-all rounded-t-2xl ${
                isActive
                  ? 'text-[#D4A59A] dark:text-[#E5C4BA]'
                  : 'text-[#A39D93] hover:text-[#D4A59A] dark:text-[#6E6962] dark:hover:text-[#E5C4BA]'
              }`}
            >
              {isActive && (
                <div className={`absolute inset-0 rounded-t-2xl bg-gradient-to-r ${tab.gradient} opacity-15`}></div>
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

