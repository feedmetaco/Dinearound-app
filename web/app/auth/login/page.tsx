'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDineAroundStore } from '@/lib/local-store';
import { apiLogin, isApiEnabled } from '@/lib/api-client';
import { syncFromServer } from '@/lib/sync-service';
import Link from 'next/link';
import { UtensilsCrossed, User } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signInEmail = useDineAroundStore((s) => s.signInEmail);
  const continueAsGuest = useDineAroundStore((s) => s.continueAsGuest);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage] = useState<string | null>(searchParams.get('message'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isApiEnabled()) {
        const result = await apiLogin(email, password);
        signInEmail(result.user.email);
        await syncFromServer();
      } else {
        signInEmail(email);
      }

      const redirect = searchParams.get('redirect') || '/app/nearby';
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      setLoading(false);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    router.push('/app/nearby');
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, var(--background), var(--accent-coral-dark) 140%)' }}
    >
      <div className="w-full max-w-md space-y-6 rounded-[28px] p-8 shadow-2xl" style={{ background: 'var(--card)' }}>
        <div className="text-center">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--accent-coral), var(--brand-green))' }}
          >
            <UtensilsCrossed size={26} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
            Welcome back
          </h1>
          <p className="mt-2 text-sm font-medium text-[var(--text-secondary)]">
            Sign in to sync across devices
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {successMessage && (
            <div className="rounded-2xl border-2 p-4 text-sm font-medium" style={{ borderColor: 'var(--brand-green)', background: 'var(--green-tint)', color: 'var(--brand-green-dark)' }}>
              {successMessage}
            </div>
          )}
          {error && (
            <div className="rounded-2xl border-2 p-4 text-sm font-medium" style={{ borderColor: 'var(--destructive)', background: 'color-mix(in srgb, var(--destructive) 15%, transparent)', color: 'var(--destructive)' }}>
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-bold" style={{ color: 'var(--foreground)' }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field mt-2 block w-full px-4 py-3 text-base font-medium"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold" style={{ color: 'var(--foreground)' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field mt-2 block w-full px-4 py-3 text-base font-medium"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: 'var(--input-border)' }} />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 font-bold uppercase tracking-wide text-[var(--text-secondary)]" style={{ background: 'var(--card)' }}>
              Or
            </span>
          </div>
        </div>

        <button
          onClick={handleGuest}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 py-3.5 text-sm font-bold transition-transform hover:scale-[1.01]"
          style={{ borderColor: 'var(--input-border)', color: 'var(--text-secondary)' }}
        >
          <User size={15} strokeWidth={2.4} />
          Continue as guest (local only)
        </button>

        <p className="text-center text-sm font-medium text-[var(--text-secondary)]">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="font-bold" style={{ color: 'var(--accent-coral)' }}>
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
