'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Providers';
import { Button } from '@/components/ui/Button';
import { FieldLabel, TextField } from '@/components/ui/Field';

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
    <div className="mx-auto flex max-w-lg flex-col justify-center px-4 py-10 sm:py-14">
      <div className="surface-panel rounded-2xl p-6 sm:p-8">
        <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink">Join WhiskyIndex</h1>
        <p className="mt-3 text-sm text-ink-muted">
          Demo signup signs you in immediately — wire real auth later.
        </p>
        <p className="mt-4 text-sm text-ink-muted">
          <span className="text-ink">Demo mode.</span> Any email creates a mock session.
        </p>
        <form onSubmit={onSubmit} className="mt-6">
          <label className="block">
            <FieldLabel>Email</FieldLabel>
            <TextField
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <Button type="submit" disabled={busy} className="mt-6 w-full py-3">
            {busy ? 'Creating…' : 'Continue'}
          </Button>
          <p className="mt-4 text-center text-xs text-ink-muted">
            Already collecting?{' '}
            <Link href="/login" className="font-medium text-ink underline-offset-2 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
