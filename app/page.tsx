"use client";

import { useState } from "react";
import useSWR from "swr";
import type { LendingPool } from "@/lib/defillama";
import type { MarketSignals } from "@/lib/signals";
import type { LiquidationRow, BorrowVolumeRow, StableFlowRow } from "@/lib/dune";
import SignalBanner from "@/components/SignalBanner";
import MetricCards from "@/components/MetricCards";
import LendingTable from "@/components/LendingTable";
import TvlChart from "@/components/TvlChart";
import UtilizationChart from "@/components/UtilizationChart";
import LiquidationChart from "@/components/LiquidationChart";
import BorrowVolumeChart from "@/components/BorrowVolumeChart";
import StableFlowChart from "@/components/StableFlowChart";
import YieldCurveChart from "@/components/YieldCurveChart";
import SignalBreakdown from "@/components/SignalBreakdown";

interface PoolDelta {
  poolId: string;
  borrowApyDelta: number;
  supplyApyDelta: number;
}

interface SignalDeltas {
  stableBorrowRateDelta: number;
  utilizationDelta: number;
  tvlDelta: number;
}

interface DefiResponse {
  pools: LendingPool[];
  signals: MarketSignals;
  poolDeltas: PoolDelta[];
  signalDeltas: SignalDeltas | null;
  fetchedAt: string;
}

