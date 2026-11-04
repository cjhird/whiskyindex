import Link from 'next/link';
import type { Article, ArticleBlock } from '@/lib/mock/types';
import { getBottleBySlug } from '@/lib/mock/bottles';
import { formatGBP } from '@/lib/format';
import { BottleImage } from '@/components/bottle/BottleImage';
import { ChangeText } from '@/components/ui/ChangeBadge';

function richText(text: string) {
  // Minimal **bold** and *italic* support for CMS copy
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });
}

function ChartSnapshot({
  block,
}: {
  block: Extract<ArticleBlock, { type: 'chartSnapshot' }>;
}) {
  const max = Math.max(...block.points.map((p) => p.value), 1);
  const width = 560;
  const height = 180;
  const pad = { t: 12, r: 12, b: 28, l: 36 };
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const gap = innerW / block.points.length;
  const barW = Math.max(8, gap * 0.55);

  return (
    <figure className="my-8 border border-line">
      <div className="border-b border-line px-4 py-3">
        <p className="text-sm font-semibold text-ink">{block.title}</p>
        <p className="mt-1 text-sm text-ink-muted">
          {block.period} · {block.source}
        </p>
      </div>
      <div className="px-2 py-3 sm:px-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={block.title}>
          {block.points.map((p, i) => {
            const h = (p.value / max) * innerH;
            const x = pad.l + i * gap + (gap - barW) / 2;
            const y = pad.t + innerH - h;
            return (
              <g key={p.label}>
                <rect x={x} y={y} width={barW} height={h} fill="var(--ink)" opacity={0.78} rx="1">
                  <title>
                    {p.label}: {p.value}
                  </title>
                </rect>
                <text
                  x={x + barW / 2}
                  y={height - 8}
                  textAnchor="middle"
                  className="fill-[var(--ink-faint)]"
                  fontSize="10"
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}

function BottleRef({ slug }: { slug: string }) {
  const bottle = getBottleBySlug(slug);
  if (!bottle) return null;
  return (
    <Link
      href={`/bottles/${bottle.slug}`}
      className="row-hover my-6 flex items-center gap-4 border border-line px-4 py-4"
    >
      <BottleImage bottle={bottle} size="sm" className="shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="label-meta">Bottle profile</p>
        <p className="mt-1 text-sm font-medium text-ink">{bottle.name}</p>
        <p className="text-sm text-ink-muted">
          {bottle.distillery} · {bottle.region}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-mono-num text-sm font-semibold text-ink">
          {formatGBP(bottle.latestPrice)}
        </p>
        <ChangeText value={bottle.change1y} className="text-sm" />
      </div>
    </Link>
  );
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case 'p':
      return <p className="my-5 text-[15px] leading-7 text-ink">{richText(block.text)}</p>;
    case 'h2':
      return (
        <h2 id={block.id} className="mb-3 mt-10 scroll-mt-24 text-xl font-semibold tracking-[-0.03em] text-ink">
          {block.text}
        </h2>
      );
    case 'h3':
      return (
        <h3 id={block.id} className="mb-2 mt-8 scroll-mt-24 text-lg font-semibold tracking-[-0.02em] text-ink">
          {block.text}
        </h3>
      );
    case 'ul':
      return (
        <ul className="my-5 list-disc space-y-2 pl-5 text-[15px] leading-7 text-ink">
          {block.items.map((item) => (
            <li key={item}>{richText(item)}</li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="my-5 list-decimal space-y-2 pl-5 text-[15px] leading-7 text-ink">
          {block.items.map((item) => (
            <li key={item}>{richText(item)}</li>
          ))}
        </ol>
      );
    case 'quote':
      return (
        <blockquote className="my-8 border-l-2 border-ink pl-4 text-[15px] leading-7 text-ink-muted">
          <p>{richText(block.text)}</p>
          {block.cite && <cite className="mt-2 block text-sm not-italic text-ink-faint">— {block.cite}</cite>}
        </blockquote>
      );
    case 'callout':
      return (
        <aside className="my-8 border border-line bg-surface-muted px-4 py-4">
          {block.title && <p className="text-sm font-semibold text-ink">{block.title}</p>}
          <p className={`text-sm leading-6 text-ink-muted ${block.title ? 'mt-2' : ''}`}>
            {richText(block.text)}
          </p>
        </aside>
      );
    case 'divider':
      return <hr className="my-10 border-line" />;
    case 'table':
      return (
        <figure className="my-8 overflow-x-auto">
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  {block.headers.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className={j === 0 ? 'font-medium text-ink' : 'font-mono-num'}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && (
            <figcaption className="mt-2 text-sm text-ink-faint">{block.caption}</figcaption>
          )}
        </figure>
      );
    case 'stats':
      return (
        <aside className="my-8 border border-line px-4 py-5">
          <p className="label-meta">
            {block.period} · {block.source}
          </p>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {block.items.map((item) => (
              <div key={item.label}>
                <dt className="text-sm text-ink-muted">{item.label}</dt>
                <dd className="mt-1 font-mono-num text-xl font-semibold text-ink">{item.value}</dd>
                {item.note && <p className="mt-0.5 text-sm text-ink-faint">{item.note}</p>}
              </div>
            ))}
          </dl>
        </aside>
      );
    case 'bottleRef':
      return <BottleRef slug={block.bottleSlug} />;
    case 'marketCta':
      return (
        <Link
          href={block.href}
          className="my-6 flex flex-col gap-1 border border-line px-4 py-4 hover:bg-surface-hover"
        >
          <span className="text-sm font-semibold text-ink">{block.label} →</span>
          {block.description && (
            <span className="text-sm text-ink-muted">{block.description}</span>
          )}
        </Link>
      );
    case 'chartSnapshot':
      return <ChartSnapshot block={block} />;
    case 'footnotes':
      return (
        <ol className="my-8 list-decimal space-y-2 border-t border-line pt-6 pl-5 text-sm leading-6 text-ink-muted">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    default:
      return null;
  }
}

export function ArticleBody({ article }: { article: Article }) {
  return (
    <div className="article-body">
      {article.blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
