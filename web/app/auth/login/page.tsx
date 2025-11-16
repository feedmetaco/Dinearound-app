'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    searchParams.get('message')
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const redirect = searchParams.get('redirect') || '/app/nearby';
    router.push(redirect);
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#FFD23F] via-[#FF6B35] to-[#EF476F] px-4">
      <div className="w-full max-w-md space-y-6 rounded-3xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm dark:bg-[#262626]/95">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B35] to-[#EF476F] shadow-lg">
            <span className="text-4xl">🍽️</span>
          </div>
          <h1 className="bg-gradient-to-r from-[#FF6B35] to-[#EF476F] bg-clip-text text-4xl font-black text-transparent">
            Welcome back!
          </h1>
          <p className="mt-2 text-sm font-medium text-[#737373] dark:text-[#D4D4D4]">
            Sign in to continue your food journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {successMessage && (
            <div className="rounded-2xl bg-[#06D6A0]/10 border-2 border-[#06D6A0]/30 p-4 text-sm font-medium text-[#05C090] dark:bg-[#06D6A0]/20">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="rounded-2xl bg-[#EF476F]/10 border-2 border-[#EF476F]/30 p-4 text-sm font-medium text-[#E63861] dark:bg-[#EF476F]/20">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-[#1A1A1A] dark:text-[#FFF8F0]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 block w-full rounded-2xl border-2 border-[#E5E5E5] bg-[#FAFAFA] px-4 py-3 text-base font-medium text-[#1A1A1A] shadow-sm transition-all focus:border-[#FF6B35] focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20 dark:border-[#404040] dark:bg-[#262626] dark:text-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold text-[#1A1A1A] dark:text-[#FFF8F0]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full rounded-2xl border-2 border-[#E5E5E5] bg-[#FAFAFA] px-4 py-3 text-base font-medium text-[#1A1A1A] shadow-sm transition-all focus:border-[#FF6B35] focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20 dark:border-[#404040] dark:bg-[#262626] dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#EF476F] px-6 py-4 text-base font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-[#E5E5E5] dark:border-[#404040]" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 font-bold text-[#A3A3A3] dark:bg-[#262626] dark:text-[#737373]">
              Or continue with
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full rounded-2xl border-2 border-[#E5E5E5] bg-white px-6 py-4 text-base font-bold text-[#1A1A1A] shadow-md transition-all hover:border-[#FF6B35] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 dark:border-[#404040] dark:bg-[#171717] dark:text-white"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm font-medium text-[#737373] dark:text-[#A3A3A3]">
          Don't have an account?{' '}
          <Link
            href="/auth/signup"
            className="font-bold text-[#FF6B35] hover:text-[#E85A2B] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

