'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Providers';

export default function SignupPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    await login(email || 'collector@whiskyindex.com');
    router.push('/portfolio');
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink">Create account</h1>
      <p className="mt-3 text-sm text-ink-muted">
        Demo signup signs you in immediately — wire real auth later.
      </p>
      <form onSubmit={onSubmit} className="surface mt-8 rounded-xl p-6">
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-line px-3 py-2.5 text-sm outline-none focus:border-line-strong"
            placeholder="you@example.com"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-md bg-ink py-2.5 text-sm font-medium text-white hover:bg-black"
        >
          {busy ? 'Creating…' : 'Continue'}
        </button>
        <p className="mt-4 text-center text-xs text-ink-faint">
          Already collecting?{' '}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
