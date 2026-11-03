'use client';

import Link from 'next/link';
import { FormEvent, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/Providers';
import { Button } from '@/components/ui/Button';
import { FieldLabel, TextField } from '@/components/ui/Field';

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
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-[-0.03em] text-ink">Sign in</h1>
      <p className="mt-2 text-sm text-ink-muted">Access portfolio marks and holdings.</p>

      <form onSubmit={onSubmit} className="mt-8">
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
        <Button type="submit" disabled={busy} className="mt-6 px-8 py-2.5">
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-8 text-xs text-ink-muted">
        Demo mode — any email works; password is not validated.{' '}
        <Link href="/signup" className="text-ink underline-offset-2 hover:underline">
          Create account
        </Link>
      </p>
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
