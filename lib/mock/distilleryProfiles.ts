export type DistilleryProfile = {
  slug: string;
  founded: number | null;
  status: 'Operating' | 'Closed' | 'Mothballed';
  style: string;
  summary: string;
};

/** Compact editorial profiles for distillery pages — factual, not marketing fluff. */
export const distilleryProfiles: DistilleryProfile[] = [
  {
    slug: 'macallan',
    founded: 1824,
    status: 'Operating',
    style: 'Sherry-seasoned Speyside single malt',
    summary:
      'Speyside distillery known for sherry-cask maturation and a deep secondary-market continuum. Continuum releases trade frequently; limited and NAS lines show wider lot dispersion.',
  },
  {
    slug: 'springbank',
    founded: 1828,
    status: 'Operating',
    style: 'Campbeltown malt, mixed cask regimes',
    summary:
      'Family-owned Campbeltown producer with constrained aged stock. Core expressions such as 15-year-old clear often enough for reliable auction marks.',
  },
  {
    slug: 'yamazaki',
    founded: 1923,
    status: 'Operating',
    style: 'Japanese single malt, mixed oak',
    summary:
      'Suntory flagship malt. Core aged bottlings remain more liquid than trophy single casks; packaging and label condition still move comps.',
  },
  {
    slug: 'suntory',
    founded: 1923,
    status: 'Operating',
    style: 'Japanese blended whisky',
    summary:
      'Parent house for Hibiki and related blends. Aged Hibiki expressions appear less often than core Yamazaki and trade with wider spreads.',
  },
  {
    slug: 'ardbeg',
    founded: 1815,
    status: 'Operating',
    style: 'Islay peated single malt',
    summary:
      'Islay peat benchmark. Core cask-strength lines such as Uigeadail have high auction frequency and tight observed marks.',
  },
  {
    slug: 'karuizawa',
    founded: 1955,
    status: 'Closed',
    style: 'Closed-distillery Japanese single malt',
    summary:
      'Closed Japanese distillery. Each cask number is a separate canonical bottle; sales are infrequent and bid-driven.',
  },
  {
    slug: 'port-ellen',
    founded: 1825,
    status: 'Mothballed',
    style: 'Closed Islay single malt (Special Releases)',
    summary:
      'Historic Islay site represented mainly through Diageo annual releases. Keep each release number as its own bottle identity.',
  },
  {
    slug: 'glenfarclas',
    founded: 1836,
    status: 'Operating',
    style: 'Family-owned Speyside sherry malt',
    summary:
      'Independent Speyside distillery with a long sherry-cask tradition. Aged core range trades regularly at mid-market price points.',
  },
  {
    slug: 'lagavulin',
    founded: 1816,
    status: 'Operating',
    style: 'Islay peated single malt',
    summary:
      'Core Islay 16-year-old has deep auction history and high trading frequency, supporting tight secondary marks.',
  },
  {
    slug: 'balvenie',
    founded: 1892,
    status: 'Operating',
    style: 'Speyside single malt, varied finishes',
    summary:
      'Speyside producer with both core and aged official bottlings. Higher-age stock trades less often than entry continuum bottles.',
  },
  {
    slug: 'bowmore',
    founded: 1779,
    status: 'Operating',
    style: 'Islay single malt',
    summary:
      'Islay distillery spanning core peated malt and rare vintage series. Black Bowmore editions are kept as separate canonical releases.',
  },
];

export function getDistilleryProfile(slug: string) {
  return distilleryProfiles.find((d) => d.slug === slug) ?? null;
}
