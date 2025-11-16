'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

interface HeaderProps {
  user: User | null;
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  if (!user) {
    return (
      <header className="sticky top-0 z-50 border-b-2 border-[#E8D5BC]/40 bg-[#FAF8F5]/80 backdrop-blur-xl shadow-sm dark:border-[#524D47]/40 dark:bg-[#2A2621]/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#D4A59A] to-[#C08F84]">
              <span className="text-xl">🍽️</span>
            </div>
            <h1 className="bg-gradient-to-r from-[#D4A59A] to-[#C08F84] bg-clip-text text-2xl font-black tracking-tight text-transparent">
              DineAround
            </h1>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b-2 border-[#E8D5BC]/40 bg-white/80 backdrop-blur-xl shadow-sm dark:border-[#524D47]/40 dark:bg-[#2A2621]/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#D4A59A] to-[#C08F84]">
            <span className="text-xl">🍽️</span>
          </div>
          <h1 className="bg-gradient-to-r from-[#D4A59A] to-[#C08F84] bg-clip-text text-2xl font-black tracking-tight text-transparent">
            DineAround
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm font-bold text-[#3D3935] dark:text-[#F2EFE9] md:block">
            {user.email}
          </span>
          <button
            onClick={handleLogout}
            className="rounded-2xl bg-gradient-to-r from-[#D4A59A] to-[#C08F84] px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-105 active:scale-95"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

