import type { Metadata } from 'next';
import { ScreenerDashboard } from '@/components/screener/ScreenerDashboard';

export const metadata: Metadata = {
  title: 'Whisky Screener',
  description:
    'Discover, filter and compare collectible whiskies using historical auction prices and market data.',
};

export default function ScreenerPage() {
  return <ScreenerDashboard />;
}
