import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function BrandLockup({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="spotlight-ring relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-primary text-primary-foreground">
        <Image
          src="/brand/logo.svg"
          alt={APP_NAME}
          width={24}
          height={24}
          className="h-6 w-6"
          priority
        />
      </div>
      {!compact ? (
        <div className="min-w-0">
          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            WebIntel
          </div>
          <div className="text-[1.05rem] font-semibold tracking-[-0.04em] text-foreground">
            AI
          </div>
        </div>
      ) : null}
    </div>
  );
}
