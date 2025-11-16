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
      <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/90 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-900/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <h1 className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-2xl font-black tracking-tight text-transparent">
            DineAround
          </h1>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/90 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-900/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <h1 className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-2xl font-black tracking-tight text-transparent">
          DineAround
        </h1>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm font-medium text-zinc-700 dark:text-zinc-300 md:block">
            {user.email}
          </span>
          <button
            onClick={handleLogout}
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

