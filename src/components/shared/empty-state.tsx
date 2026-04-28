import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="surface-muted rounded-[2rem] p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background/70 text-foreground">
        {icon}
      </div>
      <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em]">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
        {description}
      </p>
      {actionLabel && actionHref ? (
        <div className="mt-6">
          <Button asChild href={actionHref}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
