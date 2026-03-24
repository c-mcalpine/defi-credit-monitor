// ── Color Palette ──────────────────────────────────────────────────
export const COLORS = {
  // Backgrounds
  bgPrimary: "#0B0E11",
  bgCard: "#12161C",
  bgElevated: "#1A1F28",
  border: "#1E2530",

  // Accents
  accentBlue: "#3B82F6",
  accentGreen: "#00D4AA",
  accentRed: "#EF4444",
  accentAmber: "#F59E0B",

  // Chart-specific
  chartLiquidations: "#EF4444",
  chartUniqueUsers: "#F59E0B",
  chartBorrowVolume: "#3B82F6",
  chartTvlBar: "#6366f1",
  chartFlowPositive: "#00D4AA",
  chartFlowNegative: "#EF4444",

  // Axis / labels
  axisTick: "#71717a",
  axisLabel: "#a1a1aa",

  // Tooltip
  tooltipBg: "#12161C",
  tooltipBorder: "#1E2530",
  tooltipText: "#e4e4e7",

  // Utilization bar thresholds
  utilHigh: "#EF4444",
  utilMedium: "#F59E0B",
  utilLow: "#3B82F6",
} as const;

// ── Shared Formatters ──────────────────────────────────────────────
export function formatTvl(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

export function formatUsd(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

export function formatDay(day: unknown): string {
  const d = new Date(String(day));
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

export function formatPercent(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

// ── Chart Config ───────────────────────────────────────────────────
export const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: COLORS.tooltipBg,
    border: `1px solid ${COLORS.tooltipBorder}`,
    borderRadius: 8,
    fontSize: 13,
    fontFamily: "var(--font-mono)",
  },
  labelStyle: { color: COLORS.tooltipText },
} as const;

export const AXIS_TICK_STYLE = {
  fill: COLORS.axisTick,
  fontSize: 12,
} as const;

export const AXIS_LABEL_STYLE = {
  fill: COLORS.axisLabel,
  fontSize: 12,
} as const;

export const CARTESIAN_GRID_STYLE = {
  stroke: COLORS.border,
  strokeDasharray: "3 3",
} as const;

export const BAR_CURSOR = {
  fill: "rgba(255,255,255,0.03)",
} as const;

// ── Shared Constants ───────────────────────────────────────────────
export const STABLECOINS = new Set(["USDC", "USDT", "DAI"]);
