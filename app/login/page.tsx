'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useAuth } from '@/components/Providers';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/portfolio';
  const [email, setEmail] = useState('collector@whiskyindex.com');
  const [password, setPassword] = useState('demo');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    await login(email);
    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-4 py-12">
      <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">Member access</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">
            Sign in to WhiskyIndex
          </h1>
          <p className="mt-4 max-w-md text-ink-muted">
            Portfolio marks, private watchlists, and deeper lot history unlock after sign-in. Demo mode
            accepts any email.
          </p>
        </div>

        <form onSubmit={onSubmit} className="surface mx-auto w-full max-w-md rounded-xl p-6 sm:p-8">
          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-line-strong"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-line-strong"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="mt-6 w-full rounded-md bg-ink py-2.5 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
          <p className="mt-4 text-center text-xs text-ink-faint">
            No account yet?{' '}
            <Link href="/signup" className="text-ink-muted underline hover:text-ink">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
