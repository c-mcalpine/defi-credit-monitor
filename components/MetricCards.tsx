"use client";

import { useState } from "react";
import { formatTvl } from "@/lib/constants";

interface SignalDeltas {
  stableBorrowRateDelta: number;
  utilizationDelta: number;
  tvlDelta: number;
}

interface MetricCardsProps {
  totalTvl: number;
  weightedStableBorrowRate: number;
  weightedUtilization: number;
  poolCount: number;
  signalDeltas: SignalDeltas | null;
}

interface CardConfig {
  label: string;
  value: string;
  subtitle: string;
  tradFiAnalog: string;
  delta?: number;
  deltaFormat?: "percent" | "usd";
}

function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-zinc-500 hover:bg-[var(--bg-elevated)] hover:text-zinc-300 transition-colors"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        aria-label="More info"
      >
        i
      </button>
      {show && (
        <span className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 whitespace-normal rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-zinc-300 shadow-lg w-56 z-10">
          {text}
        </span>
      )}
    </span>
  );
}

function formatDelta(delta: number, format: "percent" | "usd"): string {
  if (format === "usd") {
    const abs = Math.abs(delta);
    if (abs >= 1_000_000_000) return `$${(abs / 1_000_000_000).toFixed(1)}B`;
    if (abs >= 1_000_000) return `$${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `$${(abs / 1_000).toFixed(0)}K`;
    return `$${abs.toFixed(0)}`;
  }
  return `${Math.abs(delta).toFixed(2)}%`;
}

function DeltaBadge({ delta, format = "percent" }: { delta: number; format?: "percent" | "usd" }) {
  if (Math.abs(delta) < 0.001) return null;
  const isPositive = delta > 0;
  const arrow = isPositive ? "▲" : "▼";
  const color = isPositive ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]";

  return (
    <span className={`ml-2 inline-flex items-center gap-0.5 text-xs font-mono tabular-nums ${color}`}>
      {arrow} {formatDelta(delta, format)}
    </span>
  );
}

function Card({ label, value, subtitle, tradFiAnalog, delta, deltaFormat = "percent" }: CardConfig) {
  return (
    <div className="rounded-lg border border-[var(--border)] border-l-2 border-l-[var(--accent-blue)] bg-[var(--bg-card)] px-5 py-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-wide text-zinc-500">
          {label}
        </p>
        <InfoTooltip text={tradFiAnalog} />
      </div>
      <div className="mt-1 flex items-baseline">
        <p className="text-3xl font-bold text-zinc-100 font-mono tabular-nums">
          {value}
        </p>
        {delta !== undefined && <DeltaBadge delta={delta} format={deltaFormat} />}
      </div>
      <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>
    </div>
  );
}

export default function MetricCards({
  totalTvl,
  weightedStableBorrowRate,
  weightedUtilization,
  poolCount,
  signalDeltas,
}: MetricCardsProps) {
  const cards: CardConfig[] = [
    {
      label: "Total Lending TVL",
      value: formatTvl(totalTvl),
      subtitle: "Across all monitored pools",
      tradFiAnalog: "Comparable to total outstanding bank loan volume.",
      delta: signalDeltas?.tvlDelta,
      deltaFormat: "usd",
    },
    {
      label: "Stable Borrow Rate",
      value: `${weightedStableBorrowRate.toFixed(2)}%`,
      subtitle: "TVL-weighted across USDC, USDT, DAI",
      tradFiAnalog: "Analogous to the effective federal funds rate.",
      delta: signalDeltas?.stableBorrowRateDelta,
      deltaFormat: "percent",
    },
    {
      label: "Utilization Rate",
      value: `${weightedUtilization.toFixed(1)}%`,
      subtitle: "TVL-weighted across all assets",
      tradFiAnalog: "Similar to loan-to-deposit ratio in banking.",
      delta: signalDeltas?.utilizationDelta,
      deltaFormat: "percent",
    },
    {
      label: "Active Pools",
      value: poolCount.toString(),
      subtitle: "Qualifying lending markets",
      tradFiAnalog: "Like the number of active credit facilities.",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} {...card} />
      ))}
    </div>
  );
}
