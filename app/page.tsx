import { HomeHero } from '@/components/home/HomeHero';
import { HomeMarketGlance } from '@/components/home/HomeMarketGlance';
import { HomeBottleDiscovery } from '@/components/home/HomeBottleDiscovery';
import { HomeCapabilities } from '@/components/home/HomeCapabilities';
import { HomeInsights } from '@/components/home/HomeInsights';
import { HomeFinalCta } from '@/components/home/HomeFinalCta';

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeMarketGlance />
      <HomeBottleDiscovery />
      <HomeCapabilities />
      <HomeInsights />
      <HomeFinalCta />
    </>
  );
}
