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
  Cell,
} from "recharts";
import type { LendingPool } from "@/lib/defillama";
import { COLORS, TOOLTIP_STYLE, AXIS_TICK_STYLE, AXIS_LABEL_STYLE, CARTESIAN_GRID_STYLE, BAR_CURSOR } from "@/lib/constants";

interface UtilizationChartProps {
  pools: LendingPool[];
}

interface ChartRow {
  id: string;
  name: string;
  utilRate: number;
  fill: string;
}

function barColor(rate: number): string {
  if (rate > 85) return COLORS.utilHigh;
  if (rate >= 70) return COLORS.utilMedium;
  return COLORS.utilLow;
}

export default function UtilizationChart({ pools }: UtilizationChartProps) {
  const data: ChartRow[] = useMemo(() => {
    return [...pools]
      .sort((a, b) => b.utilRate - a.utilRate)
      .slice(0, 10)
      .map((p) => ({
        id: p.id,
        name: `${p.project} · ${p.symbol} (${p.chain})`,
        utilRate: Math.round(p.utilRate * 10) / 10,
        fill: barColor(p.utilRate),
      }));
  }, [pools]);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-5">
      <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-zinc-500">
        Top 10 Pools by Utilization
      </h3>
      <ResponsiveContainer width="100%" height={data.length * 40 + 20}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
        >
          <CartesianGrid {...CARTESIAN_GRID_STYLE} horizontal={true} vertical={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(v: number) => `${v}%`}
            tick={AXIS_TICK_STYLE}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={180}
            tick={AXIS_LABEL_STYLE}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            {...TOOLTIP_STYLE}
            cursor={BAR_CURSOR}
            formatter={(value: string | number | readonly (string | number)[] | undefined) => [`${value ?? ""}%`, "Utilization"]}
          />
          <Bar dataKey="utilRate" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry) => (
              <Cell key={entry.id} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
