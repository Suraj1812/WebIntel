import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-primary/12 bg-primary/8 text-primary",
        muted: "border-border bg-muted/80 text-muted-foreground",
        accent: "border-accent/14 bg-accent/12 text-accent",
        outline: "border-border bg-transparent text-foreground",
        success: "border-emerald-500/18 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
        warning: "border-amber-500/18 bg-amber-500/12 text-amber-700 dark:text-amber-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
