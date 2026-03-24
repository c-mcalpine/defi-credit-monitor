"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { LendingPool } from "@/lib/defillama";
import {
  COLORS,
  TOOLTIP_STYLE,
  AXIS_TICK_STYLE,
  AXIS_LABEL_STYLE,
  CARTESIAN_GRID_STYLE,
  BAR_CURSOR,
  formatPercent,
} from "@/lib/constants";

interface YieldCurveChartProps {
  pools: LendingPool[];
}

const PROTOCOL_COLORS: Record<string, string> = {
  "aave-v3": "#B6509E",
  "aave-v2": "#9C3E88",
  "compound-v3": "#00D395",
  morpho: "#2470FF",
  spark: "#F5AC37",
};

function protocolColor(project: string): string {
  return PROTOCOL_COLORS[project] ?? COLORS.accentBlue;
}

interface ChartRow {
  label: string;
  rate: number;
  project: string;
  chain: string;
}

export default function YieldCurveChart({ pools }: YieldCurveChartProps) {
  const assets = useMemo(() => {
    const set = new Set<string>();
    for (const p of pools) set.add(p.symbol);
    return [...set].sort();
  }, [pools]);

  const [selectedAsset, setSelectedAsset] = useState<string>(() =>
    assets.includes("USDC") ? "USDC" : assets[0] ?? "",
  );

  const data: ChartRow[] = useMemo(() => {
    return pools
      .filter((p) => p.symbol === selectedAsset)
      .map((p) => ({
        label: `${p.project} (${p.chain})`,
        rate: p.apyBaseBorrow,
        project: p.project,
        chain: p.chain,
      }))
      .sort((a, b) => a.rate - b.rate);
  }, [pools, selectedAsset]);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Borrow Rate Comparison
          </h3>
          <p className="text-xs text-zinc-600">
            Where credit is cheapest — same asset across protocols
          </p>
        </div>
        <select
          value={selectedAsset}
          onChange={(e) => setSelectedAsset(e.target.value)}
          className="rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1 text-xs text-zinc-300 outline-none font-mono"
        >
          {assets.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {data.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-600">
          No pools found for {selectedAsset}
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={data.length * 44 + 30}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 50, bottom: 0, left: 0 }}
          >
            <CartesianGrid
              {...CARTESIAN_GRID_STYLE}
              horizontal={false}
              vertical={true}
            />
            <XAxis
              type="number"
              tickFormatter={(v: number) => formatPercent(v)}
              tick={AXIS_TICK_STYLE}
              axisLine={false}
              tickLine={false}
              domain={[0, "auto"]}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={160}
              tick={AXIS_LABEL_STYLE}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              {...TOOLTIP_STYLE}
              cursor={BAR_CURSOR}
              formatter={(value: string | number | readonly (string | number)[] | undefined) => [
                typeof value === "number" ? formatPercent(value) : String(value ?? ""),
                "Borrow APY",
              ]}
            />
            <Bar dataKey="rate" radius={[0, 4, 4, 0]} barSize={22}>
              {data.map((entry, idx) => (
                <Cell key={idx} fill={protocolColor(entry.project)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
