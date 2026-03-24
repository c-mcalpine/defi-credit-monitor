import { NextResponse } from "next/server";
import {
  fetchLiquidations,
  fetchBorrowVolume,
  fetchStableFlows,
  LiquidationRow,
  BorrowVolumeRow,
  StableFlowRow,
} from "@/lib/dune";

export async function GET() {
  const [liquidations, borrowVolume, stableFlows] = await Promise.all([
    fetchLiquidations().catch((err) => {
      console.error("Failed to fetch liquidations:", err);
      return [] as LiquidationRow[];
    }),
    fetchBorrowVolume().catch((err) => {
      console.error("Failed to fetch borrow volume:", err);
      return [] as BorrowVolumeRow[];
    }),
    fetchStableFlows().catch((err) => {
      console.error("Failed to fetch stable flows:", err);
      return [] as StableFlowRow[];
    }),
  ]);

  return NextResponse.json(
    {
      liquidations,
      borrowVolume,
      stableFlows,
      fetchedAt: new Date().toISOString(),
    },
    {
      headers: { "Cache-Control": "s-maxage=3600" },
    },
  );
}
