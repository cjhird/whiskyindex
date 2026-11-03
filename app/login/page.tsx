'use client';

import Link from 'next/link';
import { FormEvent, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/Providers';
import { Button } from '@/components/ui/Button';
import { FieldLabel, TextField } from '@/components/ui/Field';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';

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
    <div className="mx-auto flex max-w-7xl items-center px-4 py-10 sm:py-14">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <div className="surface-panel flex flex-col justify-center rounded-xl p-6 sm:p-8">
          <p className="label-caps">Portfolio access</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-[2.15rem]">
            Access your portfolio marks
          </h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-ink-muted">
            Sign in to review holdings, unrealised P&amp;L, and bottle-level auction marks. Screener
            and research stay public.
          </p>
          <div className="mt-6">
            <DisclaimerBanner>
              <span className="font-semibold text-ink">Demo mode.</span> Any email works — password is
              not validated in this build.
            </DisclaimerBanner>
          </div>
        </div>

        <form onSubmit={onSubmit} className="surface flex flex-col justify-center rounded-xl p-6 sm:p-8">
          <label className="block">
            <FieldLabel>Email</FieldLabel>
            <TextField
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="mt-4 block">
            <FieldLabel>Password</FieldLabel>
            <TextField
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <Button type="submit" disabled={busy} className="mt-6 w-full py-3">
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>
          <p className="mt-4 text-center text-xs font-medium text-ink-muted">
            No account yet?{' '}
            <Link href="/signup" className="font-semibold text-ink underline-offset-2 hover:underline">
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
