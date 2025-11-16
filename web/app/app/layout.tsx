import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { NavTabs } from '@/components/nav-tabs';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication disabled - try to get user but don't require it
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col">
      {user && <Header user={user} />}
      <NavTabs />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}