interface DuneResponse {
  liquidations: LiquidationRow[];
  borrowVolume: BorrowVolumeRow[];
  stableFlows: StableFlowRow[];
  fetchedAt: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function Skeleton() {
  return (
    <div className="mx-auto w-full max-w-[1440px] animate-pulse space-y-4 px-4 py-6 sm:px-6 lg:px-8">
      <div className="h-8 w-72 rounded bg-[var(--bg-card)]" />
      <div className="h-10 rounded bg-[var(--bg-card)]" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-lg bg-[var(--bg-card)]" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-96 rounded-lg bg-[var(--bg-card)] lg:col-span-2" />
        <div className="space-y-6">
          <div className="h-[184px] rounded-lg bg-[var(--bg-card)]" />
          <div className="h-[184px] rounded-lg bg-[var(--bg-card)]" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { data, error, isLoading } = useSWR<DefiResponse>(
    "/api/defi",
    fetcher,
    { refreshInterval: 60_000 },
  );
  const { data: duneData, isLoading: duneLoading } = useSWR<DuneResponse>(
    "/api/dune",
    fetcher,
    { refreshInterval: 3_600_000 },
  );
  const [showMethodology, setShowMethodology] = useState(false);

  if (isLoading || !data) return <Skeleton />;

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-4">
        <div className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-red)]/10">
            <svg className="h-6 w-6 text-[var(--accent-red)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="mb-2 text-lg font-semibold text-zinc-100">Failed to load data</h2>
          <p className="mb-6 text-sm text-zinc-400">
            Could not fetch lending pool data. This may be a temporary issue with an upstream API.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-md bg-[var(--accent-blue)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-blue)]/80"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { pools, signals, poolDeltas, signalDeltas, fetchedAt } = data;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-zinc-100">
      {/* ── Methodology Modal ──────────────────────────────────── */}
      {showMethodology && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowMethodology(false)}>
          <div className="relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowMethodology(false)}
              className="absolute right-4 top-4 text-zinc-500 transition-colors hover:text-zinc-200"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="mb-4 text-lg font-semibold text-zinc-100">About &amp; Methodology</h2>

            <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
              <div>
                <h3 className="mb-1 font-medium text-zinc-100">Data Sources</h3>
                <ul className="list-disc space-y-1 pl-5 text-zinc-400">
                  <li><span className="text-zinc-300">DeFi Llama</span> — Real-time lending pool data including supply/borrow APYs, TVL, and utilization rates across Aave V2/V3, Compound V3, Morpho, and Spark.</li>
                  <li><span className="text-zinc-300">Dune Analytics</span> — Historical data for daily liquidation volumes, USDC borrow activity, and stablecoin net flows (90-day lookback).</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-1 font-medium text-zinc-100">Market Signal Logic</h3>
                <p className="text-zinc-400">
                  The market regime signal is computed from two TVL-weighted metrics across all monitored stablecoin pools (USDC, USDT, DAI):
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-400">
                  <li><span className="text-[var(--accent-red)]">Risk-On</span> — Stable borrow rate &gt;7% <em>or</em> utilization &gt;82%. Indicates elevated leverage demand and aggressive capital deployment.</li>
                  <li><span className="text-[var(--accent-amber)]">Neutral</span> — Rates and utilization within normal ranges. No strong directional signal.</li>
                  <li><span className="text-[var(--accent-green)]">Risk-Off</span> — Stable borrow rate &lt;3.5% <em>and</em> utilization &lt;55%. Low borrowing demand, defensive market posture.</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-1 font-medium text-zinc-100">Key Metrics</h3>
                <ul className="list-disc space-y-1 pl-5 text-zinc-400">
                  <li><span className="text-zinc-300">TVL-Weighted Stable Borrow Rate</span> — The average borrow rate for stablecoins weighted by each pool&apos;s TVL. Analogous to the effective federal funds rate in TradFi.</li>
                  <li><span className="text-zinc-300">Utilization Rate</span> — The ratio of borrowed assets to total supplied, weighted by TVL. Similar to the loan-to-deposit ratio in banking.</li>
                  <li><span className="text-zinc-300">Yield Spread</span> — The difference between borrow APY and supply APY per pool. Equivalent to the net interest margin in traditional lending.</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-1 font-medium text-zinc-100">Refresh Rates</h3>
                <p className="text-zinc-400">
                  Live lending data refreshes every 60 seconds. Historical Dune data refreshes hourly. Delta indicators (▲/▼) show changes since the previous data fetch.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Sticky Top Bar ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-primary)]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-12 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-base font-semibold tracking-tight text-zinc-50">
            DeFi Credit Market Monitor
          </h1>
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <button
              onClick={() => setShowMethodology(true)}
              className="hidden text-zinc-500 transition-colors hover:text-zinc-200 sm:inline"
            >
              Methodology
            </button>
            <span className="hidden h-3 w-px bg-[var(--border)] sm:inline" />
            <span className="hidden font-mono tabular-nums text-zinc-500 sm:inline">
              Updated{" "}
              {new Date(fetchedAt).toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-green)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-green)]" />
              </span>
              Live
            </span>
          </div>
        </div>
        {/* gradient accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--accent-blue)] to-transparent" />
      </header>

      {/* ── Page Content ───────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-[1440px] animate-fade-in space-y-6 px-4 py-5 sm:px-6 lg:px-8">
        {/* Signal Banner — compact strip */}
        <SignalBanner
          marketSignal={signals.marketSignal}
          weightedStableBorrowRate={signals.weightedStableBorrowRate}
          weightedUtilization={signals.weightedUtilization}
          poolCount={pools.length}
        />

        {/* Metric Cards */}
        <MetricCards
          totalTvl={signals.totalTvl}
          weightedStableBorrowRate={signals.weightedStableBorrowRate}
          weightedUtilization={signals.weightedUtilization}
          poolCount={pools.length}
          signalDeltas={signalDeltas}
        />

        {/* ── Main Content: 2-column (table left, charts right) ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LendingTable pools={pools} poolDeltas={poolDeltas} />
          </div>
          <div className="flex flex-col gap-6 [&>div]:min-h-[240px]">
            <TvlChart pools={pools} />
            <UtilizationChart pools={pools} />
          </div>
        </div>

        {/* ── Analytical Views ──────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <YieldCurveChart pools={pools} />
          </div>
          <SignalBreakdown
            weightedStableBorrowRate={signals.weightedStableBorrowRate}
            weightedUtilization={signals.weightedUtilization}
          />
        </div>

        {/* ── Historical Section ──────────────────────────────── */}
        <div className="border-t border-[var(--border)] pt-6">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Historical Trends — 90 Days
            </h2>
          </div>

          {duneLoading ? (
            <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[320px] animate-pulse rounded-lg bg-[var(--bg-card)]"
                />
              ))}
            </div>
          ) : !duneData ? (
            <div className="mt-4 flex items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-5 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent-amber)]/10">
                <svg className="h-5 w-5 text-[var(--accent-amber)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-300">Historical data unavailable</p>
                <p className="text-xs text-zinc-500">Dune Analytics API error — historical trends cannot be displayed</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="shrink-0 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-[var(--border)] hover:text-zinc-100"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3 [&>div]:min-h-[320px]">
              <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-5">
                <h3 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                  Daily liquidations
                </h3>
                <p className="mb-4 text-xs text-zinc-600">
                  Stress indicator — spikes = margin cascade events
                </p>
                <LiquidationChart data={duneData.liquidations} />
              </div>

              <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-5">
                <h3 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                  USDC borrow volume
                </h3>
                <p className="mb-4 text-xs text-zinc-600">
                  Credit demand — rising volume = leverage expansion
                </p>
                <BorrowVolumeChart data={duneData.borrowVolume} />
              </div>

              <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-5">
                <h3 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                  Stablecoin net flows
                </h3>
                <p className="mb-4 text-xs text-zinc-600">
                  Capital positioning — negative = risk-off rotation out of Aave
                </p>
                <StableFlowChart data={duneData.stableFlows} />
              </div>
            </div>
          )}
        </div>

        {/* Footer with data source credits */}
        <footer className="border-t border-[var(--border)] pb-6 pt-5">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-zinc-500">
              <span>Data sources:</span>
              <a
                href="https://defillama.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 transition-colors hover:text-[var(--accent-blue)]"
              >
                DeFi Llama
              </a>
              <a
                href="https://dune.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 transition-colors hover:text-[var(--accent-blue)]"
              >
                Dune Analytics
              </a>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-600">
              <button
                onClick={() => setShowMethodology(true)}
                className="text-zinc-500 transition-colors hover:text-zinc-300"
              >
                Methodology
              </button>
              <span className="h-3 w-px bg-[var(--border)]" />
              <span className="font-mono tabular-nums">
                {new Date(fetchedAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "medium",
                })}
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
