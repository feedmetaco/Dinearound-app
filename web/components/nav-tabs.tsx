'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, BookOpen, Star } from 'lucide-react';

const tabs = [
  { href: '/app/nearby', label: 'Nearby', icon: MapPin },
  { href: '/app/log', label: 'Log', icon: BookOpen },
  { href: '/app/wishlist', label: 'Wishlist', icon: Star },
];

/** Desktop top nav — same "dark pill, coral active state" language as the mobile floating nav. */
export function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="hidden justify-center py-4 md:flex">
      <div className="pill-nav flex items-center gap-1 p-1.5">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
                isActive ? 'bg-[var(--nav-active)] text-white' : 'text-white/55 hover:text-white/80'
              }`}
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
