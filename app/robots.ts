import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://whiskyindex.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/login', '/signup', '/portfolio', '/watchlist'],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
