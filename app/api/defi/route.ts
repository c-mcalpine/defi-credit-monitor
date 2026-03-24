import { NextResponse } from "next/server";
import { fetchLendingPools } from "@/lib/defillama";
import { computeSignals } from "@/lib/signals";

export const revalidate = 60;

export async function GET() {
  const pools = await fetchLendingPools();
  const signals = computeSignals(pools);

  return NextResponse.json({
    pools,
    signals,
    fetchedAt: new Date().toISOString(),
  });
}
