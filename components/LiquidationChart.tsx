"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import type { LiquidationRow } from "@/lib/dune";
import { formatDay, COLORS, TOOLTIP_STYLE, AXIS_TICK_STYLE, CARTESIAN_GRID_STYLE } from "@/lib/constants";

interface LiquidationChartProps {
  data: LiquidationRow[];
}

export default function LiquidationChart({ data }: LiquidationChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid {...CARTESIAN_GRID_STYLE} />
        <XAxis
          dataKey="day"
          tickFormatter={formatDay}
          tick={AXIS_TICK_STYLE}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={AXIS_TICK_STYLE}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          {...TOOLTIP_STYLE}
          labelFormatter={formatDay}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="liquidation_count"
          name="Liquidations"
          stroke={COLORS.chartLiquidations}
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="unique_users_liquidated"
          name="Unique Users"
          stroke={COLORS.chartUniqueUsers}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
