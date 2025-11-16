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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#E8D5BC] via-[#D4A59A] to-[#C5B8D8] px-4">
      <div className="w-full max-w-md space-y-6 rounded-3xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm dark:bg-[#3D3935]/95">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#D4A59A] to-[#C08F84] shadow-lg">
            <span className="text-4xl">🍽️</span>
          </div>
          <h1 className="bg-gradient-to-r from-[#D4A59A] to-[#C08F84] bg-clip-text text-4xl font-black text-transparent">
            Welcome back!
          </h1>
          <p className="mt-2 text-sm font-medium text-[#6E6962] dark:text-[#D4CFC4]">
            Sign in to continue your food journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {successMessage && (
            <div className="rounded-2xl bg-[#9DC49A]/15 border-2 border-[#9DC49A]/40 p-4 text-sm font-medium text-[#8FB08C] dark:bg-[#9DC49A]/25">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="rounded-2xl bg-[#D69B9B]/15 border-2 border-[#D69B9B]/40 p-4 text-sm font-medium text-[#C08F84] dark:bg-[#D69B9B]/25">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-[#3D3935] dark:text-[#F2EFE9]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 block w-full rounded-2xl border-2 border-[#E6E1D8] bg-[#FAF8F5] px-4 py-3 text-base font-medium text-[#3D3935] shadow-sm transition-all focus:border-[#D4A59A] focus:outline-none focus:ring-4 focus:ring-[#D4A59A]/20 dark:border-[#524D47] dark:bg-[#2A2621] dark:text-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold text-[#3D3935] dark:text-[#F2EFE9]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full rounded-2xl border-2 border-[#E6E1D8] bg-[#FAF8F5] px-4 py-3 text-base font-medium text-[#3D3935] shadow-sm transition-all focus:border-[#D4A59A] focus:outline-none focus:ring-4 focus:ring-[#D4A59A]/20 dark:border-[#524D47] dark:bg-[#2A2621] dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-[#D4A59A] to-[#C08F84] px-6 py-4 text-base font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-[#E6E1D8] dark:border-[#524D47]" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 font-bold text-[#A39D93] dark:bg-[#3D3935] dark:text-[#6E6962]">
              Or continue with
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full rounded-2xl border-2 border-[#E6E1D8] bg-white px-6 py-4 text-base font-bold text-[#3D3935] shadow-md transition-all hover:border-[#D4A59A] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 dark:border-[#524D47] dark:bg-[#2A2621] dark:text-white"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm font-medium text-[#6E6962] dark:text-[#A39D93]">
          Don't have an account?{' '}
          <Link
            href="/auth/signup"
            className="font-bold text-[#D4A59A] hover:text-[#C08F84] hover:underline"
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

