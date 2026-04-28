import { cn, formatScore } from "@/lib/utils";

export function ScoreBar({
  label,
  score,
  detail,
  className,
}: {
  label: string;
  score: number;
  detail?: string;
  className?: string;
}) {
  const normalizedScore = formatScore(score);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="text-sm font-semibold text-foreground">{normalizedScore}</div>
      </div>
      <div className="metric-track h-2.5">
        <div className="metric-fill" style={{ width: `${normalizedScore}%` }} />
      </div>
      {detail ? <div className="text-xs leading-6 text-muted-foreground">{detail}</div> : null}
    </div>
  );
}
