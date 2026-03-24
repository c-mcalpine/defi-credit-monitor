"use client";

import { COLORS } from "@/lib/constants";

interface SignalBreakdownProps {
  weightedStableBorrowRate: number;
  weightedUtilization: number;
}

interface ThresholdGaugeProps {
  label: string;
  value: number;
  unit: string;
  zones: { max: number; color: string; label: string }[];
  thresholds: { value: number; label: string }[];
  max: number;
}

function ThresholdGauge({
  label,
  value,
  unit,
  zones,
  thresholds,
  max,
}: ThresholdGaugeProps) {
  const pct = Math.min((value / max) * 100, 100);

  // Determine which zone the value is in
  let activeColor: string = COLORS.accentGreen;
  let activeLabel = "";
  for (const zone of zones) {
    if (value <= zone.max) {
      activeColor = zone.color;
      activeLabel = zone.label;
      break;
    }
    activeColor = zone.color;
    activeLabel = zone.label;
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400">{label}</span>
        <span className="flex items-center gap-2">
          <span
            className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase"
            style={{ backgroundColor: activeColor + "20", color: activeColor }}
          >
            {activeLabel}
          </span>
          <span className="text-sm font-semibold font-mono tabular-nums text-zinc-100">
            {value.toFixed(2)}{unit}
          </span>
        </span>
      </div>

      {/* Track */}
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: activeColor,
          }}
        />
        {/* Threshold markers */}
        {thresholds.map((t) => (
          <div
            key={t.value}
            className="absolute top-0 h-full w-px bg-zinc-500"
            style={{ left: `${(t.value / max) * 100}%` }}
          />
        ))}
      </div>

      {/* Threshold labels */}
      <div className="relative mt-1 h-3">
        {thresholds.map((t) => (
          <span
            key={t.value}
            className="absolute -translate-x-1/2 text-[9px] text-zinc-600 font-mono"
            style={{ left: `${(t.value / max) * 100}%` }}
          >
            {t.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SignalBreakdown({
  weightedStableBorrowRate,
  weightedUtilization,
}: SignalBreakdownProps) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-5">
      <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-zinc-500">
        Signal Breakdown
      </h3>
      <p className="mb-4 text-xs text-zinc-600">
        Individual factors driving the market regime signal
      </p>

      <div className="space-y-5">
        <ThresholdGauge
          label="Stable Borrow Rate"
          value={weightedStableBorrowRate}
          unit="%"
          max={15}
          zones={[
            { max: 3.5, color: COLORS.accentGreen, label: "Low" },
            { max: 7, color: COLORS.accentAmber, label: "Normal" },
            { max: 15, color: COLORS.accentRed, label: "Elevated" },
          ]}
          thresholds={[
            { value: 3.5, label: "3.5%" },
            { value: 7, label: "7%" },
          ]}
        />

        <ThresholdGauge
          label="Utilization Rate"
          value={weightedUtilization}
          unit="%"
          max={100}
          zones={[
            { max: 55, color: COLORS.accentGreen, label: "Low" },
            { max: 82, color: COLORS.accentAmber, label: "Normal" },
            { max: 100, color: COLORS.accentRed, label: "Elevated" },
          ]}
          thresholds={[
            { value: 55, label: "55%" },
            { value: 82, label: "82%" },
          ]}
        />
      </div>

      <div className="mt-4 rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-[11px] text-zinc-500 leading-relaxed">
        <span className="font-medium text-zinc-400">Logic: </span>
        Stable borrow rate &gt;7% <em>or</em> utilization &gt;82% → Risk-On.
        Both below 3.5% and 55% → Risk-Off. Otherwise → Neutral.
      </div>
    </div>
  );
}
