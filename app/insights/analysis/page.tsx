import { CategoryPage, categoryMetadata } from '@/components/insights/CategoryPage';

export const metadata = categoryMetadata('Analysis');

type Props = {
  searchParams?: {
    q?: string;
    topic?: string;
    distillery?: string;
    sort?: string;
    page?: string;
  };
};

export default function InsightsAnalysisPage({ searchParams }: Props) {
  return <CategoryPage category="Analysis" searchParams={searchParams} />;
}
