/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/blog', destination: '/insights', permanent: true },
      { source: '/blog/:slug', destination: '/insights/:slug', permanent: true },
      { source: '/bottle/:slug', destination: '/bottles/:slug', permanent: true },
      {
        source: '/bottles/macallan-18-sherry-oak',
        destination: '/bottles/macallan-18-year-old-sherry-oak-1996',
        permanent: true,
      },
      { source: '/research', destination: '/insights', permanent: true },
    ];
  },
};

export default nextConfig;
