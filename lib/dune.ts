export interface LiquidationRow {
  day: string;
  liquidation_count: number;
  unique_users_liquidated: number;
  unique_liquidators: number;
}

export interface BorrowVolumeRow {
  day: string;
  borrow_count: number;
  usdc_borrowed: number;
  avg_borrow_size: number;
}

export interface StableFlowRow {
  day: string;
  asset: string;
  inflow: number;
  outflow: number;
  net_flow: number;
}

export async function fetchDuneQuery<T>(queryId: string): Promise<T[]> {
  const apiKey = process.env.DUNE_API_KEY;
  if (!apiKey) {
    throw new Error("DUNE_API_KEY environment variable is not set");
  }

  const res = await fetch(
    `https://api.dune.com/api/v1/query/${queryId}/results`,
    { headers: { "X-Dune-API-Key": apiKey } },
  );

  if (!res.ok) {
    throw new Error(`Dune API request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.result.rows as T[];
}

export function fetchLiquidations(): Promise<LiquidationRow[]> {
  const queryId = process.env.DUNE_LIQUIDATIONS_ID;
  if (!queryId) throw new Error("DUNE_LIQUIDATIONS_ID is not set");
  return fetchDuneQuery<LiquidationRow>(queryId);
}

export function fetchBorrowVolume(): Promise<BorrowVolumeRow[]> {
  const queryId = process.env.DUNE_BORROW_VOLUME_ID;
  if (!queryId) throw new Error("DUNE_BORROW_VOLUME_ID is not set");
  return fetchDuneQuery<BorrowVolumeRow>(queryId);
}

export function fetchStableFlows(): Promise<StableFlowRow[]> {
  const queryId = process.env.DUNE_STABLE_FLOWS_ID;
  if (!queryId) throw new Error("DUNE_STABLE_FLOWS_ID is not set");
  return fetchDuneQuery<StableFlowRow>(queryId);
}
