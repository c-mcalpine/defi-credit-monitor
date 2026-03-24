"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { LendingPool } from "@/lib/defillama";

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
  if (rate > 85) return "#ef4444";
  if (rate >= 70) return "#f59e0b";
  return "#3b82f6";
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
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-5">
      <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-zinc-500">
        Top 10 Pools by Utilization
      </h3>
      <ResponsiveContainer width="100%" height={data.length * 40 + 20}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
        >
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(v: number) => `${v}%`}
            tick={{ fill: "#71717a", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={180}
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
