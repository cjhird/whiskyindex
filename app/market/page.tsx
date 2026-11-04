import type { Metadata } from 'next';
import { MarketDashboard } from '@/components/market/MarketDashboard';

export const metadata: Metadata = {
  title: 'Whisky Market Overview',
  description:
    'Secondary-market auction turnover, trading volume, segment activity and recent results on WhiskyIndex.',
};

export default function MarketPage() {
  return <MarketDashboard />;
}
