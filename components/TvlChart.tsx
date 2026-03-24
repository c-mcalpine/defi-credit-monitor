"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { LendingPool } from "@/lib/defillama";

interface TvlChartProps {
  pools: LendingPool[];
}

interface ChartRow {
  project: string;
  tvl: number;
}

function formatTvl(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(0)}M`;
  return `$${(value / 1_000).toFixed(0)}K`;
}

const BAR_COLOR = "#6366f1";

export default function TvlChart({ pools }: TvlChartProps) {
  const data: ChartRow[] = useMemo(() => {
    const byProject = new Map<string, number>();
    for (const p of pools) {
      byProject.set(p.project, (byProject.get(p.project) ?? 0) + p.tvlUsd);
    }
    return [...byProject.entries()]
      .map(([project, tvl]) => ({ project, tvl }))
      .sort((a, b) => b.tvl - a.tvl)
      .slice(0, 7);
  }, [pools]);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-5">
      <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-zinc-500">
        TVL by Protocol
      </h3>
      <ResponsiveContainer width="100%" height={data.length * 48 + 20}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
        >
          <XAxis
            type="number"
            tickFormatter={formatTvl}
            tick={{ fill: "#71717a", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="project"
            width={120}
            tick={{ fill: "#a1a1aa", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: 8,
              fontSize: 13,
            }}
            labelStyle={{ color: "#e4e4e7" }}
            formatter={(value: string | number | readonly (string | number)[] | undefined) => [typeof value === "number" ? formatTvl(value) : String(value ?? ""), "TVL"]}
          />
          <Bar
            dataKey="tvl"
            fill={BAR_COLOR}
            radius={[0, 4, 4, 0]}
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
