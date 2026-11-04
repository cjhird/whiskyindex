import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Create a WhiskyIndex demo account to preview portfolio and watchlist.',
  robots: { index: false, follow: false },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
