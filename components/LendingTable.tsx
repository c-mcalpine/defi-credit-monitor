"use client";

import { useState, useMemo } from "react";
import type { LendingPool } from "@/lib/defillama";

type SortKey = keyof LendingPool;
type SortDir = "asc" | "desc";

const STABLECOINS = new Set(["USDC", "USDT", "DAI"]);

const COLUMNS: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "project", label: "Protocol" },
  { key: "symbol", label: "Asset" },
  { key: "chain", label: "Chain" },
  { key: "apy", label: "Supply APY", align: "right" },
  { key: "apyBaseBorrow", label: "Borrow APY", align: "right" },
  { key: "utilRate", label: "Utilization", align: "right" },
  { key: "tvlUsd", label: "TVL", align: "right" },
];

function borrowColor(rate: number, symbol: string): string {
  if (!STABLECOINS.has(symbol)) return "text-zinc-200";
  if (rate > 8) return "text-red-400";
  if (rate >= 4) return "text-amber-400";
  return "text-green-400";
}

function formatTvl(tvl: number): string {
  if (tvl >= 1_000_000_000) return `$${(tvl / 1_000_000_000).toFixed(2)}B`;
  if (tvl >= 1_000_000) return `$${(tvl / 1_000_000).toFixed(1)}M`;
  return `$${(tvl / 1_000).toFixed(0)}K`;
}

function utilBarColor(rate: number): string {
  if (rate > 85) return "bg-red-500";
  if (rate > 65) return "bg-amber-500";
  return "bg-green-500";
}

interface LendingTableProps {
  pools: LendingPool[];
}

export default function LendingTable({ pools }: LendingTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("tvlUsd");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const sorted = useMemo(() => {
    const copy = [...pools];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc"
          ? av.localeCompare(bv)
          : bv.localeCompare(av);
      }
      const an = av as number;
      const bn = bv as number;
      return sortDir === "asc" ? an - bn : bn - an;
    });
    return copy;
  }, [pools, sortKey, sortDir]);

  const arrow = (key: SortKey) => {
    if (key !== sortKey) return " ↕";
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/80">
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className={`cursor-pointer select-none whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500 hover:text-zinc-300 ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {col.label}
                <span className="text-zinc-600">{arrow(col.key)}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {sorted.map((pool, i) => (
            <tr
              key={pool.id}
              className={
                i % 2 === 0 ? "bg-zinc-950/40" : "bg-zinc-900/20"
              }
            >
              <td className="whitespace-nowrap px-4 py-3 font-medium text-zinc-200">
                {pool.project}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-zinc-300">
                {pool.symbol}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-zinc-400">
                {pool.chain}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-zinc-200">
                {pool.apy.toFixed(2)}%
              </td>
              <td
                className={`whitespace-nowrap px-4 py-3 text-right font-medium ${borrowColor(
                  pool.apyBaseBorrow,
                  pool.symbol
                )}`}
              >
                {pool.apyBaseBorrow.toFixed(2)}%
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-zinc-300">
                    {pool.utilRate.toFixed(1)}%
                  </span>
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className={`h-full rounded-full ${utilBarColor(
                        pool.utilRate
                      )}`}
                      style={{
                        width: `${Math.min(pool.utilRate, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-zinc-300">
                {formatTvl(pool.tvlUsd)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
