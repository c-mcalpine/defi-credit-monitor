export interface LendingPool {
  id: string;
  project: string;
  symbol: string;
  chain: string;
  tvlUsd: number;
  apy: number;
  apyBaseBorrow: number;
  utilRate: number;
}

interface PoolsEntry {
  pool: string;
  project: string;
  symbol: string;
  chain: string;
  tvlUsd: number;
  apy: number;
}

interface LendBorrowEntry {
  pool: string;
  apyBaseBorrow: number | null;
  totalSupplyUsd: number;
  totalBorrowUsd: number;
}

const ALLOWED_PROJECTS = new Set([
  "aave-v3",
  "aave-v2",
  "compound-v3",
  "morpho",
  "spark",
]);

const ALLOWED_SYMBOLS = ["USDC", "USDT", "DAI", "WETH", "WBTC"];

function matchesSymbol(symbol: string): boolean {
  return ALLOWED_SYMBOLS.some((s) => symbol.includes(s));
}

export async function fetchLendingPools(): Promise<LendingPool[]> {
  const [poolsRes, borrowRes] = await Promise.all([
    fetch("https://yields.llama.fi/pools"),
    fetch("https://yields.llama.fi/lendBorrow"),
  ]);

  if (!poolsRes.ok) throw new Error(`Pools API error: ${poolsRes.status}`);
  if (!borrowRes.ok) throw new Error(`LendBorrow API error: ${borrowRes.status}`);

  const poolsJson = (await poolsRes.json()) as { data: PoolsEntry[] };
  const borrowData = (await borrowRes.json()) as LendBorrowEntry[];

  const borrowMap = new Map<string, LendBorrowEntry>();
  for (const entry of borrowData) {
    borrowMap.set(entry.pool, entry);
  }

  return poolsJson.data
    .filter((pool) => {
      if (!ALLOWED_PROJECTS.has(pool.project)) return false;
      if (!matchesSymbol(pool.symbol)) return false;
      if (pool.symbol.includes("-")) return false;
      if (pool.tvlUsd <= 1_500_000) return false;

      const borrow = borrowMap.get(pool.pool);
      if (!borrow?.apyBaseBorrow || borrow.apyBaseBorrow <= 0) return false;

      return true;
    })
    .map((pool) => {
      const borrow = borrowMap.get(pool.pool)!;
      const utilRate =
        borrow.totalSupplyUsd > 0
          ? (borrow.totalBorrowUsd / borrow.totalSupplyUsd) * 100
          : 0;

      return {
        id: pool.pool,
        project: pool.project,
        symbol: pool.symbol,
        chain: pool.chain,
        tvlUsd: pool.tvlUsd,
        apy: pool.apy,
        apyBaseBorrow: borrow.apyBaseBorrow!,
        utilRate,
      };
    });
}
