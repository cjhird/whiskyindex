import { CategoryPage, categoryMetadata } from '@/components/insights/CategoryPage';

export const metadata = categoryMetadata('News');

type Props = {
  searchParams?: {
    q?: string;
    topic?: string;
    distillery?: string;
    sort?: string;
    page?: string;
  };
};

export default function InsightsNewsPage({ searchParams }: Props) {
  return <CategoryPage category="News" searchParams={searchParams} />;
}
