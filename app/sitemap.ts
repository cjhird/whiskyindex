import type { MetadataRoute } from 'next';
import { bottles, distilleries } from '@/lib/mock/bottles';
import { allArticleSlugs, CATEGORY_META } from '@/lib/mock/articles';
import { auctionHouses } from '@/lib/mock/auctionHouses';
import { indexProfiles } from '@/lib/mock/indices';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://whiskyindex.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/market',
    '/indices',
    '/screener',
    '/bottles',
    '/auctions',
    '/insights',
    '/pricing',
    '/methodology',
    '/data-sources',
    '/about',
    '/contact',
    '/disclaimer',
    '/privacy',
    '/terms',
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date('2026-03-01'),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }));

  const categoryRoutes = Object.values(CATEGORY_META).map((c) => ({
    url: `${BASE}/insights/${c.route}`,
    lastModified: new Date('2026-03-01'),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const bottleRoutes = bottles.map((b) => ({
    url: `${BASE}/bottles/${b.slug}`,
    lastModified: new Date('2026-03-01'),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const distilleryRoutes = distilleries().map((d) => ({
    url: `${BASE}/distilleries/${d.slug}`,
    lastModified: new Date('2026-03-01'),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const articleRoutes = allArticleSlugs().map((slug) => ({
    url: `${BASE}/insights/${slug}`,
    lastModified: new Date('2026-03-01'),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const houseRoutes = auctionHouses.map((h) => ({
    url: `${BASE}/auctions/${h.slug}`,
    lastModified: new Date('2026-03-01'),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const indexRoutes = indexProfiles.map((i) => ({
    url: `${BASE}/indices/${i.slug}`,
    lastModified: new Date('2026-03-01'),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...bottleRoutes,
    ...distilleryRoutes,
    ...articleRoutes,
    ...houseRoutes,
    ...indexRoutes,
  ];
}
