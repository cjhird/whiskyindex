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
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-[-0.03em] text-ink">Create account</h1>
      <p className="mt-2 text-sm text-ink-muted">Demo signup signs you in immediately.</p>

      <form onSubmit={onSubmit} className="mt-8">
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
        <Button type="submit" disabled={busy} className="mt-6 px-8 py-2.5">
          {busy ? 'Creating…' : 'Continue'}
        </Button>
      </form>

      <p className="mt-8 text-xs text-ink-muted">
        Already collecting?{' '}
        <Link href="/login" className="text-ink underline-offset-2 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
