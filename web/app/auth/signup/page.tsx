'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Check if user is immediately logged in (email confirmation disabled)
    if (signUpData.user && signUpData.session) {
      // User is logged in immediately - redirect to app
      router.push('/app');
      router.refresh();
      return;
    }

    // If email confirmation is required, show message and redirect to login
    // (This shouldn't happen if email confirmation is disabled, but handle it anyway)
    setError(null);
    router.push('/auth/login?message=Account created! Please sign in.');
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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-sm dark:bg-zinc-900">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create account</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Sign up to start tracking your restaurant visits
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:hover:bg-zinc-200"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-300 dark:border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              Or continue with
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Google
        </button>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-foreground hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}

