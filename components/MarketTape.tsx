import Link from 'next/link';
import { marketIndices, topMovers } from '@/lib/mock/bottles';
import { ChangeText } from '@/components/ui/ChangeBadge';
import { formatGBP } from '@/lib/format';

export function MarketTape() {
  const { gainers } = topMovers(3);

  return (
    <div className="border-b border-line bg-ink text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-2 text-[11px] tracking-wide">
        <span className="shrink-0 font-mono-num uppercase text-white/50">Live marks</span>
        {marketIndices.map((idx) => (
          <div key={idx.name} className="flex shrink-0 items-center gap-2 whitespace-nowrap">
            <span className="text-white/70">{idx.name}</span>
            <span className="font-mono-num text-white">{idx.value.toFixed(1)}</span>
            <ChangeText value={idx.change1d} className="text-[11px]" />
          </div>
        ))}
        <span className="hidden h-3 w-px shrink-0 bg-white/20 sm:block" />
        {gainers.map((b) => (
          <Link
            key={b.id}
            href={`/bottle/${b.slug}`}
            className="flex shrink-0 items-center gap-2 whitespace-nowrap text-white/80 hover:text-white"
          >
            <span>{b.brand}</span>
            <span className="font-mono-num text-white">{formatGBP(b.latestPrice)}</span>
            <ChangeText value={b.change1m} className="text-[11px]" />
          </Link>
        ))}
      </div>
    </div>
  );
}
