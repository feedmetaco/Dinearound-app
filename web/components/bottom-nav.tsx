'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/app/nearby', label: 'Nearby', icon: '📍', gradient: 'from-[#FF6B35] to-[#EF476F]' },
  { href: '/app/log', label: 'Log', icon: '📝', gradient: 'from-[#FFD23F] to-[#FF6B35]' },
  { href: '/app/wishlist', label: 'Wishlist', icon: '⭐', gradient: 'from-[#06D6A0] to-[#FFD23F]' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-[#FFD23F]/30 bg-white/90 backdrop-blur-xl shadow-lg dark:border-[#FFD23F]/20 dark:bg-[#1A1A1A]/90 md:hidden">
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
                <div className={`absolute inset-0 mx-2 rounded-2xl bg-gradient-to-r ${item.gradient} opacity-10`}></div>
              )}
              <span className={`text-2xl transition-transform ${isActive ? 'scale-110' : ''} active:scale-90`}>
                {item.icon}
              </span>
              <span className={`text-xs font-bold transition-colors ${
                isActive
                  ? 'text-[#FF6B35] dark:text-[#FFD23F]'
                  : 'text-[#A3A3A3] dark:text-[#737373]'
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

