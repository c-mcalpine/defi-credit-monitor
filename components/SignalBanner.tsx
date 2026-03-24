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
    tradFiAnalog: string;
    bg: string;
    border: string;
    text: string;
    badge: string;
  }
> = {
  "risk-on": {
    label: "Risk-On",
    description:
      "Borrowing demand is elevated — leverage is expanding and capital is being deployed aggressively.",
    tradFiAnalog:
      "Similar to tightening credit spreads and rising margin debt in traditional markets.",
    bg: "bg-red-950/40",
    border: "border-red-500/50",
    text: "text-red-100",
    badge: "bg-red-500/20 text-red-400 ring-red-500/30",
  },
  neutral: {
    label: "Neutral",
    description:
      "Borrowing rates and utilization are within normal ranges — no strong directional signal.",
    tradFiAnalog:
      "Comparable to stable interbank lending rates and moderate credit activity.",
    bg: "bg-yellow-950/40",
    border: "border-yellow-500/50",
    text: "text-yellow-100",
    badge: "bg-yellow-500/20 text-yellow-400 ring-yellow-500/30",
  },
  "risk-off": {
    label: "Risk-Off",
    description:
      "Borrowing demand is low and capital is sitting idle — the market is in a defensive posture.",
    tradFiAnalog:
      "Analogous to a flight-to-quality environment with widening spreads and low loan demand.",
    bg: "bg-green-950/40",
    border: "border-green-500/50",
    text: "text-green-100",
    badge: "bg-green-500/20 text-green-400 ring-green-500/30",
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
      className={`rounded-lg border ${c.border} ${c.bg} ${c.text} px-5 py-4`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${c.badge}`}
            >
              {c.label}
            </span>
            <span className="text-xs opacity-60">{poolCount} pools</span>
          </div>
          <p className="text-sm leading-snug">{c.description}</p>
          <p className="text-xs italic opacity-70">{c.tradFiAnalog}</p>
        </div>

        <div className="flex shrink-0 gap-6 sm:text-right">
          <div>
            <p className="text-xs uppercase tracking-wide opacity-60">
              Stable Borrow
            </p>
            <p className="text-lg font-semibold">
              {weightedStableBorrowRate.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide opacity-60">
              Utilization
            </p>
            <p className="text-lg font-semibold">
              {weightedUtilization.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
