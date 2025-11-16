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
      <header className="sticky top-0 z-50 border-b border-[#6a994e]/20 bg-[#f2e8cf]/70 backdrop-blur-xl dark:border-[#6a994e]/30 dark:bg-[#1a2e1a]/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <h1 className="bg-gradient-to-r from-[#386641] to-[#6a994e] bg-clip-text text-2xl font-black tracking-tight text-transparent">
            DineAround
          </h1>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#6a994e]/20 bg-[#f2e8cf]/70 backdrop-blur-xl dark:border-[#6a994e]/30 dark:bg-[#1a2e1a]/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <h1 className="bg-gradient-to-r from-[#386641] to-[#6a994e] bg-clip-text text-2xl font-black tracking-tight text-transparent">
          DineAround
        </h1>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm font-medium text-[#386641] dark:text-[#f2e8cf] md:block">
            {user.email}
          </span>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-[#f2e8cf]/50 px-4 py-2 text-sm font-medium text-[#386641] backdrop-blur-sm transition-all hover:bg-[#f2e8cf] dark:bg-[#386641]/30 dark:text-[#f2e8cf] dark:hover:bg-[#386641]/50"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

