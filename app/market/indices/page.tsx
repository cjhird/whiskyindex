import { redirect } from 'next/navigation';

/** Canonical indices hub lives at `/indices`. */
export default function MarketIndicesRedirectPage() {
  redirect('/indices');
}
