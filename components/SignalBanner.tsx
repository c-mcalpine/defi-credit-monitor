import type { MarketSignal } from "@/lib/signals";

interface SignalBannerProps {
  marketSignal: MarketSignal;
  weightedStableBorrowRate: number;
  weightedUtilization: number;
  poolCount: number;
}

const CONFIG: Record<
  MarketSignal,
  {
    label: string;
    description: string;
    borderColor: string;
    dotColor: string;
    labelColor: string;
  }
> = {
  "risk-on": {
    label: "Risk-On",
    description:
      "Elevated borrowing demand — leverage expanding, capital deployed aggressively",
    borderColor: "border-l-[var(--accent-red)]",
    dotColor: "bg-[var(--accent-red)]",
    labelColor: "text-[var(--accent-red)]",
  },
  neutral: {
    label: "Neutral",
    description:
      "Rates and utilization within normal ranges — no strong directional signal",
    borderColor: "border-l-[var(--accent-amber)]",
    dotColor: "bg-[var(--accent-amber)]",
    labelColor: "text-[var(--accent-amber)]",
  },
  "risk-off": {
    label: "Risk-Off",
    description:
      "Low borrowing demand, idle capital — market in defensive posture",
    borderColor: "border-l-[var(--accent-green)]",
    dotColor: "bg-[var(--accent-green)]",
    labelColor: "text-[var(--accent-green)]",
  },
};

export default function SignalBanner({
  marketSignal,
  weightedStableBorrowRate,
  weightedUtilization,
  poolCount,
}: SignalBannerProps) {
  const c = CONFIG[marketSignal];

  return (
    <div
      className={`flex items-center justify-between rounded-md border border-[var(--border)] ${c.borderColor} border-l-4 bg-[var(--bg-card)] px-4 py-2.5`}
    >
      {/* Left: dot + signal label + description */}
      <div className="flex items-center gap-3 min-w-0">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${c.dotColor}${marketSignal === "risk-on" ? " animate-risk-pulse" : ""}`} />
        <span className={`text-sm font-semibold ${c.labelColor}`}>
          {c.label}
        </span>
        <span className="hidden text-xs text-zinc-400 sm:inline">
          {c.description}
        </span>
        <span className="text-xs text-zinc-600 font-mono tabular-nums">
          {poolCount} pools
        </span>
      </div>

      {/* Right: two key metrics inline */}
      <div className="flex shrink-0 items-center gap-5">
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-wide text-zinc-500">
            Stable Borrow
          </p>
          <p className="text-sm font-semibold font-mono tabular-nums text-zinc-100">
            {weightedStableBorrowRate.toFixed(2)}%
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-wide text-zinc-500">
            Utilization
          </p>
          <p className="text-sm font-semibold font-mono tabular-nums text-zinc-100">
            {weightedUtilization.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
