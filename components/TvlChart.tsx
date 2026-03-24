"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import type { LendingPool } from "@/lib/defillama";
import { formatTvl, COLORS, TOOLTIP_STYLE, AXIS_TICK_STYLE, AXIS_LABEL_STYLE, CARTESIAN_GRID_STYLE, BAR_CURSOR } from "@/lib/constants";

interface TvlChartProps {
  pools: LendingPool[];
}

interface ChartRow {
  project: string;
  tvl: number;
}

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
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-5">
      <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-zinc-500">
        TVL by Protocol
      </h3>
      <ResponsiveContainer width="100%" height={data.length * 48 + 20}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
        >
          <CartesianGrid {...CARTESIAN_GRID_STYLE} horizontal={true} vertical={false} />
          <XAxis
            type="number"
            tickFormatter={formatTvl}
            tick={AXIS_TICK_STYLE}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="project"
            width={120}
            tick={AXIS_LABEL_STYLE}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            {...TOOLTIP_STYLE}
            cursor={BAR_CURSOR}
            formatter={(value: string | number | readonly (string | number)[] | undefined) => [typeof value === "number" ? formatTvl(value) : String(value ?? ""), "TVL"]}
          />
          <Bar
            dataKey="tvl"
            fill={COLORS.chartTvlBar}
            radius={[0, 4, 4, 0]}
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
