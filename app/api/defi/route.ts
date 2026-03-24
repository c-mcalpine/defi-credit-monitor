import { NextResponse } from "next/server";
import { fetchLendingPools } from "@/lib/defillama";
import type { LendingPool } from "@/lib/defillama";
import { computeSignals } from "@/lib/signals";
import type { MarketSignals } from "@/lib/signals";

export const revalidate = 60;

// In-memory cache of previous fetch for computing deltas
let previousPools: LendingPool[] | null = null;
let previousSignals: MarketSignals | null = null;

export interface PoolDelta {
  poolId: string;
  borrowApyDelta: number;
  supplyApyDelta: number;
}

export interface SignalDeltas {
  stableBorrowRateDelta: number;
  utilizationDelta: number;
  tvlDelta: number;
}

export async function GET() {
  const pools = await fetchLendingPools();
  const signals = computeSignals(pools);

  // Compute deltas against previous fetch
  let poolDeltas: PoolDelta[] = [];
  let signalDeltas: SignalDeltas | null = null;

  if (previousPools && previousSignals) {
    const prevMap = new Map<string, LendingPool>();
    for (const p of previousPools) prevMap.set(p.id, p);

    poolDeltas = pools
      .filter((p) => prevMap.has(p.id))
      .map((p) => {
        const prev = prevMap.get(p.id)!;
        return {
          poolId: p.id,
          borrowApyDelta: p.apyBaseBorrow - prev.apyBaseBorrow,
          supplyApyDelta: p.apy - prev.apy,
        };
      });

    signalDeltas = {
      stableBorrowRateDelta:
        signals.weightedStableBorrowRate -
        previousSignals.weightedStableBorrowRate,
      utilizationDelta:
        signals.weightedUtilization - previousSignals.weightedUtilization,
      tvlDelta: signals.totalTvl - previousSignals.totalTvl,
    };
  }

  // Store current as previous for next request
  previousPools = pools;
  previousSignals = signals;

  return NextResponse.json({
    pools,
    signals,
    poolDeltas,
    signalDeltas,
    fetchedAt: new Date().toISOString(),
  });
}
