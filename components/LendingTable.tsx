"use client";

import { useState, useMemo } from "react";
import type { LendingPool } from "@/lib/defillama";
import { formatTvl, STABLECOINS, COLORS } from "@/lib/constants";

type SortKey = keyof LendingPool | "yieldSpread";
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "project", label: "Protocol" },
  { key: "symbol", label: "Asset" },
  { key: "chain", label: "Chain" },
  { key: "apy", label: "Supply APY", align: "right" },
  { key: "apyBaseBorrow", label: "Borrow APY", align: "right" },
  { key: "yieldSpread", label: "Spread", align: "right" },
  { key: "utilRate", label: "Utilization", align: "right" },
  { key: "tvlUsd", label: "TVL", align: "right" },
];

function borrowColor(rate: number, symbol: string): string {
  if (!STABLECOINS.has(symbol)) return "text-zinc-200";
  if (rate > 8) return "text-red-400";
  if (rate >= 4) return "text-amber-400";
  return "text-green-400";
}

function spreadColor(spread: number): string {
  if (spread > 5) return "text-red-400";
  if (spread >= 2) return "text-amber-400";
  return "text-green-400";
}

function utilBarColor(rate: number): string {
  if (rate > 85) return COLORS.utilHigh;
  if (rate > 65) return COLORS.utilMedium;
  return COLORS.utilLow;
}

function protocolIconUrl(project: string): string {
  return `https://icons.llamao.fi/icons/protocols/${project.toLowerCase().replace(/\s+/g, "-")}?w=32&h=32`;
}

function chainIconUrl(chain: string): string {
  return `https://icons.llamao.fi/icons/chains/rsz_${chain.toLowerCase().replace(/\s+/g, "")}?w=32&h=32`;
}

interface PoolDelta {
  poolId: string;
  borrowApyDelta: number;
  supplyApyDelta: number;
}

interface LendingTableProps {
  pools: LendingPool[];
  poolDeltas?: PoolDelta[];
}

function DeltaIndicator({ delta }: { delta: number | undefined }) {
  if (delta === undefined || Math.abs(delta) < 0.005) return null;
  const isUp = delta > 0;
  const color = isUp ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]";
  return (
    <span className={`ml-1 text-[10px] font-mono ${color}`}>
      {isUp ? "▲" : "▼"}{Math.abs(delta).toFixed(2)}
    </span>
  );
}

export default function LendingTable({ pools, poolDeltas = [] }: LendingTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("tvlUsd");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filter, setFilter] = useState("");

  const deltaMap = useMemo(() => {
    const map = new Map<string, PoolDelta>();
    for (const d of poolDeltas) map.set(d.poolId, d);
    return map;
  }, [poolDeltas]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function getSpread(pool: LendingPool): number {
    return pool.apyBaseBorrow - pool.apy;
  }

  function getSortValue(pool: LendingPool, key: SortKey): string | number {
    if (key === "yieldSpread") return getSpread(pool);
    return pool[key as keyof LendingPool] as string | number;
  }

  const sorted = useMemo(() => {
    let filtered = pools;
    if (filter.trim()) {
      const q = filter.toLowerCase();
      filtered = pools.filter(
        (p) =>
          p.project.toLowerCase().includes(q) ||
          p.symbol.toLowerCase().includes(q) ||
          p.chain.toLowerCase().includes(q),
      );
    }

    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = getSortValue(a, sortKey);
      const bv = getSortValue(b, sortKey);
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
  }, [pools, sortKey, sortDir, filter]);

  const arrow = (key: SortKey) => {
    if (key !== sortKey) return " ↕";
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="rounded-lg border border-[var(--border)] overflow-hidden">
      {/* Filter input */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5">
        <input
          type="text"
          placeholder="Filter by protocol, asset, or chain…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full bg-transparent text-sm text-zinc-200 placeholder-zinc-600 outline-none font-sans"
        />
      </div>

      {/* Scrollable table with sticky header + frozen first col on mobile */}
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
              {COLUMNS.map((col, idx) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`cursor-pointer select-none whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500 hover:text-zinc-300 ${
                    col.align === "right" ? "text-right" : "text-left"
                  }${idx === 0 ? " sticky left-0 z-20 bg-[var(--bg-elevated)]" : ""}`}
                >
                  {col.label}
                  <span className="text-zinc-600">{arrow(col.key)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-8 text-center text-sm text-zinc-500">
                  No pools match your filter
                </td>
              </tr>
            ) : null}
            {sorted.map((pool) => {
              const spread = getSpread(pool);
              return (
                <tr
                  key={pool.id}
                  className="bg-[var(--bg-card)] transition-colors hover:bg-[var(--bg-elevated)]"
                >
                  {/* Protocol with icon — frozen on mobile */}
                  <td className="sticky left-0 z-10 whitespace-nowrap bg-[var(--bg-card)] px-4 py-3 font-medium text-zinc-200 transition-colors [tr:hover_&]:bg-[var(--bg-elevated)]">
                    <div className="flex items-center gap-2">
                      <img
                        src={protocolIconUrl(pool.project)}
                        alt=""
                        width={16}
                        height={16}
                        className="rounded-full"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      {pool.project}
                    </div>
                  </td>

                  {/* Asset */}
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-300">
                    {pool.symbol}
                  </td>

                  {/* Chain with icon */}
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-400">
                    <div className="flex items-center gap-2">
                      <img
                        src={chainIconUrl(pool.chain)}
                        alt=""
                        width={16}
                        height={16}
                        className="rounded-full"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      {pool.chain}
                    </div>
                  </td>

                  {/* Supply APY */}
                  <td className="whitespace-nowrap px-4 py-3 text-right text-zinc-200 font-mono tabular-nums">
                    {pool.apy.toFixed(2)}%
                    <DeltaIndicator delta={deltaMap.get(pool.id)?.supplyApyDelta} />
                  </td>

                  {/* Borrow APY */}
                  <td
                    className={`whitespace-nowrap px-4 py-3 text-right font-medium font-mono tabular-nums ${borrowColor(
                      pool.apyBaseBorrow,
                      pool.symbol,
                    )}`}
                  >
                    {pool.apyBaseBorrow.toFixed(2)}%
                    <DeltaIndicator delta={deltaMap.get(pool.id)?.borrowApyDelta} />
                  </td>

                  {/* Yield Spread */}
                  <td
                    className={`whitespace-nowrap px-4 py-3 text-right font-mono tabular-nums ${spreadColor(spread)}`}
                  >
                    {spread.toFixed(2)}%
                  </td>

                  {/* Utilization */}
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-zinc-300 font-mono tabular-nums">
                        {pool.utilRate.toFixed(1)}%
                      </span>
                      <div className="h-2 w-16 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(pool.utilRate, 100)}%`,
                            backgroundColor: utilBarColor(pool.utilRate),
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* TVL */}
                  <td className="whitespace-nowrap px-4 py-3 text-right text-zinc-300 font-mono tabular-nums">
                    {formatTvl(pool.tvlUsd)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
