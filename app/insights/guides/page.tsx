import { CategoryPage, categoryMetadata } from '@/components/insights/CategoryPage';

export const metadata = categoryMetadata('Guide');

type Props = {
  searchParams?: {
    q?: string;
    topic?: string;
    distillery?: string;
    sort?: string;
    page?: string;
  };
};

export default function InsightsGuidesPage({ searchParams }: Props) {
  return <CategoryPage category="Guide" searchParams={searchParams} />;
}
