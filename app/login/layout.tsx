import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to the WhiskyIndex demo to preview portfolio and watchlist.',
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
