"use client";

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

interface DefiResponse {
  pools: LendingPool[];
  signals: MarketSignals;
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
    <div className="mx-auto w-full max-w-7xl animate-pulse space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-8 w-72 rounded bg-zinc-800" />
      <div className="h-4 w-96 rounded bg-zinc-800/60" />
      <div className="h-24 rounded-lg bg-zinc-800/40" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-lg bg-zinc-800/40" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-96 rounded-lg bg-zinc-800/40 lg:col-span-2" />
        <div className="h-96 rounded-lg bg-zinc-800/40" />
      </div>
      <div className="h-80 rounded-lg bg-zinc-800/40" />
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

  if (isLoading || !data) return <Skeleton />;

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-red-400">
        Failed to load data. Please try again.
      </div>
    );
  }

  const { pools, signals, fetchedAt } = data;

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-50">
              DeFi Credit Market Monitor
            </h1>
            <p className="text-sm text-zinc-500">
              Real-time lending conditions across major DeFi protocols
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            Live Data
          </div>
        </header>

        {/* Signal Banner */}
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
        />

        {/* Table + TVL Chart */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LendingTable pools={pools} />
          </div>
          <div>
            <TvlChart pools={pools} />
          </div>
        </div>

        {/* Utilization Chart */}
        <UtilizationChart pools={pools} />

        {/* Historical Dune Section */}
        <div className="border-t border-zinc-800 pt-6">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-50">
            Historical trends — last 90 days
          </h2>

          {duneLoading ? (
            <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[320px] animate-pulse rounded-lg bg-zinc-800/40"
                />
              ))}
            </div>
          ) : !duneData ? (
            <p className="mt-4 text-sm text-zinc-500">
              Historical data unavailable
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-5">
                <h3 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                  Daily liquidations
                </h3>
                <p className="mb-4 text-xs text-zinc-600">
                  Stress indicator — spikes = margin cascade events
                </p>
                <LiquidationChart data={duneData.liquidations} />
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-5">
                <h3 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                  USDC borrow volume
                </h3>
                <p className="mb-4 text-xs text-zinc-600">
                  Credit demand — rising volume = leverage expansion
                </p>
                <BorrowVolumeChart data={duneData.borrowVolume} />
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-5">
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

        {/* Footer */}
        <footer className="border-t border-zinc-800 pt-4 text-center text-xs text-zinc-600">
          Last updated{" "}
          {new Date(fetchedAt).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "medium",
          })}
        </footer>
      </div>
    </div>
  );
}
