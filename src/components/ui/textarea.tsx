import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-[1.4rem] border border-border bg-input px-4 py-3 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] outline-none transition duration-200 placeholder:text-muted-foreground focus:border-foreground/18 focus:ring-4 focus:ring-ring/70",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
