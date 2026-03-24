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
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import type { StableFlowRow } from "@/lib/dune";
import { formatDay, formatUsd, COLORS, TOOLTIP_STYLE, AXIS_TICK_STYLE, CARTESIAN_GRID_STYLE, BAR_CURSOR } from "@/lib/constants";

interface StableFlowChartProps {
  data: StableFlowRow[];
}

interface AggregatedRow {
  day: string;
  net_flow: number;
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
        <CartesianGrid {...CARTESIAN_GRID_STYLE} />
        <XAxis
          dataKey="day"
          tickFormatter={formatDay}
          tick={AXIS_TICK_STYLE}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatUsd}
          tick={AXIS_TICK_STYLE}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          {...TOOLTIP_STYLE}
          cursor={BAR_CURSOR}
          labelFormatter={formatDay}
          formatter={(value: any) => [formatUsd(Number(value)), "Net Flow"]}
        />
        <ReferenceLine y={0} stroke={COLORS.border} />
        <Bar dataKey="net_flow" radius={[4, 4, 0, 0]}>
          {aggregated.map((row, i) => (
            <Cell
              key={i}
              fill={row.net_flow >= 0 ? COLORS.chartFlowPositive : COLORS.chartFlowNegative}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
