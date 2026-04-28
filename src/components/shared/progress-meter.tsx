import { formatNumber } from "@/lib/utils";

export function ProgressMeter({
  label,
  value,
  max,
  helper,
}: {
  label: string;
  value: number;
  max: number;
  helper: string;
}) {
  const percentage = Math.max(0, Math.min(100, Math.round((value / Math.max(max, 1)) * 100)));

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-foreground">
            {formatNumber(value)}
            <span className="ml-2 text-sm font-medium text-muted-foreground">/ {formatNumber(max)}</span>
          </div>
        </div>
        <div className="text-sm font-semibold text-foreground">{percentage}%</div>
      </div>
      <div className="metric-track">
        <div className="metric-fill" style={{ width: `${percentage}%` }} />
      </div>
      <p className="text-sm leading-6 text-muted-foreground">{helper}</p>
    </div>
  );
}
