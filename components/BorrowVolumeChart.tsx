"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import type { BorrowVolumeRow } from "@/lib/dune";
import { formatDay, formatUsd, COLORS, TOOLTIP_STYLE, AXIS_TICK_STYLE, CARTESIAN_GRID_STYLE, BAR_CURSOR } from "@/lib/constants";

interface BorrowVolumeChartProps {
  data: BorrowVolumeRow[];
}

export default function BorrowVolumeChart({ data }: BorrowVolumeChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
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
          formatter={(value: any, name: any) => {
            const v = Number(value);
            if (name === "usdc_borrowed") return [formatUsd(v), "USDC Borrowed"];
            return [v.toLocaleString(), "Borrow Count"];
          }}
        />
        <Bar
          dataKey="usdc_borrowed"
          fill={COLORS.chartBorrowVolume}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
