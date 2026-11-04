import Link from 'next/link';
import { marketIndices, topMovers } from '@/lib/mock/bottles';
import { ChangeText } from '@/components/ui/ChangeBadge';
import { formatGBP } from '@/lib/format';

export function MarketTape() {
  const { gainers } = topMovers(3);

  return (
    <div className="border-b border-line bg-[#1c1f24] text-white/80">
      <div className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-4 py-1.5 text-[10px] tracking-wide">
        <span className="shrink-0 font-mono-num uppercase text-white/35">Demo</span>
        {marketIndices.map((idx) => (
          <div key={idx.name} className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
            <span className="text-white/45">{idx.name}</span>
            <span className="font-mono-num text-white/85">{idx.value.toFixed(1)}</span>
            <ChangeText value={idx.change1d} className="text-[10px] opacity-80" />
          </div>
        ))}
        <span className="hidden h-3 w-px shrink-0 bg-white/15 sm:block" />
        {gainers.map((b) => (
          <Link
            key={b.id}
            href={`/bottles/${b.slug}`}
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-white/55 hover:text-white/90"
          >
            <span>{b.brand}</span>
            <span className="font-mono-num text-white/85">{formatGBP(b.latestPrice)}</span>
            <ChangeText value={b.change1m} className="text-[10px] opacity-80" />
          </Link>
        ))}
      </div>
    </div>
  );
}
