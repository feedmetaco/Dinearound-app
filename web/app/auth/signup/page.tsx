'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useDineAroundStore } from '@/lib/local-store';
import { apiRegister, isApiEnabled } from '@/lib/api-client';
import { syncFromServer } from '@/lib/sync-service';
import Link from 'next/link';
import { UtensilsCrossed, User } from 'lucide-react';

function SignupForm() {
  const router = useRouter();
  const signInEmail = useDineAroundStore((s) => s.signInEmail);
  const continueAsGuest = useDineAroundStore((s) => s.continueAsGuest);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isApiEnabled()) {
        const result = await apiRegister(email, password);
        signInEmail(result.user.email);
        await syncFromServer();
        router.push('/app/nearby');
        return;
      }

      signInEmail(email);
      router.push('/auth/login?message=Account created locally. Configure API URL for cloud sync.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
      setLoading(false);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    router.push('/app/nearby');
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-md space-y-6 rounded-[24px] p-8" style={{ background: 'var(--card)', boxShadow: 'var(--shadow-card-hover)' }}>
        <div className="text-center">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: 'var(--brand-green)' }}
          >
            <UtensilsCrossed size={26} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-3xl font-extrabold" style={{ color: 'var(--foreground)' }}>
            Join DineAround
          </h1>
          <p className="mt-2 text-sm font-medium text-[var(--text-secondary)]">
            Create an account to sync across web and iOS
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field mt-2 block w-full px-4 py-3 text-base font-medium"
              placeholder="At least 6 characters"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-green w-full py-4 text-base text-white">
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <button
          onClick={handleGuest}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 py-3.5 text-sm font-bold transition-transform hover:scale-[1.01]"
          style={{ borderColor: 'var(--input-border)', color: 'var(--text-secondary)' }}
        >
          <User size={15} strokeWidth={2.4} />
          Continue as guest (local only)
        </button>

        <p className="text-center text-sm font-medium text-[var(--text-secondary)]">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-bold" style={{ color: 'var(--brand-green)' }}>
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
