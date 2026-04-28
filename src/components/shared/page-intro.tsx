import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PageIntro({
  eyebrow,
  title,
  description,
  actions,
  metadata,
  className,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  metadata?: Array<{ label: string; value: string }>;
  className?: string;
}) {
  return (
    <div className={cn("space-y-5", className)}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          {eyebrow ? <Badge variant="accent">{eyebrow}</Badge> : null}
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">{title}</h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              {description}
            </p>
          </div>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
      {metadata?.length ? (
        <div className="flex flex-wrap gap-3">
          {metadata.map((item) => (
            <div
              key={item.label}
              className="surface-muted rounded-full px-4 py-2 text-sm"
            >
              <span className="text-muted-foreground">{item.label}</span>
              <span className="ml-2 font-semibold text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
