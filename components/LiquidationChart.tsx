"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { LiquidationRow } from "@/lib/dune";

interface LiquidationChartProps {
  data: LiquidationRow[];
}

function formatDay(day: any): string {
  const d = new Date(String(day));
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

export default function LiquidationChart({ data }: LiquidationChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
        <XAxis
          dataKey="day"
          tickFormatter={formatDay}
          tick={{ fill: "#71717a", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
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
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="liquidation_count"
          name="Liquidations"
          stroke="#E24B4A"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="unique_users_liquidated"
          name="Unique Users"
          stroke="#EF9F27"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
