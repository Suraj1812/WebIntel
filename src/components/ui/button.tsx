import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border text-sm font-medium tracking-[-0.01em] transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default:
          "border-primary bg-primary text-primary-foreground shadow-[0_16px_36px_-18px_rgba(15,24,39,0.9)] hover:-translate-y-px hover:bg-primary/94",
        secondary:
          "border-border bg-card text-secondary-foreground shadow-[0_10px_26px_-18px_rgba(15,24,39,0.4)] hover:-translate-y-px hover:border-foreground/14 hover:bg-card/90",
        ghost: "border-transparent bg-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground",
        outline:
          "border-border bg-background/72 text-foreground hover:border-foreground/16 hover:bg-card",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/92",
        quiet:
          "border-transparent bg-muted/65 text-foreground hover:bg-muted",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-6 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, href, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }));

    if (asChild && href) {
      return (
        <Link href={href} className={classes}>
          {props.children}
        </Link>
      );
    }

    return <button className={classes} ref={ref} {...props} />;
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
