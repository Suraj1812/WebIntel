import { cn } from "@/lib/utils";

export function ScoreRing({
  label,
  score,
  className,
}: {
  label: string;
  score: number;
  className?: string;
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.max(0, Math.min(100, score));
  const strokeOffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className={cn("rounded-[2rem] border border-border bg-background/72 p-5", className)}>
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 100 100" className="h-20 w-20">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            className="text-primary"
            transform="rotate(-90 50 50)"
          />
          <text
            x="50"
            y="54"
            textAnchor="middle"
            className="fill-foreground text-[22px] font-semibold"
          >
            {normalizedScore}
          </text>
        </svg>
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-lg font-semibold tracking-[-0.03em]">Signal strength</div>
          <div className="mt-1 text-sm text-muted-foreground">Higher means the report found stronger evidence here.</div>
        </div>
      </div>
    </div>
  );
}
