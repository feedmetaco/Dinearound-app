'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/app/nearby', label: 'Nearby', icon: '📍', gradient: 'from-[#D4A59A] to-[#C08F84]' },
  { href: '/app/log', label: 'Log', icon: '📝', gradient: 'from-[#A8C4A5] to-[#D4A59A]' },
  { href: '/app/wishlist', label: 'Wishlist', icon: '⭐', gradient: 'from-[#C5B8D8] to-[#E0D9EB]' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-[#E8D5BC]/40 bg-[#FAF8F5]/90 backdrop-blur-xl shadow-lg dark:border-[#524D47]/40 dark:bg-[#2A2621]/90 md:hidden">
      {/* iOS safe area bottom padding */}
      <div className="flex items-center justify-around px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-1 flex-col items-center gap-1.5 px-4 py-3 transition-all ${
                isActive ? '' : ''
              }`}
            >
              {isActive && (
                <div className={`absolute inset-0 mx-2 rounded-2xl bg-gradient-to-r ${item.gradient} opacity-15`}></div>
              )}
              <span className={`text-2xl transition-transform ${isActive ? 'scale-110' : ''} active:scale-90`}>
                {item.icon}
              </span>
              <span className={`text-xs font-bold transition-colors ${
                isActive
                  ? 'text-[#D4A59A] dark:text-[#E5C4BA]'
                  : 'text-[#A39D93] dark:text-[#6E6962]'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className={`absolute bottom-0 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-gradient-to-r ${item.gradient}`}></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

