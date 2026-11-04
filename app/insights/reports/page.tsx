import { CategoryPage, categoryMetadata } from '@/components/insights/CategoryPage';

export const metadata = categoryMetadata('Market Report');

type Props = {
  searchParams?: {
    q?: string;
    topic?: string;
    distillery?: string;
    sort?: string;
    page?: string;
  };
};

export default function InsightsReportsPage({ searchParams }: Props) {
  return <CategoryPage category="Market Report" searchParams={searchParams} />;
}
