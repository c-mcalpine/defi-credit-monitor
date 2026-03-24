"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import type { StableFlowRow } from "@/lib/dune";

interface StableFlowChartProps {
  data: StableFlowRow[];
}

interface AggregatedRow {
  day: string;
  net_flow: number;
}

function formatDay(day: any): string {
  const d = new Date(String(day));
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

function formatUsd(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

export default function StableFlowChart({ data }: StableFlowChartProps) {
  const aggregated: AggregatedRow[] = useMemo(() => {
    const byDay = new Map<string, number>();
    for (const row of data) {
      byDay.set(row.day, (byDay.get(row.day) ?? 0) + row.net_flow);
    }
    return [...byDay.entries()]
      .map(([day, net_flow]) => ({ day, net_flow }))
      .sort((a, b) => a.day.localeCompare(b.day));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={aggregated} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
        <XAxis
          dataKey="day"
          tickFormatter={formatDay}
          tick={{ fill: "#71717a", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatUsd}
          tick={{ fill: "#71717a", fontSize: 12 }}
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
          labelFormatter={formatDay}
          formatter={(value: number) => [formatUsd(value), "Net Flow"]}
        />
        <ReferenceLine y={0} stroke="#3f3f46" />
        <Bar dataKey="net_flow" radius={[4, 4, 0, 0]}>
          {aggregated.map((row, i) => (
            <Cell
              key={i}
              fill={row.net_flow >= 0 ? "#3B6D11" : "#E24B4A"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
