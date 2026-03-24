import type { LendingPool } from "./defillama";

export type MarketSignal = "risk-on" | "neutral" | "risk-off";

export interface MarketSignals {
  weightedStableBorrowRate: number;
  weightedUtilization: number;
  totalTvl: number;
  marketSignal: MarketSignal;
}

const STABLECOINS = new Set(["USDC", "USDT", "DAI"]);

function isStablecoin(symbol: string): boolean {
  return STABLECOINS.has(symbol);
}

export function computeSignals(pools: LendingPool[]): MarketSignals {
  let stableTvl = 0;
  let stableBorrowSum = 0;
  let totalTvl = 0;
  let utilTvlSum = 0;

  for (const pool of pools) {
    totalTvl += pool.tvlUsd;
    utilTvlSum += pool.utilRate * pool.tvlUsd;

    if (isStablecoin(pool.symbol)) {
      stableTvl += pool.tvlUsd;
      stableBorrowSum += pool.apyBaseBorrow * pool.tvlUsd;
    }
  }

  const weightedStableBorrowRate = stableTvl > 0 ? stableBorrowSum / stableTvl : 0;
  const weightedUtilization = totalTvl > 0 ? utilTvlSum / totalTvl : 0;

  let marketSignal: MarketSignal;
  if (weightedStableBorrowRate > 7 || weightedUtilization > 82) {
    marketSignal = "risk-on";
  } else if (weightedStableBorrowRate < 3.5 && weightedUtilization < 55) {
    marketSignal = "risk-off";
  } else {
    marketSignal = "neutral";
  }

  return {
    weightedStableBorrowRate,
    weightedUtilization,
    totalTvl,
    marketSignal,
  };
}
