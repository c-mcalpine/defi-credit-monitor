interface MetricCardsProps {
  totalTvl: number;
  weightedStableBorrowRate: number;
  weightedUtilization: number;
  poolCount: number;
}

function formatTvl(tvl: number): string {
  if (tvl >= 1_000_000_000) {
    return `$${(tvl / 1_000_000_000).toFixed(1)}B`;
  }
  return `$${(tvl / 1_000_000).toFixed(0)}M`;
}

interface CardConfig {
  label: string;
  value: string;
  subtitle: string;
  tradFiAnalog: string;
}

function Card({ label, value, subtitle, tradFiAnalog }: CardConfig) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-5 py-4">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-zinc-100">{value}</p>
      <p className="mt-0.5 text-xs text-zinc-400">{subtitle}</p>
      <p className="mt-2 text-xs italic text-zinc-600">{tradFiAnalog}</p>
    </div>
  );
}

export default function MetricCards({
  totalTvl,
  weightedStableBorrowRate,
  weightedUtilization,
  poolCount,
}: MetricCardsProps) {
  const cards: CardConfig[] = [
    {
      label: "Total Lending TVL",
      value: formatTvl(totalTvl),
      subtitle: "Across all monitored pools",
      tradFiAnalog: "Comparable to total outstanding bank loan volume.",
    },
    {
      label: "Stable Borrow Rate",
      value: `${weightedStableBorrowRate.toFixed(2)}%`,
      subtitle: "TVL-weighted across USDC, USDT, DAI",
      tradFiAnalog: "Analogous to the effective federal funds rate.",
    },
    {
      label: "Utilization Rate",
      value: `${weightedUtilization.toFixed(1)}%`,
      subtitle: "TVL-weighted across all assets",
      tradFiAnalog: "Similar to loan-to-deposit ratio in banking.",
    },
    {
      label: "Active Pools",
      value: poolCount.toString(),
      subtitle: "Qualifying lending markets",
      tradFiAnalog: "Like the number of active credit facilities.",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} {...card} />
      ))}
    </div>
  );
}
