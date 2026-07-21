'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, BookOpen, Star } from 'lucide-react';

const navItems = [
  { href: '/app/nearby', label: 'Nearby', icon: MapPin },
  { href: '/app/log', label: 'Log', icon: BookOpen },
  { href: '/app/wishlist', label: 'Wishlist', icon: Star },
];

/** Floating pill bottom nav — dark capsule shell in both color modes (see MASTER.md §4). */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] md:hidden">
      <div className="pill-nav flex items-center gap-1 p-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold transition-all duration-200 ${
                isActive ? 'bg-[var(--nav-active)] text-white' : 'text-white/55 hover:text-white/80'
              }`}
            >
              <Icon size={18} strokeWidth={2.4} />
              {isActive && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
