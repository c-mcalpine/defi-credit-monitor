"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { BorrowVolumeRow } from "@/lib/dune";

interface BorrowVolumeChartProps {
  data: BorrowVolumeRow[];
}

function formatDay(day: any): string {
  const d = new Date(String(day));
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

function formatUsd(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

export default function BorrowVolumeChart({ data }: BorrowVolumeChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
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
          formatter={(value: number, name: string) => {
            if (name === "usdc_borrowed") return [formatUsd(value), "USDC Borrowed"];
            return [value.toLocaleString(), "Borrow Count"];
          }}
        />
        <Bar
          dataKey="usdc_borrowed"
          fill="#378ADD"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
